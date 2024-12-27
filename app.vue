<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style lang="scss">
@use '~/assets/scss/main.scss' as *;

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    min-height: 100vh;
    line-height: 1.6;
    text-rendering: optimizeLegibility;
}

button {
    border: none;
    background: none;
    font: inherit;
    cursor: pointer;
}

a {
    color: inherit;
    text-decoration: none;
}

input,
textarea {
    font: inherit;
}
</style>
