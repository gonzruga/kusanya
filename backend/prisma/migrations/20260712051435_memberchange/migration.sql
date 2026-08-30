/*
  Warnings:

  - You are about to drop the column `isActive` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId,mobileNumber]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GroupStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED', 'ARCHIVED');

-- AlterEnum
ALTER TYPE "CampaignStatus" ADD VALUE 'ARCHIVED';

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_memberId_fkey";

-- DropIndex
DROP INDEX "Group_isActive_idx";

-- DropIndex
DROP INDEX "Member_mobileNumber_key";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "currency" VARCHAR(3) NOT NULL DEFAULT 'TZS',
ADD COLUMN     "providerReference" TEXT;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "isActive",
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "currency" VARCHAR(3) NOT NULL DEFAULT 'TZS',
ADD COLUMN     "status" "GroupStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "defaultContribution" DECIMAL(10,2),
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "role" "RoleInGroup" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "Membership";

-- DropEnum
DROP TYPE "MembershipStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_code_key" ON "Campaign"("code");

-- CreateIndex
CREATE INDEX "Campaign_groupId_idx" ON "Campaign"("groupId");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Contribution_mobileNumber_idx" ON "Contribution"("mobileNumber");

-- CreateIndex
CREATE INDEX "Contribution_transactionReference_idx" ON "Contribution"("transactionReference");

-- CreateIndex
CREATE INDEX "Group_status_idx" ON "Group"("status");

-- CreateIndex
CREATE INDEX "Member_groupId_idx" ON "Member"("groupId");

-- CreateIndex
CREATE INDEX "Member_mobileNumber_idx" ON "Member"("mobileNumber");

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "Member"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Member_groupId_mobileNumber_key" ON "Member"("groupId", "mobileNumber");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
