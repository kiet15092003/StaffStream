using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeManagementAPI.Migrations
{
    public partial class fix6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "TblEmployee",
                newName: "FirstName");

            migrationBuilder.RenameColumn(
                name: "Doj",
                table: "TblEmployee",
                newName: "HireDate");

            migrationBuilder.RenameColumn(
                name: "Age",
                table: "TblEmployee",
                newName: "Salary");

            migrationBuilder.RenameColumn(
                name: "Designation",
                table: "TblDesignation",
                newName: "DesignationName");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentID",
                table: "TblEmployee",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TblDepartment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DepartmentName = table.Column<int>(type: "int", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDepartment", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TblProject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblProject", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TblEmployeeProject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TblEmployeeId = table.Column<int>(type: "int", nullable: false),
                    TblProjectId = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignmentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblEmployeeProject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TblEmployeeProject_TblEmployee_TblEmployeeId",
                        column: x => x.TblEmployeeId,
                        principalTable: "TblEmployee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblEmployeeProject_TblProject_TblProjectId",
                        column: x => x.TblProjectId,
                        principalTable: "TblProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblEmployee_DepartmentID",
                table: "TblEmployee",
                column: "DepartmentID");

            migrationBuilder.CreateIndex(
                name: "IX_TblEmployeeProject_TblEmployeeId",
                table: "TblEmployeeProject",
                column: "TblEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_TblEmployeeProject_TblProjectId",
                table: "TblEmployeeProject",
                column: "TblProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_TblEmployee_TblDepartment_DepartmentID",
                table: "TblEmployee",
                column: "DepartmentID",
                principalTable: "TblDepartment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblEmployee_TblDepartment_DepartmentID",
                table: "TblEmployee");

            migrationBuilder.DropTable(
                name: "TblDepartment");

            migrationBuilder.DropTable(
                name: "TblEmployeeProject");

            migrationBuilder.DropTable(
                name: "TblProject");

            migrationBuilder.DropIndex(
                name: "IX_TblEmployee_DepartmentID",
                table: "TblEmployee");

            migrationBuilder.DropColumn(
                name: "DepartmentID",
                table: "TblEmployee");

            migrationBuilder.RenameColumn(
                name: "Salary",
                table: "TblEmployee",
                newName: "Age");

            migrationBuilder.RenameColumn(
                name: "HireDate",
                table: "TblEmployee",
                newName: "Doj");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "TblEmployee",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "DesignationName",
                table: "TblDesignation",
                newName: "Designation");
        }
    }
}
