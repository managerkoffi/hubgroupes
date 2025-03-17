<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Modifier le produit' : 'Ajouter un produit' }}</h1>
      <p class="mt-1 text-sm text-gray-600">{{ isEditing ? 'Modifiez les informations de votre produit' : 'Remplissez le formulaire pour ajouter un nouveau produit au marketplace' }}</p>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <form @submit.prevent="saveProduct" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Informations de base -->
          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nom du produit *</label>
              <input
                type="text"
                id="name"
                v-model="product.name"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Catégorie *</label>
              <select
                id="category"
                v-model="product.categoryId"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>Sélectionnez une catégorie</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Prix (EUR) *</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  id="price"
                  v-model.number="product.price"
                  min="0"
                  step="0.01"
                  required
                  class="block w-full pl-7 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Statut *</label>
              <select
                id="status"
                v-model="product.status"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="pending">En attente</option>
              </select>
            </div>

            <div>
              <label for="image" class="block text-sm font-medium text-gray-700">Image URL *</label>
              <input
                type="url"
                id="image"
                v-model="product.image"
                required
                placeholder="https://example.com/image.jpg"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div v-if="product.image" class="mt-2">
              <p class="text-sm text-gray-500 mb-2">Aperçu de l'image :</p>
              <div class="w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                <img :src="product.image" alt="Aperçu du produit" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Description et détails -->
          <div class="space-y-6">
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                id="description"
                v-model="product.description"
                rows="4"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700">Stock disponible *</label>
              <input
                type="number"
                id="stock"
                v-model.number="product.stock"
                min="0"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="sku" class="block text-sm font-medium text-gray-700">Référence (SKU)</label>
              <input
                type="text"
                id="sku"
                v-model="product.sku"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="weight" class="block text-sm font-medium text-gray-700">Poids (kg)</label>
              <input
                type="number"
                id="weight"
                v-model.number="product.weight"
                min="0"
                step="0.01"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="dimensions" class="block text-sm font-medium text-gray-700">Dimensions (L x l x H cm)</label>
              <input
                type="text"
                id="dimensions"
                v-model="product.dimensions"
                placeholder="Ex: 20 x 15 x 5"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            @click="cancel"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ isEditing ? 'Mettre à jour' : 'Ajouter le produit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'ProductFormView',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const categories = ref([]);

    // Initialiser un produit vide
    const product = ref({
      id: '',
      name: '',
      description: '',
      image: '',
      price: 0,
      categoryId: '',
      status: 'active',
      stock: 1,
      sku: '',
      weight: null,
      dimensions: '',
      createdAt: new Date().toISOString()
    });

    // Déterminer si on est en mode édition
    const isEditing = computed(() => {
      return route.name === 'product-edit';
    });

    // Charger les catégories et le produit si en mode édition
    const fetchData = async () => {
      loading.value = true;
      try {
        // Simulation d'un appel API pour les catégories
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Données fictives pour les catégories
        categories.value = [
          { id: 'electronics', name: 'Électronique' },
          { id: 'clothing', name: 'Vêtements' },
          { id: 'books', name: 'Livres' },
          { id: 'home', name: 'Maison' },
          { id: 'sports', name: 'Sports' }
        ];
        
        // Si en mode édition, charger les données du produit
        if (isEditing.value && route.params.id) {
          await fetchProduct(route.params.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        loading.value = false;
      }
    };

    // Charger les données d'un produit spécifique
    const fetchProduct = async (productId) => {
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Données fictives pour le produit
        const productData = {
          id: productId,
          name: 'Écouteurs Bluetooth',
          description: 'Écouteurs sans fil avec réduction de bruit active et autonomie de 20 heures.',
          image: 'https://via.placeholder.com/150?text=Headphones',
          price: 89.99,
          categoryId: 'electronics',
          status: 'active',
          stock: 50,
          sku: 'BT-HEADPHONES-001',
          weight: 0.25,
          dimensions: '18 x 8 x 5',
          createdAt: '2023-02-10T00:00:00Z'
        };
        
        // Mettre à jour le produit local
        Object.assign(product.value, productData);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        alert('Erreur lors du chargement du produit');
        router.push('/marketplace/my-products');
      }
    };

    // Sauvegarder le produit
    const saveProduct = async () => {
      loading.value = true;
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Logique différente selon création ou édition
        if (isEditing.value) {
          console.log('Produit mis à jour:', product.value);
          alert('Produit mis à jour avec succès');
        } else {
          // Générer un ID pour un nouveau produit
          product.value.id = Date.now().toString();
          console.log('Nouveau produit créé:', product.value);
          alert('Produit ajouté avec succès');
        }
        
        // Rediriger vers la liste des produits
        router.push('/marketplace/my-products');
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du produit:', error);
        alert('Erreur lors de l\'enregistrement du produit');
      } finally {
        loading.value = false;
      }
    };

    // Annuler et retourner à la liste
    const cancel = () => {
      router.push('/marketplace/my-products');
    };

    onMounted(() => {
      fetchData();
    });

    return {
      product,
      categories,
      loading,
      isEditing,
      saveProduct,
      cancel
    };
  }
};
</script>