using EmployeeManagementAPI.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class TblProject
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public string ProjectName { get; set; }
    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime EndDate { get; set; }
    [Required]
    public string image { get; set; }
    [Required]
    public string Description { get; set; }

    public string[] ListTech { get; set; }

    public ICollection<TblEmployeeTblProject> TblEmployeeTblProjects { get; set; } = new List<TblEmployeeTblProject>();
}
