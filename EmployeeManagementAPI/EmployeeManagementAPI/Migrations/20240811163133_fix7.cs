using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeManagementAPI.Migrations
{
    public partial class fix7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblEmployeeProject_TblEmployee_TblEmployeeId",
                table: "TblEmployeeProject");

            migrationBuilder.DropForeignKey(
                name: "FK_TblEmployeeProject_TblProject_TblProjectId",
                table: "TblEmployeeProject");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TblEmployeeProject",
                table: "TblEmployeeProject");

            migrationBuilder.RenameTable(
                name: "TblEmployeeProject",
                newName: "TblEmployeeTblProject");

            migrationBuilder.RenameIndex(
                name: "IX_TblEmployeeProject_TblProjectId",
                table: "TblEmployeeTblProject",
                newName: "IX_TblEmployeeTblProject_TblProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_TblEmployeeProject_TblEmployeeId",
                table: "TblEmployeeTblProject",
                newName: "IX_TblEmployeeTblProject_TblEmployeeId");

            migrationBuilder.AlterColumn<string>(
                name: "DepartmentName",
                table: "TblDepartment",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TblEmployeeTblProject",
                table: "TblEmployeeTblProject",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TblEmployeeTblProject_TblEmployee_TblEmployeeId",
                table: "TblEmployeeTblProject",
                column: "TblEmployeeId",
                principalTable: "TblEmployee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TblEmployeeTblProject_TblProject_TblProjectId",
                table: "TblEmployeeTblProject",
                column: "TblProjectId",
                principalTable: "TblProject",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblEmployeeTblProject_TblEmployee_TblEmployeeId",
                table: "TblEmployeeTblProject");

            migrationBuilder.DropForeignKey(
                name: "FK_TblEmployeeTblProject_TblProject_TblProjectId",
                table: "TblEmployeeTblProject");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TblEmployeeTblProject",
                table: "TblEmployeeTblProject");

            migrationBuilder.RenameTable(
                name: "TblEmployeeTblProject",
                newName: "TblEmployeeProject");

            migrationBuilder.RenameIndex(
                name: "IX_TblEmployeeTblProject_TblProjectId",
                table: "TblEmployeeProject",
                newName: "IX_TblEmployeeProject_TblProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_TblEmployeeTblProject_TblEmployeeId",
                table: "TblEmployeeProject",
                newName: "IX_TblEmployeeProject_TblEmployeeId");

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentName",
                table: "TblDepartment",
                type: "int",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TblEmployeeProject",
                table: "TblEmployeeProject",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TblEmployeeProject_TblEmployee_TblEmployeeId",
                table: "TblEmployeeProject",
                column: "TblEmployeeId",
                principalTable: "TblEmployee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TblEmployeeProject_TblProject_TblProjectId",
                table: "TblEmployeeProject",
                column: "TblProjectId",
                principalTable: "TblProject",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
