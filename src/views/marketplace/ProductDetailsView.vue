<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Détails du produit</h1>
        <p class="mt-1 text-sm text-gray-600">Informations complètes sur votre produit</p>
      </div>
      <div class="flex space-x-3">
        <router-link
          :to="`/marketplace/products/${product.id}/edit`"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Modifier
        </router-link>
        <router-link
          to="/marketplace/my-products"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retour à la liste
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Image du produit -->
        <div class="p-6">
          <div class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-center object-cover" />
          </div>
        </div>

        <!-- Informations principales -->
        <div class="p-6 md:col-span-2">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ product.name }}</h2>
              <p class="mt-1 text-sm text-gray-500">{{ getCategoryName(product.categoryId) }}</p>
            </div>
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
          </div>

          <div class="mt-4">
            <div class="text-3xl font-bold text-gray-900">{{ formatPrice(product.price) }}</div>
          </div>

          <div class="mt-6 border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900">Description</h3>
            <div class="mt-2 text-base text-gray-500">
              <p>{{ product.description }}</p>
            </div>
          </div>

          <div class="mt-6 border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900">Détails du produit</h3>
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Stock disponible</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ product.stock }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Référence (SKU)</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ product.sku || 'Non spécifié' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Poids</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ product.weight ? `${product.weight} kg` : 'Non spécifié' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Dimensions</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ product.dimensions || 'Non spécifié' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Date d'ajout</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(product.createdAt) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Ventes</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ product.sales || 0 }}</dd>
              </div>
            </div>
          </div>

          <div class="mt-6 border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900">Statistiques</h3>
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg text-center">
                <dt class="text-sm font-medium text-gray-500">Vues</dt>
                <dd class="mt-1 text-xl font-semibold text-gray-900">{{ product.views || 0 }}</dd>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg text-center">
                <dt class="text-sm font-medium text-gray-500">Ventes</dt>
                <dd class="mt-1 text-xl font-semibold text-gray-900">{{ product.sales || 0 }}</dd>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg text-center">
                <dt class="text-sm font-medium text-gray-500">Revenu</dt>
                <dd class="mt-1 text-xl font-semibold text-gray-900">{{ formatPrice(product.price * (product.sales || 0)) }}</dd>
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
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'ProductDetailsView',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(true);
    const product = ref({});
    const categories = ref([]);

    // Charger les données du produit
    const fetchData = async () => {
      loading.value = true;
      try {
        if (!route.params.id) {
          throw new Error('ID du produit manquant');
        }

        // Simulation d'un appel API pour les catégories
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Données fictives pour les catégories
        categories.value = [
          { id: 'electronics', name: 'Électronique' },
          { id: 'clothing', name: 'Vêtements' },
          { id: 'books', name: 'Livres' },
          { id: 'home', name: 'Maison' },
          { id: 'sports', name: 'Sports' }
        ];

        // Simulation d'un appel API pour le produit
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Données fictives pour le produit
        product.value = {
          id: route.params.id,
          name: 'Écouteurs Bluetooth',
          description: 'Écouteurs sans fil avec réduction de bruit active et autonomie de 20 heures. Profitez d\'un son de qualité supérieure et d\'un confort optimal pour toutes vos activités quotidiennes. Compatible avec tous les appareils Bluetooth.',
          image: 'https://via.placeholder.com/500x500?text=Headphones',
          price: 89.99,
          categoryId: 'electronics',
          status: 'active',
          stock: 50,
          sku: 'BT-HEADPHONES-001',
          weight: 0.25,
          dimensions: '18 x 8 x 5',
          createdAt: '2023-02-10T00:00:00Z',
          sales: 24,
          views: 356
        };
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        alert('Erreur lors du chargement du produit');
        router.push('/marketplace/my-products');
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

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    onMounted(() => {
      fetchData();
    });

    return {
      loading,
      product,
      getCategoryName,
      getStatusLabel,
      formatPrice,
      formatDate
    };
  }
};
</script>

<style scoped>
.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}

.aspect-h-1 {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
