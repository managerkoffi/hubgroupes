<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const router = useRouter()
const communityStore = useCommunityStore()

const communities = ref([])
const isLoading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedFilter = ref('all') // all, owner, member

// Filtres disponibles
const filters = [
  { id: 'all', name: 'Toutes' },
  { id: 'owner', name: 'Mes communautés' },
  { id: 'member', name: 'Membre' }
]

onMounted(async () => {
  await fetchCommunities()
})

const fetchCommunities = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    communities.value = await communityStore.fetchCommunities()
  } catch (err) {
    error.value = 'Erreur lors du chargement des communautés'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const filteredCommunities = computed(() => {
  let filtered = communities.value

  // Appliquer le filtre par type
  if (selectedFilter.value === 'owner') {
    filtered = filtered.filter(community => community.isOwner)
  } else if (selectedFilter.value === 'member') {
    filtered = filtered.filter(community => community.isMember && !community.isOwner)
  }

  // Appliquer la recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(community => 
      community.name.toLowerCase().includes(query) || 
      community.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const navigateToDetail = (communityId) => {
  router.push({ name: 'community-details', params: { id: communityId } })
}

const navigateToCreate = () => {
  router.push({ name: 'community-create' })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Communautés</h1>
        <p class="text-gray-600 mt-1">Découvrez et rejoignez des communautés ou créez la vôtre</p>
      </div>
      <BaseButton 
        variant="primary" 
        class="mt-4 md:mt-0"
        @click="navigateToCreate"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Créer une communauté
      </BaseButton>
    </div>

    <!-- Filtres et recherche -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="w-full md:w-64">
        <label for="search" class="sr-only">Rechercher</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une communauté..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="selectedFilter = filter.id"
          class="px-3 py-2 text-sm font-medium rounded-md"
          :class="selectedFilter === filter.id ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          {{ filter.name }}
        </button>
      </div>
    </div>

    <!-- Message d'erreur -->
    <BaseAlert
      v-if="error"
      type="error"
      :message="error"
    />

    <!-- Chargement -->
    <div v-if="isLoading" class="flex justify-center my-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Liste vide -->
    <div v-else-if="filteredCommunities.length === 0" class="text-center my-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune communauté trouvée</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ searchQuery ? 'Essayez avec d\'autres termes de recherche' : 'Commencez par créer une nouvelle communauté' }}
      </p>
      <div class="mt-6" v-if="!searchQuery">
        <BaseButton 
          variant="primary"
          @click="navigateToCreate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Créer une communauté
        </BaseButton>
      </div>
    </div>

    <!-- Liste des communautés -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="community in filteredCommunities"
        :key="community.id"
        padding="normal"
        shadow="md"
        class="cursor-pointer hover:shadow-lg transition-shadow duration-200"
        @click="navigateToDetail(community.id)"
      >
        <div class="relative pb-2/3">
          <img 
            :src="community.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'" 
            class="absolute h-40 w-full object-cover rounded-t-md"
            alt="Couverture de la communauté"
          />
        </div>
        
        <div class="pt-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ community.name }}</h3>
              <p class="text-sm text-gray-500">{{ community.memberCount }} membres</p>
            </div>
            <span 
              v-if="community.isOwner" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              Propriétaire
            </span>
            <span 
              v-else-if="community.isMember" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              Membre
            </span>
          </div>
          
          <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ community.description }}</p>
          
          <div class="mt-4 flex justify-between items-center">
            <div class="flex -space-x-2 overflow-hidden">
              <img
                v-for="(member, index) in community.recentMembers || []"
                :key="index"
                class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                :src="member.avatar"
                :alt="`${member.name}`"
              />
              <span v-if="(community.memberCount || 0) > (community.recentMembers || []).length" class="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs font-medium text-gray-500 ring-2 ring-white">
                +{{ (community.memberCount || 0) - (community.recentMembers || []).length }}
              </span>
            </div>
            
            <div class="text-sm text-gray-500">
              <span v-if="community.lastActivity" class="flex items-center">
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
                {{ community.lastActivity }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
