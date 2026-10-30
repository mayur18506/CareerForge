using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CareerForge.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLearningGoalUserRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_LearningGoals_UserId",
                table: "LearningGoals",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_LearningGoals_Users_UserId",
                table: "LearningGoals",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LearningGoals_Users_UserId",
                table: "LearningGoals");

            migrationBuilder.DropIndex(
                name: "IX_LearningGoals_UserId",
                table: "LearningGoals");
        }
    }
}
