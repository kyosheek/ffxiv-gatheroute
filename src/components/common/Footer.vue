<script setup>
    const year = new Date().getFullYear();
</script>

<template>
    <footer class="footer">
        <article>
            <h3>Contribute</h3>
            <ul class="ul_inline">
                <li><a href="https://github.com/kyosheek/ffxiv-gatheroute"
                       target="_blank">GitHub Repository</a></li>
            </ul>
        </article>
        <article>
            <h3>Connect</h3>
            <ul class="ul_inline">
                <li><a href="https://discordapp.com/users/190847929433587712"
                       target="_blank">Discord</a></li>
                <li><a href="http://kyoshee.xyz"
                       target="_blank">Personal Website</a></li>
            </ul>
        </article>

        <article>
            <h3>Support</h3>
            <ul class="ul_inline">
                <li><a href="https://paypal.me/kyoshee"
                       target="_blank">Paypal</a></li>
                <li><a href="https://ko-fi.com/kyoshee"
                       target="_blank">Ko-fi</a></li>
            </ul>
        </article>

        <p>&copy; kyoshee {{ year }}</p>
    </footer>
</template>
