select

id,
name,
description,
currency,
"ownerId" as owner_id,
status,
"createdAt" as created_at,
"updatedAt" as updated_at

from {{ source('public', 'Group') }}