<template>
    <div class="markdown-content" v-html="parsedContent"></div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import content from "@/assets/documents/letter_of_motivation.md?raw";

const parsedContent = computed(() => marked(content));
</script>

<style scoped>
.markdown-content {
    font-family: inherit;
}

.markdown-content a {
    color: orangered;
    text-decoration: underline;
}

.markdown-content a:hover {
    color: rgb(200, 50, 0);
}
</style>