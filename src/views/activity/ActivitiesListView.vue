<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Activités et Événements</h1>
      <RouterLink 
        to="/activities/create" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Créer une activité
      </RouterLink>
    </div>

    <!-- Filtres et recherche -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Rechercher une activité..."
        />
      </div>
      <select 
        v-model="statusFilter" 
        class="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">Tous les statuts</option>
        <option value="upcoming">À venir</option>
        <option value="ongoing">En cours</option>
        <option value="past">Passées</option>
        <option value="cancelled">Annulées</option>
      </select>
      <select 
        v-model="communityFilter" 
        class="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">Toutes les communautés</option>
        <option v-for="community in communities" :key="community.id" :value="community.id">
          {{ community.name }}
        </option>
      </select>
    </div>

    <!-- Vue calendrier / liste -->
    <div class="mb-6">
      <div class="flex border-b border-gray-200">
        <button 
          @click="viewMode = 'list'" 
          :class="[
            'py-2 px-4 text-sm font-medium',
            viewMode === 'list' 
              ? 'border-b-2 border-indigo-500 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Vue liste
        </button>
        <button 
          @click="viewMode = 'calendar'" 
          :class="[
            'py-2 px-4 text-sm font-medium',
            viewMode === 'calendar' 
              ? 'border-b-2 border-indigo-500 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Vue calendrier
        </button>
      </div>
    </div>

    <!-- Vue liste des activités -->
    <div v-if="viewMode === 'list'" class="space-y-4">
      <div v-if="loading" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">Chargement des activités...</p>
      </div>
      <div v-else-if="filteredActivities.length === 0" class="text-center py-10">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune activité trouvée</h3>
        <p class="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle activité.</p>
        <div class="mt-6">
          <RouterLink 
            to="/activities/create" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Créer une activité
          </RouterLink>
        </div>
      </div>
      <div v-else>
        <div v-for="activity in filteredActivities" :key="activity.id" class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div class="flex flex-col md:flex-row">
            <!-- Image de l'activité -->
            <div class="md:w-1/4 bg-gray-200">
              <img 
                v-if="activity.image" 
                :src="activity.image" 
                :alt="activity.title" 
                class="h-48 w-full object-cover"
              />
              <div v-else class="h-48 w-full flex items-center justify-center bg-gray-100">
                <svg class="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <!-- Détails de l'activité -->
            <div class="p-4 md:p-6 md:w-3/4">
              <div class="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ activity.title }}</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ getCommunityName(activity.communityId) }}
                  </p>
                </div>
                <div class="mt-2 md:mt-0">
                  <span 
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      getStatusClass(activity.status)
                    ]"
                  >
                    {{ getStatusText(activity.status) }}
                  </span>
                </div>
              </div>
              
              <p class="mt-3 text-sm text-gray-600 line-clamp-2">{{ activity.description }}</p>
              
              <div class="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-y-2 gap-x-4">
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  {{ formatDate(activity.startDate) }} - {{ formatDate(activity.endDate) }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ activity.location }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {{ activity.participants }} participants
                </div>
              </div>
              
              <div class="mt-6 flex flex-wrap gap-2">
                <RouterLink 
                  :to="`/activities/${activity.id}`" 
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  Détails
                </RouterLink>
                <RouterLink 
                  v-if="canEdit(activity)"
                  :to="`/activities/${activity.id}/edit`" 
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-indigo-700 bg-white hover:bg-gray-50"
                >
                  Modifier
                </RouterLink>
                <button 
                  v-if="canCancel(activity)"
                  @click="cancelActivity(activity.id)" 
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredActivities.length > 0" class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-700">
          Affichage de <span class="font-medium">{{ paginationStart }}</span> à <span class="font-medium">{{ paginationEnd }}</span> sur <span class="font-medium">{{ totalActivities }}</span> activités
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1" 
            :class="[
              'px-3 py-1 rounded-md text-sm',
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            ]"
          >
            Précédent
          </button>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages" 
            :class="[
              'px-3 py-1 rounded-md text-sm',
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            ]"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Vue calendrier -->
    <div v-if="viewMode === 'calendar'" class="bg-white">
      <div class="flex items-center justify-between mb-4">
        <div>
          <button @click="previousMonth" class="p-1 rounded-full hover:bg-gray-100">
            <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <h2 class="text-lg font-semibold text-gray-900">{{ currentMonthName }} {{ currentYear }}</h2>
        <div>
          <button @click="nextMonth" class="p-1 rounded-full hover:bg-gray-100">
            <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Jours de la semaine -->
      <div class="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
        <div v-for="day in weekDays" :key="day" class="bg-gray-50 py-2">
          <div class="text-center text-xs font-semibold text-gray-700">{{ day }}</div>
        </div>
      </div>

      <!-- Grille du calendrier -->
      <div class="grid grid-cols-7 gap-px bg-gray-200">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index" 
          :class="[
            'min-h-[100px] bg-white p-2',
            day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400',
            day.isToday ? 'bg-indigo-50' : ''
          ]"
        >
          <div class="flex justify-between">
            <span 
              :class="[
                'text-sm font-medium',
                day.isToday ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
              ]"
            >
              {{ day.date }}
            </span>
          </div>
          <div class="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
            <div 
              v-for="event in day.events" 
              :key="event.id"
              :class="[
                'px-1 py-0.5 text-xs rounded truncate cursor-pointer',
                getEventClass(event.status)
              ]"
              @click="viewActivity(event.id)"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useActivityStore } from '@/stores/activity'
import { useCommunityStore } from '@/stores/community'
import { RouterLink } from 'vue-router'

const router = useRouter()
const activityStore = useActivityStore()
const communityStore = useCommunityStore()

// État local
const searchQuery = ref('')
const statusFilter = ref('all')
const communityFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const loading = ref(true)
const viewMode = ref('list')

// Calendrier
const currentDate = ref(new Date())
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Récupération des données
onMounted(async () => {
  try {
    await Promise.all([
      activityStore.fetchActivities(),
      communityStore.fetchCommunities()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
})

// Computed properties
const activities = computed(() => activityStore.activities)
const communities = computed(() => communityStore.communities)

const filteredActivities = computed(() => {
  return activities.value
    .filter(activity => {
      // Filtre par recherche
      const matchesSearch = searchQuery.value === '' || 
        activity.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      // Filtre par statut
      const matchesStatus = statusFilter.value === 'all' || activity.status === statusFilter.value
      
      // Filtre par communauté
      const matchesCommunity = communityFilter.value === 'all' || activity.communityId === parseInt(communityFilter.value)
      
      return matchesSearch && matchesStatus && matchesCommunity
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value)
})

const totalActivities = computed(() => {
  return activities.value.filter(activity => {
    // Filtre par recherche
    const matchesSearch = searchQuery.value === '' || 
      activity.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filtre par statut
    const matchesStatus = statusFilter.value === 'all' || activity.status === statusFilter.value
    
    // Filtre par communauté
    const matchesCommunity = communityFilter.value === 'all' || activity.communityId === parseInt(communityFilter.value)
    
    return matchesSearch && matchesStatus && matchesCommunity
  }).length
})

const totalPages = computed(() => Math.ceil(totalActivities.value / itemsPerPage.value))

const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalActivities.value)
})

// Propriétés calculées pour le calendrier
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(currentDate.value)
})

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  // Premier jour du mois
  const firstDay = new Date(year, month, 1)
  // Dernier jour du mois
  const lastDay = new Date(year, month + 1, 0)
  
  // Jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
  let firstDayOfWeek = firstDay.getDay() - 1
  if (firstDayOfWeek < 0) firstDayOfWeek = 6 // Ajuster pour que lundi soit le premier jour
  
  // Nombre de jours dans le mois
  const daysInMonth = lastDay.getDate()
  
  // Tableau pour stocker tous les jours à afficher
  const days = []
  
  // Ajouter les jours du mois précédent
  const prevMonth = new Date(year, month, 0)
  const daysInPrevMonth = prevMonth.getDate()
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(new Date(year, month - 1, daysInPrevMonth - i))
    })
  }
  
  // Ajouter les jours du mois actuel
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: 
        today.getDate() === i && 
        today.getMonth() === month && 
        today.getFullYear() === year,
      events: getEventsForDate(date)
    })
  }
  
  // Ajouter les jours du mois suivant
  const totalDaysNeeded = 42 // 6 semaines * 7 jours
  const remainingDays = totalDaysNeeded - days.length
  
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(new Date(year, month + 1, i))
    })
  }
  
  return days
})

// Méthodes
function getCommunityName(communityId) {
  const community = communities.value.find(c => c.id === communityId)
  return community ? community.name : 'N/A'
}

function getStatusText(status) {
  switch (status) {
    case 'upcoming': return 'À venir'
    case 'ongoing': return 'En cours'
    case 'past': return 'Passée'
    case 'cancelled': return 'Annulée'
    default: return status
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'upcoming': return 'bg-blue-100 text-blue-800'
    case 'ongoing': return 'bg-green-100 text-green-800'
    case 'past': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getEventClass(status) {
  switch (status) {
    case 'upcoming': return 'bg-blue-100 text-blue-800'
    case 'ongoing': return 'bg-green-100 text-green-800'
    case 'past': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString) {
  try {
    // Vérifier si la date est valide
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'Date non disponible';
    }
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Erreur de formatage de date:', error, 'pour la valeur:', dateString);
    return 'Date non disponible';
  }
}

function canEdit(activity) {
  // Logique pour déterminer si l'utilisateur peut modifier l'activité
  return activity.status === 'upcoming' || activity.status === 'ongoing'
}

function canCancel(activity) {
  // Logique pour déterminer si l'utilisateur peut annuler l'activité
  return activity.status === 'upcoming' || activity.status === 'ongoing'
}

async function cancelActivity(activityId) {
  if (confirm('Êtes-vous sûr de vouloir annuler cette activité ?')) {
    try {
      await activityStore.cancelActivity(activityId)
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'activité:', error)
    }
  }
}

function viewActivity(activityId) {
  router.push(`/activities/${activityId}`)
}

function getEventsForDate(date) {
  // Filtrer les activités qui ont lieu à cette date
  return activities.value.filter(activity => {
    const startDate = new Date(activity.startDate)
    const endDate = new Date(activity.endDate)
    
    // Vérifier si la date est entre la date de début et la date de fin
    return (
      date.getFullYear() >= startDate.getFullYear() &&
      date.getMonth() >= startDate.getMonth() &&
      date.getDate() >= startDate.getDate() &&
      date.getFullYear() <= endDate.getFullYear() &&
      date.getMonth() <= endDate.getMonth() &&
      date.getDate() <= endDate.getDate()
    )
  })
}

function previousMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
