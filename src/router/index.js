import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TimelineView from '@/views/TimelineView.vue'
import EventsView from '@/views/EventsView.vue'
import ExploreView from '@/views/ExploreView.vue'
import SkillTreeView from '@/views/SkillTreeView.vue'
import MissoesView from '@/views/MissoesView.vue'
import InventarioView from '@/views/InventarioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: TimelineView,
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView,
    },
    {
      path: '/explore',
      name: 'exploreExploreView',
      component: ExploreView,
    },
    {
      path: '/skilltree',
      name: 'skilltree',
      component: SkillTreeView,
    },
    { path: '/missoes', 
      name: 'missoes', 
      component: MissoesView, 
    },
    { path: '/inventario', 
      name: 'inventario', 
      component: InventarioView, 
    }
    
  ],
})

export default router
