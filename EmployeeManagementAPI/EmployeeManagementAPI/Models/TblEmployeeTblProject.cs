using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagementAPI.Models
{
    public class TblEmployeeTblProject
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int TblEmployeeId { get; set; }
        [Required]
        public int TblProjectId { get; set; }
        [Required]
        public TblEmployee TblEmployee { get; set; } = new TblEmployee();
        [Required]
        public TblProject TblProject { get; set; } = new TblProject();
        [Required]
        public string Role { get; set; }
        public DateTime AssignmentDate { get; set; }
    }
}
