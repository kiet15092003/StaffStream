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
    public class DepartmentController : ControllerBase
    {
        private readonly EmployeeManagementContext _context;

        public DepartmentController(EmployeeManagementContext context)
        {
            _context = context;
        }

        // GET: api/TblDepartments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblDepartment>>> GetTblDepartment()
        {
          if (_context.TblDepartment == null)
          {
              return NotFound();
          }
            return await _context.TblDepartment.Include(d=>d.Employees).ToListAsync();
        }

        // GET: api/TblDepartments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblDepartment>> GetTblDepartment(int id)
        {
          if (_context.TblDepartment == null)
          {
              return NotFound();
          }
            var tblDepartment = await _context.TblDepartment.FindAsync(id);

            if (tblDepartment == null)
            {
                return NotFound();
            }

            return tblDepartment;
        }

        // PUT: api/TblDepartments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblDepartment(int id, TblDepartment tblDepartment)
        {
            if (id != tblDepartment.Id)
            {
                return BadRequest();
            }

            _context.Entry(tblDepartment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TblDepartmentExists(id))
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

        // POST: api/TblDepartments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AddDepartmentDTO>> PostTblDepartment(AddDepartmentDTO addDepartmentDTO)
        {
          if (_context.TblDepartment == null)
          {
              return Problem("Entity set 'EmployeeManagementContext.TblDepartment'  is null.");
          }
            var tblDepartment = new TblDepartment
            {
                DepartmentName = addDepartmentDTO.DepartmentName
            };
            _context.TblDepartment.Add(tblDepartment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/TblDepartments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblDepartment(int id)
        {
            if (_context.TblDepartment == null)
            {
                return NotFound();
            }
            var tblDepartment = await _context.TblDepartment.FindAsync(id);
            if (tblDepartment == null)
            {
                return NotFound();
            }

            _context.TblDepartment.Remove(tblDepartment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TblDepartmentExists(int id)
        {
            return (_context.TblDepartment?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
