{{ config(
    materialized='table'
) }}

with features as (

    select *
    from {{ ref('member_behavior_features') }}

),

segmented as (

    select

        *,

        case
            when contribution_count = 0
                then 5

            when days_since_last_contribution > 90
                then 5

            when total_contributed >= 500000
                then 1

            when average_contribution >= 100000
                then 1

            when contribution_count >= 4
                and campaigns_supported >= 3
                then 2

            when campaigns_supported >= 4
                then 2

            when contribution_count >= 2
                and days_since_last_contribution <= 60
                then 3

            else 4

        end as segment_priority,

        case

            when contribution_count = 0
                then 'Inactive Member'

            when days_since_last_contribution > 90
                then 'Inactive Member'

            when total_contributed >= 500000
                then 'High-Value Contributor'

            when average_contribution >= 100000
                then 'High-Value Contributor'

            when contribution_count >= 4
                and campaigns_supported >= 3
                then 'Core Contributor'

            when campaigns_supported >= 4
                then 'Core Contributor'

            when contribution_count >= 2
                and days_since_last_contribution <= 60
                then 'Regular Contributor'

            else 'Occasional Contributor'

        end as behaviour_segment

    from features

),

final as (

    select

        *,
        -- first_name, contribution_count, segment_priority, behaviour_segment,


        case behaviour_segment

            when 'Core Contributor'
                then 'Frequent contributor supporting multiple campaigns'

            when 'High-Value Contributor'
                then 'Contributor making high-value contributions'

            when 'Regular Contributor'
                then 'Consistent contributor with recent activity'

            when 'Occasional Contributor'
                then 'Contributor with limited contribution activity'

            when 'Inactive Member'
                then 'Member with no recent contribution activity'

        end as behaviour_segment_description

    from segmented

)

select *

from final