<template>
    <div class="container mx-auto px-4 py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Annonces</h1>
            <p class="mt-1 text-sm text-gray-600">Consultez les dernières annonces de vos communautés.</p>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>

        <div v-else-if="announcements.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
            <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune annonce</h3>
            <p class="mt-1 text-sm text-gray-500">
                Vous n'avez pas encore reçu d'annonces de vos communautés.
            </p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="announcement in announcements" :key="announcement.id" class="bg-white shadow overflow-hidden sm:rounded-lg border-l-4 border-indigo-500">
                <div class="px-4 py-5 sm:px-6">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <div class="ml-4 flex-1">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="text-lg font-medium text-gray-900">{{ announcement.title }}</h4>
                                    <p class="mt-1 text-sm text-gray-500">
                                        {{ formatDate(announcement.createdAt) }} • 
                                        <RouterLink :to="`/communities/${announcement.communityId}`" class="text-indigo-600 hover:text-indigo-900">
                                            {{ announcement.communityName }}
                                        </RouterLink>
                                    </p>
                                </div>
                            </div>
                            <div class="mt-2 prose prose-sm max-w-none text-gray-600">
                                <p>{{ announcement.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'AnnouncementsView',
    setup() {
        const loading = ref(true);
        const announcements = ref([]);

        const fetchAnnouncements = async () => {
            loading.value = true;
            try {
                // Simulation d'un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données fictives
                announcements.value = [
                    {
                        id: '1',
                        title: 'Nouveau projet communautaire',
                        content: 'Nous lançons un nouveau projet communautaire pour créer une bibliothèque de composants Vue.js. Rejoignez-nous !',
                        createdAt: '2023-04-10T11:00:00Z',
                        communityId: '1',
                        communityName: 'Communauté de développeurs Vue.js'
                    },
                    {
                        id: '2',
                        title: 'Mise à jour des règles de la communauté',
                        content: 'Nous avons mis à jour les règles de la communauté pour améliorer la qualité des discussions. Veuillez les consulter.',
                        createdAt: '2023-03-25T09:30:00Z',
                        communityId: '1',
                        communityName: 'Communauté de développeurs Vue.js'
                    },
                    {
                        id: '3',
                        title: 'Événement à venir : Hackathon JavaScript',
                        content: 'Nous organisons un hackathon JavaScript le mois prochain. Inscrivez-vous dès maintenant pour participer !',
                        createdAt: '2023-03-15T14:20:00Z',
                        communityId: '2',
                        communityName: 'JavaScript Enthusiasts'
                    }
                ];
            } catch (error) {
                console.error('Erreur lors du chargement des annonces:', error);
            } finally {
                loading.value = false;
            }
        };

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        };

        onMounted(() => {
            fetchAnnouncements();
        });

        return {
            loading,
            announcements,
            formatDate
        };
    }
};
</script>
