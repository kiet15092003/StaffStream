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
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeManagementContext _context;

        public EmployeeController(EmployeeManagementContext context)
        {
            _context = context;
        }

        // GET: api/Employee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblEmployee>>> GetTblEmployee()
        {
          if (_context.TblEmployee == null)
          {
              return NotFound();
          }
            return await _context.TblEmployee
                .Include(e => e.Designation)
                .Include(e=>e.Department)
                .Include(e=>e.TblEmployeeTblProjects)
                .ThenInclude(ep => ep.TblProject)
                .ToListAsync();
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
        // GET: api/Employee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblEmployee>> GetTblEmployee(int id)
        {
          if (_context.TblEmployee == null)
          {
              return NotFound();
          }
            var tblEmployee = await _context.TblEmployee
                .Include(e => e.Designation)
                .Include(e => e.Department)
                .Include(e => e.TblEmployeeTblProjects)
                    .ThenInclude(ep => ep.TblProject)
                        .ThenInclude(p => p.TblEmployeeTblProjects) 
                            .ThenInclude(e => e.TblEmployee)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (tblEmployee == null)
            {
                return NotFound();
            }

            return tblEmployee;
        }       
        // PUT: api/Employee/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblEmployee(int id, [FromForm] AddEmployeeDTO tblEmployee)
        {
            var tblEmpToEdit = await _context.TblEmployee.FirstOrDefaultAsync(e=>e.Id==id);   
            if (tblEmpToEdit == null) 
            { 
                return NotFound();
            }
            else
            {
                string imagePath = null;
                if (tblEmployee.image != null)
                {
                    var fileName = Path.GetFileNameWithoutExtension(tblEmployee.image.FileName);
                    var extension = Path.GetExtension(tblEmployee.image.FileName);
                    fileName = $"{fileName}_{DateTime.Now:yyyyMMddHHmmssfff}{extension}";
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await tblEmployee.image.CopyToAsync(stream);
                    }

                    imagePath = $"{fileName}";
                }
                var newDepartment = _context.TblDepartment.FirstOrDefault(e=>e.Id== tblEmployee.DepartmentID);
                var newDesignation = _context.TblDesignation.FirstOrDefault(e => e.Id == tblEmployee.DesignationID);
                tblEmpToEdit.FirstName = tblEmployee.FirstName; 
                tblEmpToEdit.LastName = tblEmployee.LastName;
                tblEmpToEdit.Email = tblEmployee.Email;
                tblEmpToEdit.Salary = tblEmployee.Salary;
                tblEmpToEdit.HireDate = DateTime.Parse(tblEmployee.HireDate, null, System.Globalization.DateTimeStyles.RoundtripKind);
                tblEmpToEdit.DepartmentID = tblEmployee.DepartmentID;
                tblEmpToEdit.DesignationID = tblEmployee.DesignationID;
                tblEmpToEdit.Department = newDepartment;
                tblEmpToEdit.Designation = newDesignation;
                tblEmpToEdit.Gender = tblEmployee.Gender;
                tblEmpToEdit.image = imagePath;
                await _context.SaveChangesAsync();
            }
            return NoContent();
        }
        // POST: api/Employee
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AddEmployeeDTO>> PostTblEmployee([FromForm] AddEmployeeDTO addEmployeeDTO)
        {
            if (_context.TblEmployee == null || _context.TblDesignation == null)
            {
                return Problem("Entity sets 'TblEmployee' or 'TblDesignation' are null.");
            }
            var tblDesignation = await _context.TblDesignation.FindAsync(addEmployeeDTO.DesignationID);
            if (tblDesignation == null)
            {
                return NotFound("Designation not found.");
            }

            var tblDepartment = 
                await _context.TblDepartment.FindAsync(addEmployeeDTO.DepartmentID);
            if (tblDepartment == null)
            {
                return NotFound("Department not found.");
            }

            // Handle file upload
            string imagePath = null;
            if (addEmployeeDTO.image != null)
            {
                var fileName = Path.GetFileNameWithoutExtension(addEmployeeDTO.image.FileName);
                var extension = Path.GetExtension(addEmployeeDTO.image.FileName);
                fileName = $"{fileName}_{DateTime.Now:yyyyMMddHHmmssfff}{extension}";
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await addEmployeeDTO.image.CopyToAsync(stream);
                }

                imagePath = $"{fileName}";
            }
            else
            {
                imagePath = "employeeDefault.jpg";
            }

            var tblEmployee = new TblEmployee
            {
                FirstName = addEmployeeDTO.FirstName,
                LastName = addEmployeeDTO.LastName,
                Email = addEmployeeDTO.Email,
                Salary = addEmployeeDTO.Salary,
                HireDate = DateTime.Parse(addEmployeeDTO.HireDate, null, System.Globalization.DateTimeStyles.RoundtripKind),
                Gender = addEmployeeDTO.Gender,
                IsMarried = addEmployeeDTO.IsMarried,
                DesignationID = addEmployeeDTO.DesignationID,
                Designation = tblDesignation,
                Department = tblDepartment,
                DepartmentID = addEmployeeDTO.DepartmentID,
                image = imagePath
            };

            _context.TblEmployee.Add(tblEmployee);
            tblDesignation.Employees.Add(tblEmployee);
            tblDepartment.Employees.Add(tblEmployee);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTblEmployee), new { id = tblEmployee.Id }, addEmployeeDTO);
        }
        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblEmployee(int id)
        {
            if (_context.TblEmployee == null)
            {
                return NotFound();
            }
            var tblEmployee = await _context.TblEmployee.FindAsync(id);
            if (tblEmployee == null)
            {
                return NotFound();
            }
            _context.TblEmployee.Remove(tblEmployee);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost("deleteMultiEmp")]
        public async Task<ActionResult> DeleteMultiEmployee(int[] ids)
        {
            if (_context.TblEmployee == null)
            {
                return NotFound();   
            }
            foreach (int id in ids)
            {
                var tblEmp = await _context.TblEmployee.FindAsync(id);
                if (tblEmp == null)
                {
                    return NotFound();
                }
                _context.TblEmployee.Remove(tblEmp);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<TblEmployee>>> GetTblEmployeeSearch(
            [FromQuery] string search
            )
        {
            if (_context.TblEmployee == null)
            {
                return NotFound();
            }
            var query = _context.TblEmployee.Include(e=>e.Designation).AsQueryable();
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(
                    e => e.FirstName.Contains(search));
            }
            return await query.ToListAsync();
        } 
        private bool TblEmployeeExists(int id)
        {
            return (_context.TblEmployee?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
