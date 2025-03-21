using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Course.Data.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Languages", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Languages",
                columns: new[] { "Id", "Description", "IsActive", "Name" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), "Start your learning journey and create a solid base for your studies with this English language course.", true, "English" },
                    { new Guid("00000000-0000-0000-0000-000000000002"), "Discover the rich Hispanic culture through this comprehensive Spanish language course.", true, "Spanish" },
                    { new Guid("00000000-0000-0000-0000-000000000003"), "Master the language of romance and diplomacy with our French course.", true, "French" },
                    { new Guid("00000000-0000-0000-0000-000000000004"), "Learn German and unlock opportunities in Europe's economic powerhouse.", true, "German" },
                    { new Guid("00000000-0000-0000-0000-000000000005"), "Immerse yourself in the beauty of Italian language and culture.", true, "Italian" },
                    { new Guid("00000000-0000-0000-0000-000000000006"), "Explore the fascinating world of Japanese language and traditions.", true, "Japanese" },
                    { new Guid("00000000-0000-0000-0000-000000000007"), "Master Mandarin Chinese and connect with over a billion speakers.", true, "Chinese" },
                    { new Guid("00000000-0000-0000-0000-000000000008"), "Learn Portugal and discover a rich literary and cultural heritage.", true, "Portugal" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Languages_Name",
                table: "Languages",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Languages");
        }
    }
}
