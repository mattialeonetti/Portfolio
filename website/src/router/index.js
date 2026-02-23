import { createRouter, createWebHistory } from 'vue-router'
import Game from '../views/Game.vue'
import Home from '@/views/Home.vue'
import HomeIntro from '@/views/HomeIntro.vue'
import Motivation from '@/views/Motivation.vue'
import Portfolio from '@/views/Portfolio.vue'
import Project from '@/views/Project.vue'
import AI from '@/views/AI.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        { path: '', name: 'home', component: HomeIntro },
        { path: 'motivation', name: 'motivation', component: Motivation },
        { path: 'portfolio', name: 'portfolio', component: Portfolio },
        { path: 'project', name: 'project', component: Project },
        { path: 'ai', name: 'ai', component: AI },
      ],
    },
    { path: '/infinisweeper', name: 'infinisweeper', component: Game },
  ],
})

export default router
