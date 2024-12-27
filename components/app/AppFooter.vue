<template>
    <footer class="footer">
        <div class="container">
            <p class="footer__copyright">
                © {{ new Date().getFullYear() }} Заметки
            </p>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.footer {
    background-color: white;
    padding: 1rem 0;
    margin-top: auto;

    &__copyright {
        text-align: center;
        color: color('gray', 'base');
        font-size: 0.875rem;
    }
}
</style>
