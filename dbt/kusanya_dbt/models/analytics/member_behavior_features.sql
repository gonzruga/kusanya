{{ config(
    materialized='view'
) }}

with members as (

    select
        m.id as member_id,
        m."groupId" as group_id,
        m."firstName" as first_name,
        m."lastName" as last_name,
        m."mobileNumber" as mobile_number,
        m.comment,
        m."defaultContribution" as default_contribution,
        m."createdAt" as member_created_at

    from "Member" m

    where m.status = 'ACTIVE'

),

contribution_stats as (

    select

        c."memberId" as member_id,

        count(
            case
                when c.status = 'SUCCESSFUL'
                then 1
            end
        ) as contribution_count,

        coalesce(
            sum(
                case
                    when c.status = 'SUCCESSFUL'
                    then c.amount
                    else 0
                end
            ),
            0
        ) as total_contributed,

        coalesce(
            avg(
                case
                    when c.status = 'SUCCESSFUL'
                    then c.amount
                end
            ),
            0
        ) as average_contribution,

        coalesce(
            min(
                case
                    when c.status = 'SUCCESSFUL'
                    then c.amount
                end
            ),
            0
        ) as minimum_contribution,

        coalesce(
            max(
                case
                    when c.status = 'SUCCESSFUL'
                    then c.amount
                end
            ),
            0
        ) as maximum_contribution,

        count(
            distinct case
                when c.status = 'SUCCESSFUL'
                then c."campaignId"
            end
        ) as campaigns_supported,

        min(
            case
                when c.status = 'SUCCESSFUL'
                then c."createdAt"
            end
        ) as first_contribution_at,

        max(
            case
                when c.status = 'SUCCESSFUL'
                then c."createdAt"
            end
        ) as last_contribution_at

    from "Contribution" c

    group by
        c."memberId"

)

select

    m.member_id,
    m.group_id,
    m.first_name,
    m.last_name,
    m.mobile_number,
    m.comment,
    m.default_contribution,
    m.member_created_at,

    coalesce(
        cs.contribution_count,
        0
    ) as contribution_count,

    coalesce(
        cs.total_contributed,
        0
    ) as total_contributed,

    coalesce(
        cs.average_contribution,
        0
    ) as average_contribution,

    coalesce(
        cs.minimum_contribution,
        0
    ) as minimum_contribution,

    coalesce(
        cs.maximum_contribution,
        0
    ) as maximum_contribution,

    coalesce(
        cs.campaigns_supported,
        0
    ) as campaigns_supported,

    cs.first_contribution_at,
    cs.last_contribution_at,

    case
        when cs.last_contribution_at is null
            then null

        else
            current_date
            - cs.last_contribution_at::date
    end as days_since_last_contribution,

    case
        when m.default_contribution is null
            or m.default_contribution = 0
            then null

        else
            coalesce(
                cs.average_contribution,
                0
            ) / m.default_contribution
    end as average_vs_default_ratio

from members m

left join contribution_stats cs
    on m.member_id = cs.member_id