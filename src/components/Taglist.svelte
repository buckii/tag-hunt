<script>
    export let tag_count;
    export let total_tags_count;
</script>

{#if tag_count > 0}
You've found {tag_count} of {total_tags_count} tags.
{/if}