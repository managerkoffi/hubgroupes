<template>
    <div class="container mx-auto px-4 py-8 max-w-7xl overflow-x-hidden">
        <!-- Chargement -->
        <div v-if="isLoading" class="flex justify-center my-12">
            <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>

        <!-- Message d'erreur -->
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Erreur!</strong>
            <span class="block sm:inline">{{ error }}</span>
        </div>

        <!-- Contenu de la communauté -->
        <div v-else class="bg-white shadow rounded-lg overflow-hidden">
            <!-- Image de couverture et logo -->
            <div class="relative">
                <!-- Image de couverture -->
                <div class="h-48 md:h-64 w-full bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
                    <img 
                        v-if="community.coverImage" 
                        :src="community.coverImage" 
                        alt="Couverture de la communauté"
                        class="w-full h-full object-cover opacity-90"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>
                
                <!-- Logo de la communauté -->
                <div class="absolute -bottom-12 left-6 md:left-8">
                    <div class="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
                        <img 
                            v-if="community.logo" 
                            :src="community.logo" 
                            alt="Logo de la communauté"
                            class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-3xl font-bold text-indigo-600">{{ community.name ? community.name.charAt(0).toUpperCase() : 'C' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- En-tête avec informations de base -->
            <div class="pt-16 pb-6 px-6 border-b border-gray-200">
                <div class="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">{{ community.name }}</h1>
                        <div class="flex items-center mt-2 space-x-4">
                            <div class="flex items-center">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {{ community.type || 'Communauté' }}
                                </span>
                            </div>
                            <div class="flex items-center text-gray-500 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                {{ community.members ? community.members.length : 0 }} membres
                            </div>
                            <div class="text-sm text-gray-500">
                                Créée le {{ formatDate(community.createdAt) }}
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 md:mt-0 flex space-x-2">
                        <router-link 
                            v-if="isAdmin" 
                            :to="{ name: 'community-dashboard', params: { id: community.id } }" 
                            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                            </svg>
                            Tableau de bord
                        </router-link>
                        <button v-if="!isMember" @click="joinCommunity" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Rejoindre
                        </button>
                        <button v-else-if="!isAdmin" @click="leaveCommunity" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Quitter
                        </button>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-3">À propos de cette communauté</h2>
                <p class="text-gray-600">{{ community.description }}</p>
            </div>

            <!-- Navigation par onglets -->
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6">
                    <button @click="activeTab = 'members'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm',
                        activeTab === 'members' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    ]">
                        Membres
                    </button>
                    <button @click="activeTab = 'activities'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm',
                        activeTab === 'activities' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    ]">
                        Activités
                    </button>
                    <button @click="activeTab = 'discussions'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm',
                        activeTab === 'discussions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    ]">
                        Discussions
                    </button>
                </nav>
            </div>

            <!-- Contenu des onglets -->
            <div class="p-6">
                <!-- Onglet Membres -->
                <div v-if="activeTab === 'members'">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Liste des membres</h3>
                    <div v-if="community.members && community.members.length > 0" class="space-y-4">
                        <div v-for="member in community.members" :key="member.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div>
                                <p class="font-medium">{{ member.firstName }} {{ member.lastName }}</p>
                                <p class="text-sm text-gray-500">{{ member.email }}</p>
                            </div>
                            <span :class="[
                                'px-2 py-1 text-xs font-medium rounded-full',
                                member.role === 'admin' ? 'bg-red-100 text-red-800' : 
                                member.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 
                                'bg-green-100 text-green-800'
                            ]">
                                {{ member.role === 'admin' ? 'Administrateur' : 
                                   member.role === 'moderator' ? 'Modérateur' : 'Membre' }}
                            </span>
                        </div>
                    </div>
                    <div v-else class="text-center py-8">
                        <p class="text-gray-500">Aucun membre pour le moment.</p>
                    </div>
                </div>

                <!-- Onglet Activités -->
                <div v-if="activeTab === 'activities'">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Activités de la communauté</h3>
                    </div>
                    <div v-if="activities.length > 0" class="space-y-4">
                        <div v-for="activity in activities" :key="activity.id" class="p-4 border rounded-md">
                            <h4 class="font-medium">{{ activity.title }}</h4>
                            <p class="text-sm text-gray-500">{{ formatDate(activity.startDate) }}</p>
                            <p class="mt-2">{{ activity.description }}</p>
                        </div>
                    </div>
                    <div v-else class="text-center py-8">
                        <p class="text-gray-500">Aucune activité pour le moment.</p>
                    </div>
                </div>

                <!-- Onglet Discussions -->
                <div v-if="activeTab === 'discussions'">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Discussions</h3>
                    </div>
                    <div v-if="discussions.length > 0" class="space-y-4">
                        <div v-for="discussion in discussions" :key="discussion.id" class="p-4 border rounded-md">
                            <h4 class="font-medium">{{ discussion.title }}</h4>
                            <p class="text-sm text-gray-500">{{ formatDate(discussion.createdAt) }}</p>
                            <p class="mt-2">{{ discussion.content }}</p>
                        </div>
                    </div>
                    <div v-else class="text-center py-8">
                        <p class="text-gray-500">Aucune discussion pour le moment.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore } from '@/stores/auth';
import { useCommunityStore } from '@/stores/community';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const communityStore = useCommunityStore();

// État
const communityId = ref(route.params.id);
const community = ref({
    id: '',
    name: '',
    description: '',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    coverImage: null,
    members: [],
    tags: []
});
const activeTab = ref('members');
const activities = ref([]);
const discussions = ref([]);
const announcements = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Propriétés calculées
const currentUser = computed(() => authStore.user);
const isAdmin = computed(() => {
    if (!currentUser.value || !community.value.members) return false;
    const userMember = community.value.members.find(m => m.id === currentUser.value.id);
    return userMember && userMember.role === 'admin';
});
const isModerator = computed(() => {
    if (!currentUser.value || !community.value.members) return false;
    const userMember = community.value.members.find(m => m.id === currentUser.value.id);
    return userMember && (userMember.role === 'moderator' || userMember.role === 'admin');
});
const isMember = computed(() => {
    if (!currentUser.value || !community.value.members) return false;
    return community.value.members.some(m => m.id === currentUser.value.id);
});
const isPending = computed(() => {
    // Logique pour vérifier si l'utilisateur a une demande d'adhésion en attente
    return false; // À implémenter avec les données réelles
});
const canEdit = computed(() => isAdmin.value);
const canCreateActivity = computed(() => isMember.value);

// Méthodes
const fetchCommunity = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const communityData = await communityStore.fetchCommunityById(communityId.value);
        
        // Ajouter des données d'exemple pour l'image de couverture et le logo
        // Dans un environnement de production, ces données viendraient de l'API
        community.value = {
            ...communityData,
            coverImage: communityData.coverImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
            logo: communityData.logo || (communityData.type === 'sports' ? 
                'https://images.unsplash.com/photo-1546519638-68e109acd27d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' : 
                null)
        };
        
        await fetchActivities();
        await fetchDiscussions();
        await fetchAnnouncements();
    } catch (err) {
        console.error('Erreur lors de la récupération des détails de la communauté:', err);
        error.value = 'Impossible de charger les détails de la communauté. Veuillez réessayer plus tard.';
    } finally {
        isLoading.value = false;
    }
};

const fetchActivities = async () => {
    try {
        const activitiesData = await communityStore.fetchCommunityActivities(communityId.value);
        activities.value = activitiesData;
    } catch (err) {
        console.error('Erreur lors de la récupération des activités:', err);
    }
};

const fetchDiscussions = async () => {
    try {
        const discussionsData = await communityStore.fetchCommunityDiscussions(communityId.value);
        discussions.value = discussionsData;
    } catch (err) {
        console.error('Erreur lors de la récupération des discussions:', err);
    }
};

const fetchAnnouncements = async () => {
    try {
        const announcementsData = await communityStore.fetchCommunityAnnouncements(communityId.value);
        announcements.value = announcementsData;
    } catch (err) {
        console.error('Erreur lors de la récupération des annonces:', err);
    }
};

const joinCommunity = async () => {
    try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (community.value.isPrivate) {
            // Si la communauté est privée, la demande est en attente
            alert('Votre demande d\'adhésion a été envoyée et est en attente d\'approbation.');
        } else {
            // Si la communauté est publique, l'adhésion est immédiate
            const newMember = {
                id: currentUser.value.id,
                firstName: currentUser.value.firstName,
                lastName: currentUser.value.lastName,
                email: currentUser.value.email,
                role: 'member'
            };
            community.value.members.push(newMember);
            alert('Vous avez rejoint la communauté avec succès !');
        }
    } catch (err) {
        console.error('Erreur lors de la tentative d\'adhésion à la communauté:', err);
        alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
    }
};

const leaveCommunity = async () => {
    if (!confirm('Êtes-vous sûr de vouloir quitter cette communauté ?')) return;
    
    try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Supprimer l'utilisateur de la liste des membres
        community.value.members = community.value.members.filter(m => m.id !== currentUser.value.id);
        alert('Vous avez quitté la communauté.');
    } catch (err) {
        console.error('Erreur lors de la tentative de quitter la communauté:', err);
        alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
    }
};

const openManageMemberModal = (member) => {
    // À implémenter : ouvrir une modale pour gérer le membre
    alert(`Gestion du membre : ${member.firstName} ${member.lastName}`);
};

const openNewDiscussionModal = () => {
    // À implémenter : ouvrir une modale pour créer une nouvelle discussion
    alert('Création d\'une nouvelle discussion');
};

const openNewAnnouncementModal = () => {
    // À implémenter : ouvrir une modale pour créer une nouvelle annonce
    alert('Création d\'une nouvelle annonce');
};

const editAnnouncement = (announcement) => {
    // À implémenter : ouvrir une modale pour modifier l'annonce
    alert(`Modification de l'annonce : ${announcement.title}`);
};

const deleteAnnouncement = async (announcementId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    
    try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Supprimer l'annonce de la liste
        announcements.value = announcements.value.filter(a => a.id !== announcementId);
        alert('Annonce supprimée avec succès.');
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'annonce:', err);
        alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
    }
};

// Utilitaires
const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
};

const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

const getActivityStatusClass = (status) => {
    switch (status) {
        case 'upcoming':
            return 'bg-blue-100 text-blue-800';
        case 'ongoing':
            return 'bg-green-100 text-green-800';
        case 'completed':
            return 'bg-gray-100 text-gray-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getActivityStatusText = (status) => {
    switch (status) {
        case 'upcoming':
            return 'À venir';
        case 'ongoing':
            return 'En cours';
        case 'completed':
            return 'Terminée';
        case 'cancelled':
            return 'Annulée';
        default:
            return 'Inconnu';
    }
};

// Cycle de vie
onMounted(() => {
    fetchCommunity();
});
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>
