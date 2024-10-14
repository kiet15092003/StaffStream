using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementAPI.Context;
using EmployeeManagementAPI.Models;
using EmployeeManagementAPI.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace EmployeeManagementAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly EmployeeManagementContext _context;
        public enum TechType
        {
            Angular,
            DotNet,
            NodeJS,
            ReactJS,
            JavaSP,
            NestJS,
            AndroidNative,
            ReactNative,
            Flutter
        }
        public ProjectController(EmployeeManagementContext context)
        {
            _context = context;
        }
        // GET: api/Project
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblProject>>> GetTblProject()
        {
          if (_context.TblProject == null)
          {
              return NotFound();
          }
             return await _context.TblProject
            .Include(p => p.TblEmployeeTblProjects)
            .ThenInclude(ep => ep.TblEmployee)
                .ThenInclude(e=>e.Designation)
            .Include(p => p.TblEmployeeTblProjects)
                .ThenInclude(ep => ep.TblEmployee)
                .ThenInclude(e => e.Department)
            .ToListAsync();
        }

        // GET: api/Project/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblProject>> GetTblProject(int id)
        {
          if (_context.TblProject == null)
          {
              return NotFound();
          }
            var tblProject = await _context.TblProject.Include(p => p.TblEmployeeTblProjects)
            .ThenInclude(ep => ep.TblEmployee)
                .ThenInclude(e => e.Designation)
            .Include(p => p.TblEmployeeTblProjects)
                .ThenInclude(ep => ep.TblEmployee)
                .ThenInclude(e => e.Department).FirstOrDefaultAsync(p => p.Id == id);
            if (tblProject == null)
            {
                return NotFound();
            }
            return tblProject;
        }
        
        [HttpGet("TechType")]
        public async Task<ActionResult<List<string>>> GetAllTechType()
        {
            var techTypeList = new List<string>(Enum.GetNames(typeof(TechType)));
            return Ok(techTypeList);
        }

        // PUT: api/Project/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblProject(int id, TblProject tblProject)
        {
            if (id != tblProject.Id)
            {
                return BadRequest();
            }

            _context.Entry(tblProject).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TblProjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpGet("image/{fileName}")]
        [AllowAnonymous]
        public IActionResult GetEmployeeImage(string fileName)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "image/jpg";
            return File(fileBytes, contentType);
        }

        // POST: api/Project
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AddProjectDTO>> PostTblProject ( [FromForm] AddProjectDTO addProject)
        {
            if (_context.TblProject == null)
            {
                return Problem("Entity set 'EmployeeManagementContext.TblProject'  is null.");
            }
            string imagePath;
            if (addProject.image != null)
            {
                var fileName = Path.GetFileNameWithoutExtension(addProject.image.FileName);
                var extension = Path.GetExtension(addProject.image.FileName);
                fileName = $"{fileName}_{DateTime.Now:yyyyMMddHHmmssfff}{extension}";
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await addProject.image.CopyToAsync(stream);
                }

                imagePath = $"{fileName}";
            } else
            {
                imagePath = "projectDefault.jpg";
            }

            TblProject tblProject = new TblProject
            {
                ProjectName = addProject.ProjectName,
                StartDate = DateTime.Parse(addProject.StartDate, null, System.Globalization.DateTimeStyles.RoundtripKind),
                EndDate = DateTime.Parse(addProject.EndDate, null, System.Globalization.DateTimeStyles.RoundtripKind),
                Description = addProject.Description,
                ListTech = addProject.ListTech,
                image = imagePath
            };
            _context.TblProject.Add(tblProject);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        [HttpPost("AddEmpsToProject/{id}")]
        public async Task<ActionResult<AddEmpToProjectDTO[]>> AddEmpsToProject(AddEmpToProjectDTO[] emps, int id) 
        {
            foreach (AddEmpToProjectDTO emp in emps)
            {
                var empAdd = await _context.TblEmployee
                    .Include(e => e.TblEmployeeTblProjects)
                    .FirstOrDefaultAsync(e => e.Id == emp.EmpId);
                if (empAdd == null)
                {
                    return BadRequest($"Employee with ID {emp.EmpId} not found.");
                }

                var projectAdd = await _context.TblProject.Include(e => e.TblEmployeeTblProjects)
                    .FirstOrDefaultAsync(e => e.Id == id);
                if (projectAdd == null)
                {
                    return BadRequest();
                }
                foreach(TblEmployeeTblProject empExist in projectAdd.TblEmployeeTblProjects)
                {
                    if (empExist.TblEmployee.Id == empAdd.Id) {
                        return BadRequest(new { message = $"Employee with name {empAdd.FirstName} is already assigned to this project." });
                    }
                }
                TblEmployeeTblProject relationship = new TblEmployeeTblProject
                {
                    TblProjectId = id,
                    TblProject = projectAdd,
                    TblEmployee = empAdd,
                    TblEmployeeId = emp.EmpId,
                    Role = emp.Role,
                    AssignmentDate = DateTime.Parse(emp.AssignmentDate, null, System.Globalization.DateTimeStyles.RoundtripKind),
                };
                _context.TblEmployeeTblProject.Add(relationship);
                empAdd.TblEmployeeTblProjects.Add(relationship);
                projectAdd.TblEmployeeTblProjects.Add(relationship);
                await _context.SaveChangesAsync();
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Project/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblProject(int id)
        {
            if (_context.TblProject == null)
            {
                return NotFound();
            }
            var tblProject = await _context.TblProject.FindAsync(id);
            if (tblProject == null)
            {
                return NotFound();
            }
            _context.TblProject.Remove(tblProject);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TblProjectExists(int id)
        {
            return (_context.TblProject?.Any(e => e.Id == id)).GetValueOrDefault();
        }
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<TblProject>>> GetProjectBySearch (string? search)
        {
            var projects = await _context.TblProject
            .Include(p => p.TblEmployeeTblProjects)
                .ThenInclude(ep => ep.TblEmployee)
                    .ThenInclude(e => e.Designation)
            .Include(p => p.TblEmployeeTblProjects)
                .ThenInclude(ep => ep.TblEmployee)
                .ThenInclude(e => e.Department)
            .ToListAsync();
            if (string.IsNullOrEmpty(search))
            {
                return Ok(projects);
            }
            var filteredProjects = projects.Where(p =>
                p.ProjectName.Contains(search, StringComparison.OrdinalIgnoreCase)
            ).ToList();
            if (filteredProjects.Count == 0)
            {
                return NotFound(new { message = "No projects found matching the search criteria." });
            }
            return Ok(filteredProjects);
        }
        [HttpPut("UpdateEmps/{id}")]
        public async Task<IActionResult> PutEmpsInProject(int id, AddEmpToProjectDTO[] newEmps)
        {
            var project = _context.TblProject.Include(p=>p.TblEmployeeTblProjects).FirstOrDefault(p=>p.Id==id);
            if (project == null)
            {
                return BadRequest(new { message = "project not found" });
            } 
            else
            {
                foreach(TblEmployeeTblProject emp in project.TblEmployeeTblProjects)
                {
                    foreach(AddEmpToProjectDTO newEmp in newEmps)
                    {
                        if (emp.TblEmployeeId == newEmp.EmpId)
                        {
                            project.TblEmployeeTblProjects
                                .FirstOrDefault(emp=>emp.TblEmployeeId==newEmp.EmpId).Role = newEmp.Role;
                            project.TblEmployeeTblProjects
                                .FirstOrDefault(emp => emp.TblEmployeeId == newEmp.EmpId).AssignmentDate 
                                = DateTime.Parse(newEmp.AssignmentDate, null, System.Globalization.DateTimeStyles.RoundtripKind);
                            await _context.SaveChangesAsync();
                        }
                    }
                }
                await _context.SaveChangesAsync();
                return Ok(project);
            }
        }
        [HttpDelete("DeleteEmp/{id}")]
        public async Task<IActionResult> DeleteEmpInProject(int id, int empId)
        {
            var project = _context.TblProject.Include(p => p.TblEmployeeTblProjects).FirstOrDefault(p => p.Id == id);
            if (project == null)
            {
                return BadRequest(new { message = "project not found" });
            } 
            else
            {
                var emp = project.TblEmployeeTblProjects.FirstOrDefault(e => e.TblEmployeeId == empId);
                if (emp == null)
                {
                    return BadRequest(new { message = "Employee not in project" });
                }
                _context.TblEmployeeTblProject.Remove(emp);
                await _context.SaveChangesAsync();
            }
            return Ok(project);
        }
    }
}