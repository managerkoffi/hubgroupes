<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des Membres</h1>
      <RouterLink 
        to="/members/invite" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Inviter un membre
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
          placeholder="Rechercher un membre..."
        />
      </div>
      <select 
        v-model="statusFilter" 
        class="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="pending">En attente</option>
        <option value="inactive">Inactifs</option>
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

    <!-- Tableau des membres -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Membre
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Communauté
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date d'inscription
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cotisation
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Chargement des membres...
            </td>
          </tr>
          <tr v-else-if="filteredMembers.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Aucun membre trouvé
            </td>
          </tr>
          <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img class="h-10 w-10 rounded-full" :src="member.avatar" alt="" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                  <div class="text-sm text-gray-500">{{ member.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ getCommunityName(member.communityId) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  member.status === 'active' ? 'bg-green-100 text-green-800' : 
                  member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ getStatusText(member.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(member.joinedAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span 
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  member.subscriptionStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ member.subscriptionStatus === 'paid' ? 'À jour' : 'En retard' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="viewMember(member.id)" 
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Voir
              </button>
              <button 
                v-if="member.status === 'pending'"
                @click="validateMember(member.id)" 
                class="text-green-600 hover:text-green-900 mr-3"
              >
                Valider
              </button>
              <button 
                @click="removeMember(member.id)" 
                class="text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-700">
        Affichage de <span class="font-medium">{{ paginationStart }}</span> à <span class="font-medium">{{ paginationEnd }}</span> sur <span class="font-medium">{{ totalMembers }}</span> membres
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/member'
import { useCommunityStore } from '@/stores/community'

const router = useRouter()
const memberStore = useMemberStore()
const communityStore = useCommunityStore()

// État local
const searchQuery = ref('')
const statusFilter = ref('all')
const communityFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const loading = ref(true)

// Récupération des données
onMounted(async () => {
  try {
    await Promise.all([
      memberStore.fetchMembers(),
      communityStore.fetchCommunities()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
})

// Computed properties
const members = computed(() => memberStore.members)
const communities = computed(() => communityStore.communities)

const filteredMembers = computed(() => {
  return members.value
    .filter(member => {
      // Filtre par recherche
      const matchesSearch = searchQuery.value === '' || 
        member.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      // Filtre par statut
      const matchesStatus = statusFilter.value === 'all' || member.status === statusFilter.value
      
      // Filtre par communauté
      const matchesCommunity = communityFilter.value === 'all' || member.communityId === parseInt(communityFilter.value)
      
      return matchesSearch && matchesStatus && matchesCommunity
    })
    .slice(paginationStart.value - 1, paginationEnd.value)
})

const totalMembers = computed(() => {
  return members.value.filter(member => {
    // Filtre par recherche
    const matchesSearch = searchQuery.value === '' || 
      member.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filtre par statut
    const matchesStatus = statusFilter.value === 'all' || member.status === statusFilter.value
    
    // Filtre par communauté
    const matchesCommunity = communityFilter.value === 'all' || member.communityId === parseInt(communityFilter.value)
    
    return matchesSearch && matchesStatus && matchesCommunity
  }).length
})

const totalPages = computed(() => Math.ceil(totalMembers.value / itemsPerPage.value))

const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalMembers.value)
})

// Méthodes
function getCommunityName(communityId) {
  const community = communities.value.find(c => c.id === communityId)
  return community ? community.name : 'N/A'
}

function getStatusText(status) {
  switch (status) {
    case 'active': return 'Actif'
    case 'pending': return 'En attente'
    case 'inactive': return 'Inactif'
    default: return status
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR').format(date)
}

function viewMember(memberId) {
  router.push(`/members/${memberId}`)
}

async function validateMember(memberId) {
  try {
    await memberStore.validateMember(memberId)
  } catch (error) {
    console.error('Erreur lors de la validation du membre:', error)
  }
}

async function removeMember(memberId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
    try {
      await memberStore.removeMember(memberId)
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error)
    }
  }
}
</script>
