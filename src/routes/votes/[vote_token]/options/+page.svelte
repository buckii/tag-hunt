<script>
    export let data;

    function optionUrl(vote,option) {
        return '/votes/' + btoa(vote.id) + '/' + btoa(option);
    }
</script>

<div class="wrapper">
    <div class="inner">
        Here are the options:
        <ul>
        {#each JSON.parse(data.vote[0].vote_options) as option}
            <li><a href="{optionUrl(data.vote,option)}">{option}</a></li>
        {/each}
        </ul>
    </div>
</div>

<style>
    li {
        list-style: none none;
    }
</style>