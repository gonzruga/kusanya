with campaigns as (

    select *
    from {{ ref('stg_campaigns') }}

),

contributions as (

    select *
    from {{ ref('stg_contributions') }}

)

select

    c.id,
    c.group_id,
    c.title,
    c.category,
    c.goal,
    c.status,
    c.start_date,
    c.end_date,

    count(con.id) as contribution_count,

    count(distinct con.member_id) as contributing_members,

    coalesce(sum(con.amount),0) as total_collected,

    c.goal - coalesce(sum(con.amount),0) as amount_remaining,

    round(
        coalesce(sum(con.amount),0)
        /
        nullif(c.goal,0)
        *100,
        2
    ) as percent_completed

from campaigns c

left join contributions con

on c.id = con.campaign_id

group by

    c.id,
    c.group_id,
    c.title,
    c.category,
    c.goal,
    c.status,
    c.start_date,
    c.end_date