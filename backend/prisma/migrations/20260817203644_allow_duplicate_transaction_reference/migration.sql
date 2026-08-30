-- CreateTable
CREATE TABLE "campaign_performance" (
    "id" TEXT,
    "group_id" TEXT,
    "title" TEXT,
    "category" "CampaignCategory",
    "goal" DECIMAL(10,2),
    "status" "CampaignStatus",
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "contribution_count" BIGINT,
    "contributing_members" BIGINT,
    "total_collected" DECIMAL,
    "amount_remaining" DECIMAL,
    "percent_completed" DECIMAL
);

-- CreateTable
CREATE TABLE "group_leaderboard" (
    "id" TEXT,
    "name" TEXT,
    "campaigns" BIGINT,
    "contributions" BIGINT,
    "total_amount" DECIMAL,
    "average_contribution" DECIMAL
);

-- CreateTable
CREATE TABLE "member_leaderboard" (
    "id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "mobile_number" TEXT,
    "contributions" BIGINT,
    "total_paid" DECIMAL,
    "average_payment" DECIMAL,
    "last_payment" TIMESTAMP(6)
);

-- CreateTable
CREATE TABLE "monthly_contributions" (
    "month" TIMESTAMP(6),
    "contributions" BIGINT,
    "unique_members" BIGINT,
    "total_amount" DECIMAL,
    "average_amount" DECIMAL
);
