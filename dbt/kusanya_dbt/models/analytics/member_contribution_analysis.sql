{{ config(materialized='table') }}

select

    m.id as member_id,

    concat(
        m.first_name,
        ' ',
        m.last_name
    ) as member_name,

    m.mobile_number,

    g.id as group_id,
    g.name as group_name,

    m.default_contribution,

    count(con.id) as contributions_count,

    coalesce(sum(con.amount),0) as total_contributed,

    coalesce(avg(con.amount),0) as average_contribution,

    max(con.created_at) as last_contribution_date

from {{ ref('stg_members') }} m

left join {{ ref('stg_groups') }} g
    on m.group_id = g.id

left join {{ ref('stg_contributions') }} con
    on m.id = con.member_id

group by

    m.id,
    m.first_name,
    m.last_name,
    m.mobile_number,
    g.id,
    g.name,
    m.default_contribution