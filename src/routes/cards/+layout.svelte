<script>
    //import '../../css/style.css';
</script>

<main>
    <slot />

</main>
<footer>
    <div class="logos">
        <a href="https://www.columbusbookfestival.org/" target="_blank"><img src="/bookfest-logo.png" class="bookfest-by" alt="Columbus Book Festival" /></a>
        <a href="https://columbuslibrary.org/foundation/" target="_blank"><img src="/foundation-logo.png" class="foundation-logo" alt="Columbus Metropolitan Library Foundation" /></a>
    </div>
    <a href="https://www.buckeyeinnovation.com/" target="_blank"><img src="/tech-by.png" class="powered-by" alt="Technology by Buckeye Innovation" /></a>
</footer>

<style>
footer {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}
footer .logos {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 20px 0;
}
footer a {
    width: 36%;
    margin: 0 5%;
}
.powered-by {
    color: #000;
    background: none;
    width: 50%;
    margin: 10px -10%;
}

</style>