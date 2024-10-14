using EmployeeManagementAPI.Models;

namespace EmployeeManagementAPI.DTO
{
    public class GetEmployeeByIdDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int Salary { get; set; }
        public DateTime HireDate { get; set; }
        public string Gender { get; set; }
        public int IsMarried { get; set; }
        public int IsActive { get; set; }
        public int DesignationID { get; set; }
        public int DepartmentID { get; set; }
        public IFormFile image { get; set; }
        public TblDesignation Designation { get; set; } = null!;
        public ICollection<TblEmployeeTblProject> TblEmployeeTblProjects { get; set; } = new List<TblEmployeeTblProject>();
        public TblDepartment Department { get; set; } = null!;

    }
}
