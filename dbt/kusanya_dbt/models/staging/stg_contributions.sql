select

id,
"campaignId" as campaign_id,
"memberId" as member_id,
"mobileNumber" as mobile_number,
amount,
status,
provider,
"transactionReference" as transaction_reference,
"createdAt" as created_at

from {{ source('public', 'Contribution') }}