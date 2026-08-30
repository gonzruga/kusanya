with members as (

    select *
    from {{ ref('stg_members') }}

),

contributions as (

    select *
    from {{ ref('stg_contributions') }}

)

select

    m.id,

    m.first_name,

    m.last_name,

    m.mobile_number,

    count(contributions.id) as contributions,

    coalesce(sum(contributions.amount),0) as total_paid,

    avg(contributions.amount) as average_payment,

    max(contributions.created_at) as last_payment

from members m

left join contributions

on contributions.member_id=m.id

group by

    m.id,
    m.first_name,
    m.last_name,
    m.mobile_number