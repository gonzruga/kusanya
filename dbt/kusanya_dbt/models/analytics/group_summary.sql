select

g.id as group_id,
g.name as group_name,

count(distinct m.id) as members,

count(distinct c.id) as campaigns,

sum(con.amount) as total_contributions


-- from groups g
FROM {{ ref('stg_groups') }} g

left join {{ ref('stg_members') }} m
on m.group_id = g.id

left join {{ ref('stg_campaigns')}} c
on c.group_id = g.id

left join {{ ref('stg_contributions') }} con
on con.campaign_id = c.id


group by
g.id,
g.name

/*
Display:
Group total fundraising
Active campaigns
Member participation
*/