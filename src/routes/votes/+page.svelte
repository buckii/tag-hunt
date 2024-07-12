<script>

export let data;

function optionUrl(vote,option) {
    return '/votes/' + btoa(vote.id) + '/' + btoa(option);
}

</script>

<div class="wrapper">
    <div class="inner">
        Look for a vote card and tap it to vote.
        {#each data.votes as vote}
            <h3>{vote.name}</h3>
            {#each JSON.parse(vote.vote_options) as option}
                <p><a href="{optionUrl(vote,option)}">{option}</a></p>
            {/each}
        {/each}
    </div>
</div>
