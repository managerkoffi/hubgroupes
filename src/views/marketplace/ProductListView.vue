
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mes Produits</h1>
        <p class="mt-1 text-sm text-gray-600">Gérez les produits que vous vendez sur le marketplace</p>
      </div>
      <div>
        <router-link
          to="/marketplace/products/create"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ajouter un produit
        </router-link>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white shadow p-4 rounded-lg mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="w-full md:w-1/3 mb-4 md:mb-0">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher mes produits..."
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
            v-model="statusFilter"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des produits -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
      <p class="mt-1 text-sm text-gray-500">
        Vous n'avez pas encore ajouté de produits au marketplace.
      </p>
      <div class="mt-6">
        <router-link
          to="/marketplace/products/create"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ajouter un produit
        </router-link>
      </div>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="product in filteredProducts" :key="product.id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                  <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-indigo-600">
                    {{ product.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ getCategoryName(product.categoryId) }} | {{ formatPrice(product.price) }}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span 
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 
                    product.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                    'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ getStatusLabel(product.status) }}
                </span>
                <span class="text-sm text-gray-500">{{ product.sales }} ventes</span>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  {{ truncateDescription(product.description) }}
                </p>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <div class="flex space-x-2">
                  <router-link 
                    :to="`/marketplace/products/${product.id}`" 
                    class="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Voir
                  </router-link>
                  <router-link 
                    :to="`/marketplace/products/${product.id}/edit`" 
                    class="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Modifier
                  </router-link>
                  <button 
                    @click="confirmDelete(product)" 
                    class="text-red-600 hover:text-red-900 font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Supprimer le produit
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer "{{ productToDelete?.name }}" ? Cette action est irréversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="deleteProduct" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Supprimer
            </button>
            <button 
              type="button" 
              @click="showDeleteModal = false" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ProductListView',
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const searchQuery = ref('');
    const categoryFilter = ref('');
    const statusFilter = ref('');
    const products = ref([]);
    const categories = ref([]);
    const showDeleteModal = ref(false);
    const productToDelete = ref(null);

    const filteredProducts = computed(() => {
      let result = [...products.value];
      
      // Filtrer par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        );
      }
      
      // Filtrer par catégorie
      if (categoryFilter.value) {
        result = result.filter(product => product.categoryId === categoryFilter.value);
      }

      // Filtrer par statut
      if (statusFilter.value) {
        result = result.filter(product => product.status === statusFilter.value);
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
          { id: 'electronics', name: 'Électronique' },
          { id: 'clothing', name: 'Vêtements' },
          { id: 'books', name: 'Livres' },
          { id: 'home', name: 'Maison' },
          { id: 'sports', name: 'Sports' }
        ];
        
        // Données fictives pour les produits
        products.value = [
          {
            id: '1',
            name: 'Écouteurs Bluetooth',
            description: 'Écouteurs sans fil avec réduction de bruit active et autonomie de 20 heures.',
            image: 'https://via.placeholder.com/150?text=Headphones',
            price: 89.99,
            categoryId: 'electronics',
            status: 'active',
            sales: 24,
            createdAt: '2023-02-10T00:00:00Z'
          },
          {
            id: '2',
            name: 'T-shirt Premium',
            description: 'T-shirt en coton bio avec design exclusif.',
            image: 'https://via.placeholder.com/150?text=T-shirt',
            price: 29.99,
            categoryId: 'clothing',
            status: 'active',
            sales: 15,
            createdAt: '2023-01-15T00:00:00Z'
          },
          {
            id: '3',
            name: 'Guide de développement Vue.js',
            description: 'Apprenez à créer des applications web modernes avec Vue.js.',
            image: 'https://via.placeholder.com/150?text=Book',
            price: 39.99,
            categoryId: 'books',
            status: 'pending',
            sales: 0,
            createdAt: '2023-03-05T00:00:00Z'
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

    const getStatusLabel = (status) => {
      switch (status) {
        case 'active': return 'Actif';
        case 'inactive': return 'Inactif';
        case 'pending': return 'En attente';
        default: return status;
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
    };

    const truncateDescription = (description) => {
      return description.length > 100 ? description.substring(0, 100) + '...' : description;
    };

    const confirmDelete = (product) => {
      productToDelete.value = product;
      showDeleteModal.value = true;
    };

    const deleteProduct = async () => {
      try {
        // Simulation d'un appel API pour supprimer le produit
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Supprimer le produit de la liste locale
        products.value = products.value.filter(p => p.id !== productToDelete.value.id);
        
        // Fermer la modal
        showDeleteModal.value = false;
        productToDelete.value = null;
        
        // Afficher une notification (à implémenter)
        alert('Produit supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        alert('Erreur lors de la suppression du produit');
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      loading,
      searchQuery,
      categoryFilter,
      statusFilter,
      categories,
      products,
      filteredProducts,
      showDeleteModal,
      productToDelete,
      getCategoryName,
      getStatusLabel,
      formatPrice,
      truncateDescription,
      confirmDelete,
      deleteProduct
    };
  }
};
</script>