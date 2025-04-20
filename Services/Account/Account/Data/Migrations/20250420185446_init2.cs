using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Account.Data.Migrations
{
    /// <inheritdoc />
    public partial class init2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ContactId",
                table: "CustomerAccounts",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Street = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    HsApt = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    City = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Country = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Postcode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    CorrStreet = table.Column<string>(type: "text", nullable: false),
                    CorrHsApt = table.Column<string>(type: "text", nullable: false),
                    CorrCity = table.Column<string>(type: "text", nullable: false),
                    CorrCountry = table.Column<string>(type: "text", nullable: false),
                    CorrPostcode = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerContacts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Surname = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Gender = table.Column<int>(type: "integer", nullable: false),
                    TypeOfSettlement = table.Column<int>(type: "integer", nullable: false),
                    MiddleName = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    MaidenName = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    AddressId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerContacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerContacts_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAccounts_ContactId",
                table: "CustomerAccounts",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerContacts_AddressId",
                table: "CustomerContacts",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerAccounts_CustomerContacts_ContactId",
                table: "CustomerAccounts",
                column: "ContactId",
                principalTable: "CustomerContacts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerAccounts_CustomerContacts_ContactId",
                table: "CustomerAccounts");

            migrationBuilder.DropTable(
                name: "CustomerContacts");

            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_CustomerAccounts_ContactId",
                table: "CustomerAccounts");

            migrationBuilder.DropColumn(
                name: "ContactId",
                table: "CustomerAccounts");
        }
    }
}
