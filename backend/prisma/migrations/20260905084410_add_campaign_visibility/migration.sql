/*
  Warnings:

  - You are about to drop the column `visibilty` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ContributionStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "visibilty",
ADD COLUMN     "visibility" "CampaignVisibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "Contribution" ALTER COLUMN "status" SET DEFAULT 'SUCCESSFUL';
