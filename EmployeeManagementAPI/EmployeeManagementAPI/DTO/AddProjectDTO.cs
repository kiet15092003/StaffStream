using EmployeeManagementAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementAPI.DTO
{
    public class AddProjectDTO
    {
        public string ProjectName { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public IFormFile? image { get; set; }
        public string Description { get; set; }
        public string[] ListTech { get; set; }
    }
}