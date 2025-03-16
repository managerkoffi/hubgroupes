<template>
    <div class="container mx-auto px-4 py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Marketplace</h1>
            <p class="mt-1 text-sm text-gray-600">Découvrez des extensions et services pour améliorer vos communautés.</p>
        </div>

        <!-- Filtres et recherche -->
        <div class="bg-white shadow p-4 rounded-lg mb-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="w-full md:w-1/3 mb-4 md:mb-0">
                    <div class="relative">
                        <input
                            type="text"
                            v-model="searchQuery"
                            placeholder="Rechercher des extensions..."
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <select
                        v-model="categoryFilter"
                        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">Toutes les catégories</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <select
                        v-model="sortBy"
                        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="popular">Popularité</option>
                        <option value="newest">Plus récents</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                        <option value="rating">Meilleures évaluations</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Contenu principal -->
        <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>

        <div v-else>
            <!-- Extensions recommandées -->
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Extensions recommandées</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div
                        v-for="extension in featuredExtensions"
                        :key="extension.id"
                        class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div class="relative pb-1/2">
                            <img :src="extension.image" :alt="extension.name" class="absolute h-full w-full object-cover" />
                        </div>
                        <div class="p-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium text-gray-900">{{ extension.name }}</h3>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {{ getCategoryName(extension.categoryId) }}
                                </span>
                            </div>
                            <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ extension.description }}</p>
                            <div class="mt-2 flex items-center">
                                <div class="flex items-center">
                                    <template v-for="n in 5" :key="n">
                                        <svg
                                            :class="[
                                                'h-5 w-5',
                                                n <= extension.rating ? 'text-yellow-400' : 'text-gray-300'
                                            ]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </template>
                                </div>
                                <p class="ml-2 text-sm text-gray-500">{{ extension.reviewCount }} avis</p>
                            </div>
                            <div class="mt-4 flex items-center justify-between">
                                <span class="text-base font-medium text-gray-900">
                                    {{ formatPrice(extension.price) }}
                                </span>
                                <button
                                    @click="installExtension(extension)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {{ extension.price > 0 ? 'Acheter' : 'Installer' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Toutes les extensions -->
            <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Toutes les extensions</h2>
                <div v-if="filteredExtensions.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
                    <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Aucune extension ne correspond à votre recherche.
                    </p>
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div
                        v-for="extension in filteredExtensions"
                        :key="extension.id"
                        class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div class="relative pb-1/2">
                            <img :src="extension.image" :alt="extension.name" class="absolute h-full w-full object-cover" />
                        </div>
                        <div class="p-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium text-gray-900">{{ extension.name }}</h3>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {{ getCategoryName(extension.categoryId) }}
                                </span>
                            </div>
                            <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ extension.description }}</p>
                            <div class="mt-2 flex items-center">
                                <div class="flex items-center">
                                    <template v-for="n in 5" :key="n">
                                        <svg
                                            :class="[
                                                'h-5 w-5',
                                                n <= extension.rating ? 'text-yellow-400' : 'text-gray-300'
                                            ]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </template>
                                </div>
                                <p class="ml-2 text-sm text-gray-500">{{ extension.reviewCount }} avis</p>
                            </div>
                            <div class="mt-4 flex items-center justify-between">
                                <span class="text-base font-medium text-gray-900">
                                    {{ formatPrice(extension.price) }}
                                </span>
                                <button
                                    @click="installExtension(extension)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {{ extension.price > 0 ? 'Acheter' : 'Installer' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
    name: 'MarketplaceView',
    setup() {
        const loading = ref(true);
        const searchQuery = ref('');
        const categoryFilter = ref('');
        const sortBy = ref('popular');
        const extensions = ref([]);
        const categories = ref([]);

        const featuredExtensions = computed(() => {
            return extensions.value.filter(ext => ext.featured).slice(0, 4);
        });

        const filteredExtensions = computed(() => {
            let result = [...extensions.value];
            
            // Filtrer par recherche
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(ext => 
                    ext.name.toLowerCase().includes(query) || 
                    ext.description.toLowerCase().includes(query)
                );
            }
            
            // Filtrer par catégorie
            if (categoryFilter.value) {
                result = result.filter(ext => ext.categoryId === categoryFilter.value);
            }
            
            // Trier
            switch (sortBy.value) {
                case 'newest':
                    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'price_asc':
                    result.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    result.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    result.sort((a, b) => b.rating - a.rating);
                    break;
                case 'popular':
                default:
                    result.sort((a, b) => b.installCount - a.installCount);
                    break;
            }
            
            return result;
        });

        const fetchData = async () => {
            loading.value = true;
            try {
                // Simulation d'un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données fictives pour les catégories
                categories.value = [
                    { id: 'analytics', name: 'Analytiques' },
                    { id: 'communication', name: 'Communication' },
                    { id: 'integration', name: 'Intégrations' },
                    { id: 'moderation', name: 'Modération' },
                    { id: 'customization', name: 'Personnalisation' }
                ];
                
                // Données fictives pour les extensions
                extensions.value = [
                    {
                        id: '1',
                        name: 'Analytiques Avancées',
                        description: 'Obtenez des insights détaillés sur l\'activité de vos communautés avec des graphiques et des rapports personnalisables.',
                        image: 'https://via.placeholder.com/300x150?text=Analytics',
                        price: 19.99,
                        rating: 4.5,
                        reviewCount: 128,
                        installCount: 5420,
                        categoryId: 'analytics',
                        featured: true,
                        createdAt: '2023-02-10T00:00:00Z'
                    },
                    {
                        id: '2',
                        name: 'Chat en Direct',
                        description: 'Ajoutez un chat en direct à vos communautés pour faciliter les discussions en temps réel entre les membres.',
                        image: 'https://via.placeholder.com/300x150?text=Live+Chat',
                        price: 9.99,
                        rating: 4.2,
                        reviewCount: 95,
                        installCount: 3210,
                        categoryId: 'communication',
                        featured: true,
                        createdAt: '2023-01-15T00:00:00Z'
                    },
                    {
                        id: '3',
                        name: 'Intégration Slack',
                        description: 'Connectez vos communautés à Slack pour synchroniser les messages et les notifications.',
                        image: 'https://via.placeholder.com/300x150?text=Slack',
                        price: 4.99,
                        rating: 4.0,
                        reviewCount: 67,
                        installCount: 2150,
                        categoryId: 'integration',
                        featured: false,
                        createdAt: '2023-03-05T00:00:00Z'
                    },
                    {
                        id: '4',
                        name: 'Modération Automatique',
                        description: 'Utilisez l\'IA pour modérer automatiquement le contenu et les discussions dans vos communautés.',
                        image: 'https://via.placeholder.com/300x150?text=Moderation',
                        price: 29.99,
                        rating: 4.7,
                        reviewCount: 203,
                        installCount: 4780,
                        categoryId: 'moderation',
                        featured: true,
                        createdAt: '2022-12-20T00:00:00Z'
                    },
                    {
                        id: '5',
                        name: 'Thèmes Personnalisés',
                        description: 'Personnalisez l\'apparence de vos communautés avec des thèmes et des couleurs personnalisables.',
                        image: 'https://via.placeholder.com/300x150?text=Themes',
                        price: 14.99,
                        rating: 4.3,
                        reviewCount: 156,
                        installCount: 3890,
                        categoryId: 'customization',
                        featured: true,
                        createdAt: '2023-01-25T00:00:00Z'
                    },
                    {
                        id: '6',
                        name: 'Sondages et Votes',
                        description: 'Créez des sondages et des votes interactifs pour engager les membres de vos communautés.',
                        image: 'https://via.placeholder.com/300x150?text=Polls',
                        price: 0,
                        rating: 4.1,
                        reviewCount: 89,
                        installCount: 2760,
                        categoryId: 'communication',
                        featured: false,
                        createdAt: '2023-02-28T00:00:00Z'
                    },
                    {
                        id: '7',
                        name: 'Intégration Discord',
                        description: 'Connectez vos communautés à Discord pour synchroniser les messages et les notifications.',
                        image: 'https://via.placeholder.com/300x150?text=Discord',
                        price: 4.99,
                        rating: 3.9,
                        reviewCount: 45,
                        installCount: 1820,
                        categoryId: 'integration',
                        featured: false,
                        createdAt: '2023-03-10T00:00:00Z'
                    },
                    {
                        id: '8',
                        name: 'Badges et Récompenses',
                        description: 'Motivez vos membres avec un système de badges et de récompenses personnalisables.',
                        image: 'https://via.placeholder.com/300x150?text=Badges',
                        price: 7.99,
                        rating: 4.4,
                        reviewCount: 112,
                        installCount: 3450,
                        categoryId: 'customization',
                        featured: false,
                        createdAt: '2023-01-05T00:00:00Z'
                    }
                ];
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                loading.value = false;
            }
        };

        const getCategoryName = (categoryId) => {
            const category = categories.value.find(cat => cat.id === categoryId);
            return category ? category.name : '';
        };

        const formatPrice = (price) => {
            if (price === 0) return 'Gratuit';
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
        };

        const installExtension = (extension) => {
            console.log('Installation de l\'extension:', extension.name);
            // Logique pour installer ou acheter l'extension
            if (extension.price > 0) {
                alert(`Achat de l'extension "${extension.name}" pour ${formatPrice(extension.price)}`);
            } else {
                alert(`Installation de l'extension gratuite "${extension.name}"`);
            }
        };

        onMounted(() => {
            fetchData();
        });

        return {
            loading,
            searchQuery,
            categoryFilter,
            sortBy,
            categories,
            extensions,
            featuredExtensions,
            filteredExtensions,
            getCategoryName,
            formatPrice,
            installExtension
        };
    }
};
</script>

<style scoped>
.pb-1\/2 {
    padding-bottom: 50%;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2; /* Ajout de la propriété standard pour la compatibilité */
}
</style>
