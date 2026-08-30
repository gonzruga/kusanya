{{ config(materialized='table') }}

select

    -- c.campaign_id,
    c.id as campaign_id,
    c.title as campaign_name,
    g.id as group_id,
    g.name,

    count(con.id) as number_of_contributions,

    sum(con.amount) as total_amount,

    avg(con.amount) as average_contribution,

    min(con.amount) as minimum_contribution,

    max(con.amount) as maximum_contribution,

    count(distinct con.member_id) as unique_contributors

from {{ ref('stg_campaigns') }} c

left join {{ ref('stg_groups') }} g
    on c.group_id = g.id
    

left join {{ ref('stg_contributions') }} con
    on c.id = con.campaign_id

group by

    c.id,
    c.title,
    g.name,
    g.id