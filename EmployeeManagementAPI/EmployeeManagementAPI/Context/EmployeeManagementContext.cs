using EmployeeManagementAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace EmployeeManagementAPI.Context
{
    // Custom Enum List to String Converter
    

    public class EmployeeManagementContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public EmployeeManagementContext(DbContextOptions<EmployeeManagementContext> context)
            : base(context)
        {
        }

        public DbSet<TblEmployee> TblEmployee { get; set; }
        public DbSet<TblDesignation> TblDesignation { get; set; }
        public DbSet<TblDepartment> TblDepartment { get; set; }
        public DbSet<TblEmployeeTblProject> TblEmployeeTblProject { get; set; }
        public DbSet<TblProject> TblProject { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the value conversion for ListTech
            modelBuilder.Entity<TblProject>()
                .Property(p => p.ListTech)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries))
                .HasColumnType("nvarchar(max)"); // or another appropriate column type

            // Configure Identity schema
            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<ApplicationRole>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
        }
    }
}
