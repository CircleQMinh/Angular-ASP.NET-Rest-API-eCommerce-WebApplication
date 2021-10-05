using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class promotion2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "36a77da3-4168-4f65-83d9-2d1587d82444");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "389dfa14-1969-4118-bb1b-1981dc39e412");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3f882e8f-623f-48ad-930b-516b3eba97d5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "db5372d3-8b26-45bf-b62c-cfb86698e921");

            migrationBuilder.CreateTable(
                name: "Promotions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Promotions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PromotionInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    PromotionId = table.Column<int>(type: "int", nullable: false),
                    PromotionPercent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PromotionAmount = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PromotionInfos_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PromotionInfos_Promotions_PromotionId",
                        column: x => x.PromotionId,
                        principalTable: "Promotions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7a481140-5bfc-4740-8ce3-d58696d41c5b", "c2fbd559-b118-404c-822a-cadee2b005f3", "User", "USER" },
                    { "c3b12aee-97d8-4d24-bd78-d75f92af509a", "c1f098b0-7342-4693-8586-ad09f4453e15", "Administrator", "ADMINISTRATOR" },
                    { "f4f7eca9-2644-4ea6-9428-4fdcf4a62a91", "de89a5b3-c9bf-49b5-97c4-e2db429285dd", "Employee", "EMPLOYEE" },
                    { "e56937cc-21e5-4345-9661-7f0443c5e131", "36b47132-d78c-47f7-93dc-9ed14ff90a9e", "Shipper", "SHIPPER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PromotionInfos_ProductId",
                table: "PromotionInfos",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionInfos_PromotionId",
                table: "PromotionInfos",
                column: "PromotionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PromotionInfos");

            migrationBuilder.DropTable(
                name: "Promotions");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7a481140-5bfc-4740-8ce3-d58696d41c5b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c3b12aee-97d8-4d24-bd78-d75f92af509a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e56937cc-21e5-4345-9661-7f0443c5e131");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f4f7eca9-2644-4ea6-9428-4fdcf4a62a91");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "db5372d3-8b26-45bf-b62c-cfb86698e921", "7f83934b-550d-4383-bc00-296d25d2a20f", "User", "USER" },
                    { "36a77da3-4168-4f65-83d9-2d1587d82444", "f18d1a7d-7f1c-4dfa-87e2-bc7a0eea71e5", "Administrator", "ADMINISTRATOR" },
                    { "389dfa14-1969-4118-bb1b-1981dc39e412", "26f5fc4a-a916-4f7e-b724-99a0c5c3020a", "Employee", "EMPLOYEE" },
                    { "3f882e8f-623f-48ad-930b-516b3eba97d5", "f5cf3f22-5d7c-4689-b3c2-6c53e92726f7", "Shipper", "SHIPPER" }
                });
        }
    }
}
