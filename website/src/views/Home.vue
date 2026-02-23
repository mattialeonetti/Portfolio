<template>
    <div class="home-bg">
        <div class="page">
            <div class="header">
                <h1 class="title">Mattia's Application to Study Game Design</h1>
            </div>
            <div class="menu-container">
                <nav class="menu">
                    <RouterLink to="/" class="menu-link" active-class="active" exact-active-class="active">home
                    </RouterLink>
                    <RouterLink to="/motivation" class="menu-link" active-class="active">letter of motivation
                    </RouterLink>
                    <RouterLink to="/project" class="menu-link" active-class="active">project idea</RouterLink>
                    <RouterLink to="/portfolio" class="menu-link" active-class="active">portfolio</RouterLink>
                </nav>
            </div>
            <section class="content-slot">
                <RouterView />
            </section>
            <div class="footer-container">
                <div class="footer">
                    <a class="footer-content" href="https://github.com/mattialeonetti/Portfolio">GitHub</a>
                    <RouterLink to="/ai" class="footer-content">AI usage</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
</script>
<style lang="css" scoped>
.home-bg {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
}

.home-bg::before,
.home-bg::after {
    content: "";
    position: absolute;
    width: 55vw;
    height: 55vh;
    background-image: url('../assets/bg/lines.svg');
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
}

.home-bg::before {
    top: 25rem;
    left: 30%;
    transform: scale(-1, -1);
    transform-origin: top left;
    animation: drift-left 320s linear infinite;
}

.home-bg::after {
    right: -20%;
    top: 30rem;
    animation: drift-right 320s linear infinite;
}

@keyframes drift-left {
    from {
        transform: scale(-1, -1) translateX(0);
    }

    to {
        transform: scale(-1, -1) translateX(-130vw);
    }
}

@keyframes drift-right {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-100vw);
    }
}

.page {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    height: 70%;
    width: 60%;
    text-align: left;
    margin-bottom: 2rem;
    ;
}

.menu {
    display: flex;
    padding: 0 0 0 1.8rem;
    background-color: orangered;
    border-top: 0.5rem solid rgb(23, 23, 23);
    gap: -1rem;
    box-shadow: inset 0 -3px 0 rgb(23, 23, 23);
}

.menu-link {
    --menu-bg: orangered;
    --tab-height: 1.8rem;
    --tab-cut: var(--tab-height);
    position: relative;
    overflow: hidden;
    color: rgb(23, 23, 23);
    height: var(--tab-height);
    min-width: 5.75rem;
    padding: 0 1.6rem;
    margin-left: -1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 600;
    background-color: var(--menu-bg);
    border-bottom: 3px solid rgb(23, 23, 23);
    border-top: 3px solid transparent;
    clip-path: polygon(var(--tab-cut) 0, 100% 0, calc(100% - var(--tab-cut)) 100%, 0 100%);
}

.menu-link.active {
    --menu-bg: white;
    border: none;
    border-bottom: 3px solid white;
    border-top: 3px solid rgb(23, 23, 23);
}

.content-slot {
    padding: 1rem 1.25rem 1.25rem;
    background-color: white;
}

.cut {
    position: relative;
    color: #000;
    background: #ccc;
}

.header {
    --height: 5rem;
    height: var(--height);
    display: flex;
    align-items: end;
    justify-content: flex-end;
    background-color: transparent;
    position: relative;
    text-align: right;
    padding-left: var(--height);
    width: 100% - 5rem;
    clip-path: polygon(var(--height) 0, 100% 0, 100% var(--height), 0 var(--height));
}

.header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../assets/bg/orange.png');
    background-size: cover;
    background-position: center 0%;
    animation: header-pan-down 60s linear infinite alternate;
    z-index: -1;
}

@keyframes header-pan-down {
    from {
        background-position: center 0%;
    }

    to {
        background-position: center 100%;
    }
}

.title {
    margin-right: 1rem;
    font-size: x-large;
}

.footer {
    background-color: orangered;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0 0.2rem 0 1.2rem;
    clip-path: polygon(1rem 0, 100% 0, 100% 1rem, 0 1rem);
}

.footer-container {
    height: 1rem;
    background-color: grey;
    display: flex;
    justify-content: flex-end;;
}

.footer-content {
    color: white;
    font-size: x-small;
}
</style>