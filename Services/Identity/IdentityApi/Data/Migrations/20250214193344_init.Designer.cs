﻿// <auto-generated />
using System;
using IdentityApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IdentityApi.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250214193344_init")]
    partial class init
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("IdentityApi.Domain.Entities.ConfirmationCode", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("Expires")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("ConfirmationCodes");
                });

            modelBuilder.Entity("IdentityApi.Domain.Entities.RefreshToken", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Expires")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("RefreshTokens");
                });

            modelBuilder.Entity("IdentityApi.Domain.Entities.Role", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000001"),
                            Name = "Admin"
                        },
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000002"),
                            Name = "Customer"
                        });
                });

            modelBuilder.Entity("IdentityApi.Domain.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Age")
                        .HasColumnType("integer");

                    b.Property<int>("ConfirmFailedCount")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("ConfirmLockExpires")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("ConfirmLocked")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("CreateAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("DeleteAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("character varying(250)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<int>("LoginFailedCount")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("LoginLockExpires")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("LoginLocked")
                        .HasColumnType("boolean");

                    b.Property<byte[]>("PwdHash")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<byte[]>("PwdSalt")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("IdentityApi.Domain.Entities.ConfirmationCode", b =>
                {
                    b.HasOne("IdentityApi.Domain.Entities.User", "User")
                        .WithOne("ConfirmationCode")
                        .HasForeignKey("IdentityApi.Domain.Entities.ConfirmationCode", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("IdentityApi.Domain.Entities.RefreshToken", b =>
                {
                    b.HasOne("IdentityApi.Domain.Entities.User", "User")
                        .WithMany("RefreshTokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("IdentityApi.Domain.Entities.User", b =>
                {
                    b.HasOne("IdentityApi.Domain.Entities.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("IdentityApi.Domain.Entities.Role", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("IdentityApi.Domain.Entities.User", b =>
                {
                    b.Navigation("ConfirmationCode");

                    b.Navigation("RefreshTokens");
                });
#pragma warning restore 612, 618
        }
    }
}
