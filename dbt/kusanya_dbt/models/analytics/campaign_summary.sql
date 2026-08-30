/*
SELECT
    c.id,
    c.title,
    COUNT(ct.id) AS contribution_count,
    SUM(ct.amount) AS total_collected
FROM campaign c
LEFT JOIN contribution ct
    ON ct.campaign_id = c.id
GROUP BY c.id, c.title
*/

select
    c.id as campaign_id,
    c.title,
    c.category,
    c.goal,
    count(con.id) as contribution_count,
    sum(con.amount) as total_collected

-- from campaigns c
FROM {{ ref('stg_campaigns') }} c

left join {{ ref('stg_contributions')}} con
    on c.id = con.campaign_id

group by
    c.id,
    c.title,
    c.category,
    c.goal

/*    
Lightdash will show:

Campaign target vs collected
Number of contributors
Average contribution
Campaign progress %
*/