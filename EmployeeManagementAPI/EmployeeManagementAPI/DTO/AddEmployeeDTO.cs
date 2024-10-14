namespace EmployeeManagementAPI.DTO
{
    public class AddEmployeeDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int Salary { get; set; }
        public string HireDate { get; set; }
        public string Gender { get; set; }
        public int IsMarried { get; set; }
        public int DesignationID { get; set; }
        public int DepartmentID { get; set; }
        public IFormFile? image { get; set; }
    }
}