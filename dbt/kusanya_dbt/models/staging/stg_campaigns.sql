select

id,
"groupId" as group_id,
title,
description,
category,
goal,
status,
-- "campaignCode" as campaign_code,
"startDate" as start_date,
"endDate" as end_date,
"createdAt" as created_at

from {{ source('public', 'Campaign') }}