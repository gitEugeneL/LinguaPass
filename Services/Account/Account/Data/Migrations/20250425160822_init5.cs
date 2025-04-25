using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Account.Data.Migrations
{
    /// <inheritdoc />
    public partial class init5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PersonalId",
                table: "CustomerAccounts",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CustomerPersonals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Birthday = table.Column<DateOnly>(type: "date", nullable: false),
                    CountryOfBirth = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    FathersName = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    MothersName = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Nationality = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    IdNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CountryOfIssue = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ContactName = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ContactSurname = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Relationship = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ContactPhone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    EducationLevel = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerPersonals", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAccounts_PersonalId",
                table: "CustomerAccounts",
                column: "PersonalId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerAccounts_CustomerPersonals_PersonalId",
                table: "CustomerAccounts",
                column: "PersonalId",
                principalTable: "CustomerPersonals",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerAccounts_CustomerPersonals_PersonalId",
                table: "CustomerAccounts");

            migrationBuilder.DropTable(
                name: "CustomerPersonals");

            migrationBuilder.DropIndex(
                name: "IX_CustomerAccounts_PersonalId",
                table: "CustomerAccounts");

            migrationBuilder.DropColumn(
                name: "PersonalId",
                table: "CustomerAccounts");
        }
    }
}
