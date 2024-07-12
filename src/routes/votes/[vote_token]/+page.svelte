<script>
    export let data;

    function optionUrl(vote,option) {
        return '/votes/' + btoa(vote.id) + '/' + btoa(option);
    }
</script>

<div class="wrapper">
    <div class="inner">
        <h3>{data.vote.description}</h3>
        <ul>
        {#each JSON.parse(data.vote.vote_options) as option}
            <li><a href="{optionUrl(data.vote,option)}">{option}</a></li>
        {/each}
        </ul>
    </div>
</div>

<style>
    ul {
        padding: 0;
        margin: 0;
    }
    li {
        list-style: none none;
        padding: 10px 0;
    }
</style>