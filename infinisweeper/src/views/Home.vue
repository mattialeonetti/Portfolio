<template>
    <div class="home-bg">
        <div class="page cut">
            <div class="header">
                <h1 class="title">Mattia's application to study game design</h1>
            </div>
            <div class="menu-container">
                <nav class="menu">
                    <RouterLink to="/" class="menu-link" active-class="active" exact-active-class="active">Home
                    </RouterLink>
                    <RouterLink to="/infinisweeper" class="menu-link" active-class="active">Infinisweeper</RouterLink>
                </nav>
            </div>
            <section class="content-slot">
                <RouterView />
            </section>
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
    top: 40%;
    left: 30%;
    transform: scale(-1, -1);
    transform-origin: top left;
}

.home-bg::after {
    right: -20%;
    bottom: -10%;
}

.page {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    height: 70%;
    width: 50%;
    text-align: left;
    background-color: white;
}

.menu {
    display: flex;
    padding: 0 0 0 1.8rem;
    background-color: orangered;
    border-top: 0.5rem solid rgb(23, 23, 23);
    gap: -1rem;
}

.menu-link {
    --menu-bg: orangered;
    --tab-height: 2rem;
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
    clip-path: polygon(var(--tab-cut) 0, 100% 0, calc(100% - var(--tab-cut)) 100%, 0 100%);
}

.menu-link.active {
    --menu-bg: white;
    border: none;
    border-bottom: 3px solid white;
}

.content-slot {
    padding: 1rem 1.25rem 1.25rem;
}

.cut {
    position: relative;
    color: #000;
    background: #ccc;
}

.header {
    height: 5rem;
    background-image: url('../assets/bg/orange.png');
    background-size: cover;
    background-position: center 0%;
    animation: header-pan-down 60s linear infinite alternate;
    text-align: right;
    width: 100%;
}

@keyframes header-pan-down {
    from {
        background-position: center 0%;
    }

    to {
        background-position: center 100%;
    }
}

.cut:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-width: 5rem 5rem 0px 0px;
    border-style: solid;
    border-color: rgb(23, 23, 23) transparent transparent rgb(23, 23, 23);
}

.title {
    margin-right: 1rem;
}
</style>