select

id,
"groupId" as group_id,
"firstName" as first_name,
"lastName" as last_name,
"mobileNumber" as mobile_number,
"defaultContribution" as default_contribution,
role,
status,
"createdAt" as created_at

from {{ source('public', 'Member') }}