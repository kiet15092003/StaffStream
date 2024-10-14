using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagementAPI.Models
{
    public class TblEmployee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(150)]
        [Required]
        public string FirstName { get; set; }

        [StringLength(150)]
        [Required]
        public string LastName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public int Salary { get; set; }

        [Required]
        public DateTime HireDate { get; set; }

        [StringLength(10)]
        [Required]
        public string Gender { get; set; }

        [Required]
        public int IsMarried { get; set; }

        [Required]
        public int DesignationID { get; set; }
        public TblDesignation Designation { get; set; } = null!;
        [Required]
        public int DepartmentID { get; set; }
        public TblDepartment Department { get; set; } = null!;
        public ICollection<TblEmployeeTblProject> TblEmployeeTblProjects { get; set; } = new List<TblEmployeeTblProject>();
        public string image { get; set; }
    }
}