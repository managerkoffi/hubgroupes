<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
    
    <div v-else>
      <!-- En-tête avec informations de la communauté -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div class="flex items-center">
          <img 
            :src="community.logo || 'https://placehold.co/100x100?text=Logo'" 
            class="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
            alt="Logo de la communauté"
          />
          <div class="ml-4">
            <h1 class="text-2xl font-bold text-gray-900">{{ community.name }}</h1>
            <p class="text-gray-600">{{ community.description }}</p>
          </div>
        </div>
        
        <div class="mt-4 md:mt-0 flex space-x-2">
          <router-link :to="{ name: 'community-details', params: { id: communityId } }" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <svg class="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            Voir la communauté
          </router-link>
          <router-link :to="{ name: 'community-edit', params: { id: communityId } }" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Modifier
          </router-link>
        </div>
      </div>
      
      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Membres totaux -->
        <div class="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-500">Membres totaux</h2>
              <p class="text-3xl font-bold text-gray-900">{{ stats.totalMembers }}</p>
              <p class="text-sm text-green-600 flex items-center mt-1" v-if="stats.newMembersPercentage > 0">
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                </svg>
                +{{ stats.newMembersPercentage }}% ce mois
              </p>
              <p class="text-sm text-red-600 flex items-center mt-1" v-else-if="stats.newMembersPercentage < 0">
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                </svg>
                {{ stats.newMembersPercentage }}% ce mois
              </p>
            </div>
          </div>
        </div>
        
        <!-- Nouveaux membres -->
        <div class="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-50 text-green-600">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-500">Nouveaux membres</h2>
              <p class="text-3xl font-bold text-gray-900">{{ stats.newMembers }}</p>
              <p class="text-sm text-gray-600 mt-1">ce mois</p>
            </div>
          </div>
        </div>
        
        <!-- Activités totales -->
        <div class="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-50 text-blue-600">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-500">Activités totales</h2>
              <p class="text-3xl font-bold text-gray-900">{{ stats.totalActivities }}</p>
              <p class="text-sm text-green-600 flex items-center mt-1" v-if="stats.newActivitiesPercentage > 0">
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                </svg>
                +{{ stats.newActivitiesPercentage }}% ce mois
              </p>
            </div>
          </div>
        </div>
        
        <!-- Activités ce mois -->
        <div class="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-500">Activités ce mois</h2>
              <p class="text-3xl font-bold text-gray-900">{{ stats.newActivities }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ stats.activitiesCompletedThisMonth }} terminées</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Graphiques et statistiques détaillées -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Évolution des membres -->
        <div class="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Évolution des membres</h3>
          <div class="h-64 flex items-center justify-center">
            <!-- Ici, nous intégrerons un graphique d'évolution des membres -->
            <div class="text-gray-400">Graphique d'évolution des membres (à implémenter)</div>
          </div>
        </div>
        
        <!-- Activités par catégorie -->
        <div class="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Activités par catégorie</h3>
          <div class="h-64 flex items-center justify-center">
            <!-- Ici, nous intégrerons un graphique des activités par catégorie -->
            <div class="text-gray-400">Graphique des activités par catégorie (à implémenter)</div>
          </div>
        </div>
      </div>
      
      <!-- Activités récentes et membres actifs -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Activités récentes -->
        <div class="bg-white rounded-lg shadow border border-gray-100">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Activités récentes</h3>
          </div>
          <ul class="divide-y divide-gray-200">
            <li v-for="activity in recentActivities" :key="activity.id" class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img :src="activity.image" class="h-10 w-10 rounded-md object-cover" :alt="activity.title" />
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-sm text-gray-500">{{ activity.date }}</p>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ activity.participants }} participants</p>
                </div>
              </div>
            </li>
            <li v-if="recentActivities.length === 0" class="px-6 py-4 text-center text-gray-500">
              Aucune activité récente
            </li>
          </ul>
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <router-link :to="{ name: 'community-activities', params: { id: communityId } }" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Voir toutes les activités
            </router-link>
          </div>
        </div>
        
        <!-- Membres actifs -->
        <div class="bg-white rounded-lg shadow border border-gray-100">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Membres les plus actifs</h3>
          </div>
          <ul class="divide-y divide-gray-200">
            <li v-for="member in activeMembers" :key="member.id" class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img :src="member.avatar" class="h-10 w-10 rounded-full object-cover" :alt="member.name" />
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                    <p class="text-sm text-gray-500">{{ member.joinDate }}</p>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ member.activitiesCount }} activités</p>
                </div>
              </div>
            </li>
            <li v-if="activeMembers.length === 0" class="px-6 py-4 text-center text-gray-500">
              Aucun membre actif
            </li>
          </ul>
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <router-link :to="{ name: 'community-members', params: { id: communityId } }" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Voir tous les membres
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import { useActivityStore } from '@/stores/activity'

const route = useRoute()
const router = useRouter()
const communityStore = useCommunityStore()
const activityStore = useActivityStore()

const communityId = computed(() => route.params.id)
const community = ref({})
const stats = ref({
  totalMembers: 0,
  newMembers: 0,
  newMembersPercentage: 0,
  totalActivities: 0,
  newActivities: 0,
  newActivitiesPercentage: 0,
  activitiesCompletedThisMonth: 0
})
const recentActivities = ref([])
const activeMembers = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    // Récupérer les données de la communauté
    community.value = await communityStore.fetchCommunityById(communityId.value)
    
    // Récupérer les statistiques
    await fetchCommunityStats()
    
    // Récupérer les activités récentes
    const activities = await communityStore.fetchCommunityActivities(communityId.value)
    recentActivities.value = activities.slice(0, 5).map(activity => ({
      id: activity.id,
      title: activity.title,
      date: formatDate(activity.date),
      participants: activity.currentParticipants,
      image: activity.image
    }))
    
    // Simuler la récupération des membres actifs
    activeMembers.value = [
      {
        id: 1,
        name: 'Jean Dupont',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        joinDate: '15 Jan 2024',
        activitiesCount: 12
      },
      {
        id: 2,
        name: 'Marie Martin',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        joinDate: '3 Fév 2024',
        activitiesCount: 8
      },
      {
        id: 3,
        name: 'Pierre Durand',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        joinDate: '20 Fév 2024',
        activitiesCount: 5
      }
    ]
  } catch (err) {
    error.value = "Erreur lors du chargement des données du tableau de bord"
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function fetchCommunityStats() {
  // Dans un environnement réel, ces données viendraient d'une API
  // Pour la démo, nous simulons des données
  
  // Statistiques des membres
  stats.value.totalMembers = community.value.memberCount || 0
  stats.value.newMembers = Math.floor(stats.value.totalMembers * 0.15) // 15% de nouveaux membres
  stats.value.newMembersPercentage = 15 // 15% d'augmentation
  
  // Statistiques des activités
  const activities = await communityStore.fetchCommunityActivities(communityId.value)
  stats.value.totalActivities = activities.length
  stats.value.newActivities = Math.floor(stats.value.totalActivities * 0.2) // 20% de nouvelles activités
  stats.value.newActivitiesPercentage = 20 // 20% d'augmentation
  stats.value.activitiesCompletedThisMonth = Math.floor(stats.value.newActivities * 0.7) // 70% des nouvelles activités sont terminées
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
