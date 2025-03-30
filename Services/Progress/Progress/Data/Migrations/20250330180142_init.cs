using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Progress.Data.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Step",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Step", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerProgress",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    StepId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerProgress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerProgress_Step_StepId",
                        column: x => x.StepId,
                        principalTable: "Step",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Step",
                columns: new[] { "Id", "Name", "Order" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), "Language", 1L },
                    { new Guid("00000000-0000-0000-0000-000000000002"), "School", 2L },
                    { new Guid("00000000-0000-0000-0000-000000000003"), "Course", 3L }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerProgress_StepId",
                table: "CustomerProgress",
                column: "StepId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerProgress_UserId",
                table: "CustomerProgress",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Step_Name",
                table: "Step",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Step_Order",
                table: "Step",
                column: "Order",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerProgress");

            migrationBuilder.DropTable(
                name: "Step");
        }
    }
}
