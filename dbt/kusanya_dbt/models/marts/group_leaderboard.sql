with groups as (

    select *
    from {{ ref('stg_groups') }}

),

campaigns as (

    select *
    from {{ ref('stg_campaigns') }}

),

contributions as (

    select *
    from {{ ref('stg_contributions') }}

)

select

    g.id,
    g.name,

    count(distinct campaigns.id) as campaigns,

    count(contributions.id) as contributions,

    sum(contributions.amount) as total_amount,

    avg(contributions.amount) as average_contribution

from groups g

left join campaigns

on campaigns.group_id=g.id

left join contributions

on campaigns.id=contributions.campaign_id

group by

    g.id,
    g.name