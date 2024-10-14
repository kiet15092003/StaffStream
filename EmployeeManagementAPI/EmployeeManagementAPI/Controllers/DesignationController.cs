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
    public class DesignationController : ControllerBase
    {
        private readonly EmployeeManagementContext _context;

        public DesignationController(EmployeeManagementContext context)
        {
            _context = context;
        }

        // GET: api/Designation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblDesignation>>> GetTblDesignation()
        {
          if (_context.TblDesignation == null)
          {
              return NotFound();
          }
            return await _context.TblDesignation.Include(d => d.Employees).ToListAsync();
        }

        // GET: api/Designation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblDesignation>> GetTblDesignation(int id)
        {
          if (_context.TblDesignation == null)
          {
              return NotFound();
          }
            var tblDesignation = await _context.TblDesignation.FindAsync(id);

            if (tblDesignation == null)
            {
                return NotFound();
            }

            return tblDesignation;
        }

        // PUT: api/Designation/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblDesignation(int id, TblDesignation tblDesignation)
        {
            if (id != tblDesignation.Id)
            {
                return BadRequest();
            }

            _context.Entry(tblDesignation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TblDesignationExists(id))
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

        // POST: api/Designation
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AddDesignationDTO>> PostTblDesignation(AddDesignationDTO designationDto)
        {
            if (_context.TblDesignation == null)
            {
                return Problem("Entity set 'EmployeeManagementContext.TblDesignation' is null.");
            }

            var tblDesignation = new TblDesignation
            {
                DesignationName = designationDto.DesignationName
            };

            _context.TblDesignation.Add(tblDesignation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Designation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblDesignation(int id)
        {
            if (_context.TblDesignation == null)
            {
                return NotFound();
            }
            var tblDesignation = await _context.TblDesignation.FindAsync(id);
            if (tblDesignation == null)
            {
                return NotFound();
            }

            _context.TblDesignation.Remove(tblDesignation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TblDesignationExists(int id)
        {
            return (_context.TblDesignation?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
