import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/auth/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/communities',
      name: 'communities',
      component: () => import('../views/community/CommunityListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/communities/create',
      name: 'community-create',
      component: () => import('../views/community/CommunityFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/communities/:id',
      name: 'community-details',
      component: () => import('../views/community/CommunityDetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/communities/:id/edit',
      name: 'community-edit',
      component: () => import('../views/community/CommunityFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/members',
      name: 'members',
      component: () => import('../views/member/MembersListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/members/invite',
      name: 'member-invite',
      component: () => import('../views/member/InviteMemberView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/activity/ActivitiesListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/create',
      name: 'activity-create',
      component: () => import('../views/activity/ActivityFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/:id',
      name: 'activity-details',
      component: () => import('../views/activity/ActivityDetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/:id/edit',
      name: 'activity-edit',
      component: () => import('../views/activity/ActivityFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/announcements',
      name: 'announcements',
      component: () => import('../views/communication/AnnouncementsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('../views/communication/MessagesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('../views/payment/SubscriptionView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: () => import('../views/marketplace/MarketplaceView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/finances',
      name: 'finances',
      component: () => import('../views/finance/FinanceView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
