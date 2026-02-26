<template>
    <div class="portfolio">
        <div class="left-panel">
            <nav class="menu">
                <div class="menu-item" :class="{ active: activeIndex === 1 }" @click="toggleItem(1)">infinisweeper</div>
                <div class="menu-item" :class="{ active: activeIndex === 2 }" @click="toggleItem(2)">bachelor's thesis
                </div>
                <div class="menu-item" :class="{ active: activeIndex === 3 }" @click="toggleItem(3)">this website</div>
                <div class="menu-item" :class="{ active: activeIndex === 4 }" @click="toggleItem(4)">project journal
                </div>
                <div class="menu-item" :class="{ active: activeIndex === 5 }" @click="toggleItem(5)">SUPERTRUMPF</div>
                <div class="menu-item" :class="{ active: activeIndex === 6 }" @click="toggleItem(6)">test bench</div>
                <div class="menu-item" :class="{ active: activeIndex === 7 }" @click="toggleItem(7)">diagnostic robot
                    simulation</div>
                <div class="menu-item" :class="{ active: activeIndex === 8 }" @click="toggleItem(8)">various design
                    projects</div>
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
                <p>Infinisweeper is a Minesweeper-inspired game that I developed using the JavaScript framework Vue. I
                    made it specifically for applying to ZHdK. It
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
                <p>For my bachelor's thesis, I am writing a paper on the usability of applications that are used to
                    configure mixed signal analog neuron chips at the department of neuroinformatics at UZH. I First
                    conducted interviews with users and developers of previous applications, then identified a list of
                    issues that I would like to investigate. I then tried to solve these issues by searching literature
                    and experimenting myself. I have now created two applications that I'm about to conduct a
                    <a href="https://dl.acm.org/doi/10.1145/3711838">comparative structured observation</a>
                    study with, to evaluate the effectiveness of my solutions. In order to have the users interact with
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
                <img src="../assets/portfolio_images/zoox.png" />
                <p class="img-description">A screenshot of one of the applications I created for my bachelor's thesis.</p>
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
                    During my second internship at Helbling Technik Wil AG, I was tasked with creating a web
                    application, which would be used to record and categorize meeting minutes within the company. I was
                    given full
                    responsibility for the project and took the roles of project lead, architect and developer.
                </p>
                <p>
                    The functionality is based on an Excel template with automations, which had been developed by
                    Helbling and which my application replaces. The goal of the application is to set a clear structure
                    for meeting minutes to be recorded and to categorize items, e.g. as Statements, Tasks or Questions.
                    Due to the rigid structure, exported meeting minutes sent to the customer have a unified look and
                    minutes are standardized across the company. This approach had been very successful with
                    the Excel template, but project leads were unhappy with usability.
                </p>
                <p>
                    In addition to being (a lot) faster and having a stronger focus on usability, compared to the Excel
                    predecessor, my application implements additional features: Searching and sorting meeting minutes
                    and items with filters, limiting access for projects, and a personal open
                    task dashboard for all projects (the Excel template was used per project).
                </p>
                <p>
                    I was tasked with giving the application a sleek, corporate look and feel, minimizing distractions.
                    One key requirement was to be able to record minutes using only the keyboard, since that is possible
                    in Excel and switching to the mouse while taking minutes is cumbersome. I overrode browser native
                    navigation using the TAB button and allowed users to move over several meeting items, select an item
                    to enter it and move over elements within the item (e.g. assignee, due date, comment).
                </p>
                <p>
                    Since the application is only accessible to Helbling employees, I cannot share a link to allow you
                    to play around with it. Feedback by project leads has been overwhelmingly positive. There was also a
                    list of improvements, wishes and a few bugs, which I am currently implementing/fixing.
                </p>
            </div>
            <div v-else-if="activeIndex === 5">
                <h2>SUPERTRUMPF</h2>
                <p class="date">Spring 2022</p>
                <p class="language">Javascript, React, HTML, CSS, Java - UX Design, Game Design, Graphic Design</p>
                <p>
                    For my first ever large programming project at university, we were tasked with creating a
                    server-client
                    application with multiple users interacting in real-time. Our group of four decided to make a
                    digital version of the card game top trumps (DE: Quartett), with the added functionality of deck
                    creation and sharing. The goal was to have players create decks (e.g. bars in Zurich) to share and
                    play with their friends.
                </p>
                <p>
                    The focus of the project was on teaching project management and software development processes, so
                    we were given no technical tutoring. Combined with the fact that this was the first time any of us
                    ever worked on a large programming project and that none of us had ever used JavaScript or React,
                    the resulting game is not perfect. We got the deck creation, sharing, the game lobby and all basic
                    game
                    mechanics done. However, when two players play a card, the two cards are not compared visually,
                    which means the core gameplay is lacking in appeal.
                </p>
                <img src="../assets/portfolio_images/ST_main.png" />
                <p class="img-description">Home screen of SUPERTRUMPF</p>
                <p>
                    I took the role of frontend developer (I helped out with some minor stuff on backend) and did the
                    main pages, lobby and game creation, as well as the connection to the backend. In addition, I
                    designed all assets, color palette, website layout and the logo and recorded music for the lobby and
                    game. Most
                    other projects in that class went for an application suited for a business startup, so they had a
                    very standardized corporate visual style. We made a kids game and I wanted our artstyle to reflect
                    that.
                </p>
                <img src="../assets/portfolio_images/ST_game.png" />
                <p class="img-description">Gameplay screen for a SUPERTRUMPF game with two players. The screenshot shows the
                    stage where the player's card is visible, but the opponent's isn't yet.</p>
                <p>
                    I made mockups of all views in Adobe XD for our first presentation - the elevator pitch. For app
                    development I polished and exported some assets from Adobe XD and Adobe Illustrator, while
                    recreating interactive elements with HTML/CSS directly. Looking back on the project now four years
                    later, I am still proud of the game's style, especially since it was my first large software
                    project.
                </p>
                <img src="../assets/portfolio_images/ST_lobby.png" />
                <p class="img-description">Lobby screen of SUPERTRUMPF</p>
            </div>
            <div v-else-if="activeIndex === 6">
                <h2>Helbling - Home appliance test bench</h2>
                <p class="date">January 2025 - March 2025</p>
                <p class="language">Python - Software development, Hardware integration, Testing</p>
                <p>
                    During my second internship at Helbling Technik Wil AG, I was part of the development team for a
                    household appliance, the exact nature of which I am not at liberty to discuss. I was tasked with the
                    design of an automated hardware-in-the-loop test setup for three different PCBs. Two of them had
                    relatively simple roles and I was able to setup a pytest suite where I only had to mock upstream and
                    downstream API calls. The third PCB was more complex, since its external connections that I had to
                    mock were sensors and actuators, e.g. a thermocouple. I bought I/O cards and developed a suite for
                    simulating real-world behavior of the entire system. The upside of such a system is that you can
                    safely induce errors which would cause harm to the device or people if done on a full device. As an
                    example, one could simulate the thermocouple being broken and make sure the firmware reacts
                    correctly. I placed the device under test and test setup in a box and connected the pytest suite to
                    the CI/CD pipeline of our project.
                </p>
                <p>
                    Sadly, the firmware development for the device was stopped by our customer during my internship.
                    However, I was asked to finish the test setup and demonstrate its functionality to set a standard
                    for testing hardware in the loop in the company.
                </p>
                <p>
                    As mentioned in my letter of motivation, I think experience with hardware can be very fruitful in
                    the game design master, since it allows me to build custom controllers for games or even build an
                    arcade machine. This is relevant when making games with the goal of creating art, over
                    the goal of creating a commercially successful product.
                </p>
            </div>
            <div v-else-if="activeIndex === 7">
                <h2>Helbling - Diagnostic Robot Simulation</h2>
                <p class="date">October 2023 - December 2023</p>
                <p class="language">C#, WPF - Software development, UI Design, Testing</p>
                <p>
                    In my first internship at Helbling Technik Wil AG, I was tasked with developing a software
                    simulation of a diagnostic robot, both for testing and to facilitate development of the frontend.
                    The application is accessible via a GUI and simulates all lower-level behaviour of the robot, e.g.
                    robotic positioning which is displayed in a schematic view in the GUI.
                </p>
                <p>
                    I am not at liberty to show any images of the application, but I can say that it was a very
                    formative project, during which I was able to learn to code well. I also think that simulating a
                    robot has parallels in game design, especially in programming movement systems and physics.
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

img {
    max-width: 100%;
    height: auto;
    display: block;
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

.img-description {
    font-size: small;
    color: grey;
    text-align: center;
    margin-top: 0.25rem;
}
</style>