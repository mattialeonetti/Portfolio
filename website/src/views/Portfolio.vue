<template>
    <div class="portfolio">
        <div class="left-panel">
            <nav class="menu">
                <div class="menu-item" :class="{ active: activeIndex === 1 }" @click="toggleItem(1)">infinisweeper</div>
                <div class="menu-item" :class="{ active: activeIndex === 2 }" @click="toggleItem(2)">bachelor's thesis
                </div>
                <div class="menu-item" :class="{ active: activeIndex === 3 }" @click="toggleItem(3)">this website</div>
            </nav>
        </div>
        <div class="content">
            <div v-if="activeIndex === 0">
                <h2>Portfolio</h2>
                <p>Here you can find a selection of projects that I have worked on. They are ordered by relevance, not
                    chronologically</p>
            </div>

            <div v-else-if="activeIndex === 1">
                <h2>Infinisweeper</h2>
                <p class="date">February 2026</p>
                <p class="language">JavaScript, Vue, HTML, CSS - Game design, Web development</p>
                <p>Infinisweeper is a Minesweeper-inspired game that I developed using the JavaScript framework Vue,
                    which would be well-suited for a mobile application. I made it specifically for applying to ZHdK. It
                    consists of an infinite number of
                    Minesweeper boards, horizontally scrolling across the screen.</p>
                <p>Click on cells to reveal them and
                    right-click to flag potential mines. If you mistakenly reveal a mine or if an unrevealed mineless
                    cell reaches the left border, you lose. </p>
                <p> The smiley at the top of the screen is present in the
                    original Minesweeper game and I expanded it with some custom animations based on events in gameplay.
                    Instead of the original bomb counter, I implemented a row counter, showing how many rows of the
                    board have been scrolled past.
                </p>
                <RouterLink to="/infinisweeper">Play Infinisweeper</RouterLink>
            </div>
            <div v-else-if="activeIndex === 2">
                <h2>Bachelor's Thesis</h2>
                <p class="date">October 2025 - April 2026</p>
                <p class="language">Python, Javascript - UX research, UI design, software development</p>
                <p>For my bachelor's thesis, I am conducting paper on usability of applications that are used to
                    configure mixed signal analog neuron chips at the department of neuroinformatics at UZH. I First
                    conducted interviews with users and developers of previous applications, then identified a list of
                    issues that I would like to investigate. I then tried to solve these issues by searching literature
                    and experimenting myself. I have now created two applications that I'm about to conduct a
                    <a href="https://dl.acm.org/doi/10.1145/3711838">comparative structured observation</a>
                    study with to evaluate the effectiveness of my solutions. In order to have the users interact with
                    the applications and because the newest neuromorphic chip is not yet available, I created a software
                    simulation of the chip that runs in real time.
                </p>
                <p>I also created custom animations to explain the function of parameters to more novice users, which I
                    found to be a common issue in the previous applications.
                    Still, a decent level of neuroscience knowledge is required to understand the application, which is
                    why I am not going into detail about the function of the application here. A demo is also not
                    available, since it would require a backend to run the simulation and I have decided that it is not
                    worth the hassle.
                </p>
            </div>
            <div v-else-if="activeIndex === 3">
                <h2>This Website</h2>
                <p class="date">February 2026</p>
                <p class="language">JavaScript, Vue, HTML, CSS - Web development, design</p>
                <p>I made this website specifically for applying to ZHdK. I decided to give it a retro, Web 1.0-inspired
                    look and feel, in order to fit to the minesweeper game.</p>
                <p>
                    My experience with web development will be useful for creating interactive applications and
                    prototypes in the game design master, so I wanted to show that I can quickly sketch a website - the
                    source code and history are available on
                    <a href="https://github.com/mattialeonetti/Portfolio">GitHub</a>
                    .
                </p>
            </div>
            <div v-else-if="activeIndex === 4">
                <h2>Helbling - Project Journal</h2>
                <p class="date">February 2025 - now</p>
                <p class="language">Javascript, Vue, HTML, CSS - Project management, requirements engineering,
                    documentation, software development</p>
                <p>
                    placeholder
                </p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(0);

const toggleItem = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};
</script>


<style scoped>
p {
    text-align: justify;
}

.date {
    font-style: italic;
    font-size: small;
    color: grey;
    margin-top: -0.5rem;
    margin: -1rem 0 0.5rem 0;
}

.language {
    color: grey;
    margin: 0;
}

.portfolio {
    display: grid;
    grid-template-columns: 10rem 1fr;
    margin: -1rem -1.25rem -1.25rem;
}

.left-panel {
    background-color: #f0f0f0;
    padding: 1rem;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.menu-item {
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.menu-item:hover {
    color: #4d4d4d;
}

.menu-item.active {
    color: orangered;
    text-decoration: underline;
}

.content {
    padding: 0 1rem 1rem 1rem;
}
</style>