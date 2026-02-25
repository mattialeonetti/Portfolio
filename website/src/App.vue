<template>
  <router-view />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isGameView = computed(() => route.name === 'infinisweeper')
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 2048)

const calculateFontSize = () => {
  const baseSize = (windowWidth.value / 2048) * 16
  return isGameView.value ? baseSize : baseSize * 1.25
}

const updateFontSize = () => {
  document.documentElement.style.fontSize = calculateFontSize() + 'px'
}

watch(isGameView, updateFontSize)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  updateFontSize()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  updateFontSize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="css">
html, body, #app { min-height: 100%; margin: 0; font-family: Arial, Helvetica, sans-serif;}
body { background: rgb(23, 23, 23); }
</style>
