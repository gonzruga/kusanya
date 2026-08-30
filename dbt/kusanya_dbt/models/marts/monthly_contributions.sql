select

    date_trunc('month', created_at) as month,

    count(*) as contributions,

    count(distinct member_id) as unique_members,

    sum(amount) as total_amount,

    avg(amount) as average_amount

from {{ ref('stg_contributions') }}

group by

    date_trunc('month', created_at)

order by month