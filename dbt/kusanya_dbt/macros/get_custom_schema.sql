-- This stops dbt from creating: public_staging & public_analytics. It creates staging & analytics

{% macro generate_schema_name(custom_schema_name, node) %}

    {% if custom_schema_name is none %}
        {{ target.schema }}

    {% else %}
        {{ custom_schema_name }}

    {% endif %}

{% endmacro %}