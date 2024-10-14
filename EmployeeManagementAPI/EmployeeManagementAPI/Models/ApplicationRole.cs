using Microsoft.AspNetCore.Identity;

namespace EmployeeManagementAPI.Models
{
    public class ApplicationRole : IdentityRole
    {
        public ApplicationRole() : base() { }

        public ApplicationRole(string roleName) : base(roleName)
        {
        }
    }
}
