using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addfavandshiper3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_AspNetUsers_APIUserId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_APIUserId",
                table: "Products");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8fc3dc5d-4afb-4ac8-9e1f-4e6f1f999b27");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a6775f03-7b1c-4d59-939f-325c27072074");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b65bb868-993f-464e-89a0-93096da299b9");

            migrationBuilder.DropColumn(
                name: "APIUserId",
                table: "Products");

            migrationBuilder.CreateTable(
                name: "APIUserProduct",
                columns: table => new
                {
                    FavoriteProductsId = table.Column<int>(type: "int", nullable: false),
                    FavoritedUsersId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_APIUserProduct", x => new { x.FavoriteProductsId, x.FavoritedUsersId });
                    table.ForeignKey(
                        name: "FK_APIUserProduct_AspNetUsers_FavoritedUsersId",
                        column: x => x.FavoritedUsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_APIUserProduct_Products_FavoriteProductsId",
                        column: x => x.FavoriteProductsId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a274263e-4ba3-489b-a069-f1d9aa737ca1", "21e5f4f9-45e9-44f0-979c-790dbff1ca3e", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "252b0267-0c79-483b-9ae5-a246109ce681", "b540a009-16f1-4230-8e49-36b1ed04bb7c", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "7576c53c-1f98-4730-9f92-a2acc8905875", "f46484fc-c05f-4722-aec7-8d5745657ccb", "Shipper", "SHIPPER" });

            migrationBuilder.CreateIndex(
                name: "IX_APIUserProduct_FavoritedUsersId",
                table: "APIUserProduct",
                column: "FavoritedUsersId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "APIUserProduct");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "252b0267-0c79-483b-9ae5-a246109ce681");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7576c53c-1f98-4730-9f92-a2acc8905875");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a274263e-4ba3-489b-a069-f1d9aa737ca1");

            migrationBuilder.AddColumn<string>(
                name: "APIUserId",
                table: "Products",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a6775f03-7b1c-4d59-939f-325c27072074", "2e7dc75b-2979-4069-b282-06895951507b", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b65bb868-993f-464e-89a0-93096da299b9", "af3e2943-fe37-4143-886c-613de5fe4de0", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "8fc3dc5d-4afb-4ac8-9e1f-4e6f1f999b27", "d50dc936-77b4-46f5-a534-11c13e7e5c7e", "Shipper", "SHIPPER" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_APIUserId",
                table: "Products",
                column: "APIUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_AspNetUsers_APIUserId",
                table: "Products",
                column: "APIUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
