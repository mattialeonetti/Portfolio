<template>
    <div class="portfolio">
        <div class="accordion">
            <div class="accordion-item">
                <button 
                    class="accordion-header" 
                    @click="toggleItem(0)"
                    :class="{ active: activeIndex === 0 }"
                >
                    Project 1
                </button>
                <div class="accordion-content" v-show="activeIndex === 0">
                    <p>Content for Project 1</p>
                </div>
            </div>

            <div class="accordion-item">
                <button 
                    class="accordion-header" 
                    @click="toggleItem(1)"
                    :class="{ active: activeIndex === 1 }"
                >
                    Project 2
                </button>
                <div class="accordion-content" v-show="activeIndex === 1">
                    <p>Content for Project 2</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(null);

const toggleItem = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};
</script>


<style scoped>
.accordion {
    max-width: 800px;
    margin: 2rem auto;
}

.accordion-item {
    margin-bottom: 1rem;
    border: 1px solid grey;
    border-radius: 4px;
    overflow: hidden;
}

.accordion-header {
    width: 100%;
    padding: 1rem;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s;
}

.accordion-header:hover {
    background: whitesmoke;
}

.accordion-header.active {
    border: grey solid 1px;
}

.accordion-content {
    padding: 1rem;
}
</style>