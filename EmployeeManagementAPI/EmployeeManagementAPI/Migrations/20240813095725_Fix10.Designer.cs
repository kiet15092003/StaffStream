﻿// <auto-generated />
using System;
using EmployeeManagementAPI.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace EmployeeManagementAPI.Migrations
{
    [DbContext(typeof(EmployeeManagementContext))]
    [Migration("20240813095725_Fix10")]
    partial class Fix10
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.32")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblDepartment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("DepartmentName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.ToTable("TblDepartment");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblDesignation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("DesignationName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("TblDesignation");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblEmployee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("DepartmentID")
                        .HasColumnType("int");

                    b.Property<int>("DesignationID")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("nvarchar(150)");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<DateTime>("HireDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("IsMarried")
                        .HasColumnType("int");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("nvarchar(150)");

                    b.Property<int>("Salary")
                        .HasColumnType("int");

                    b.Property<string>("image")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentID");

                    b.HasIndex("DesignationID");

                    b.ToTable("TblEmployee");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblEmployeeTblProject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<DateTime>("AssignmentDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TblEmployeeId")
                        .HasColumnType("int");

                    b.Property<int>("TblProjectId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("TblEmployeeId");

                    b.HasIndex("TblProjectId");

                    b.ToTable("TblEmployeeTblProject");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblProject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("ProjectName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("TblProject");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblEmployee", b =>
                {
                    b.HasOne("EmployeeManagementAPI.Models.TblDepartment", "Department")
                        .WithMany("Employees")
                        .HasForeignKey("DepartmentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("EmployeeManagementAPI.Models.TblDesignation", "Designation")
                        .WithMany("Employees")
                        .HasForeignKey("DesignationID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");

                    b.Navigation("Designation");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblEmployeeTblProject", b =>
                {
                    b.HasOne("EmployeeManagementAPI.Models.TblEmployee", "TblEmployee")
                        .WithMany("TblEmployeeTblProjects")
                        .HasForeignKey("TblEmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("EmployeeManagementAPI.Models.TblProject", "TblProject")
                        .WithMany("TblEmployeeTblProjects")
                        .HasForeignKey("TblProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TblEmployee");

                    b.Navigation("TblProject");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblDepartment", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblDesignation", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblEmployee", b =>
                {
                    b.Navigation("TblEmployeeTblProjects");
                });

            modelBuilder.Entity("EmployeeManagementAPI.Models.TblProject", b =>
                {
                    b.Navigation("TblEmployeeTblProjects");
                });
#pragma warning restore 612, 618
        }
    }
}
