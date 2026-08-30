select

id,
"firstName" as first_name,
"lastName" as last_name,
email,
"mobileNumber" as mobile_number,
role,
status,
"createdAt" as created_at,
"updatedAt" as updated_at

from {{ source('public', 'User') }}