<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h2 class="text-lg font-medium text-gray-900">Créer une nouvelle cotisation</h2>
      <p class="mt-1 text-sm text-gray-500">Définissez les détails de la nouvelle cotisation</p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
      <form @submit.prevent="createContribution">
        <div class="space-y-6">
          <!-- Nom de la cotisation -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom de la cotisation</label>
            <div class="mt-1">
              <input type="text" id="name" v-model="form.name" required
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <div class="mt-1">
              <textarea id="description" v-model="form.description" rows="3"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
            </div>
            <p class="mt-2 text-sm text-gray-500">Brève description de la cotisation et de son objectif.</p>
          </div>

          <!-- Montant -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
            <div class="mt-1">
              <input type="number" id="amount" v-model="form.amount" min="0" required
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>

          <!-- Date d'échéance -->
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700">Date d'échéance</label>
            <div class="mt-1">
              <input type="date" id="dueDate" v-model="form.dueDate" required
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>

          <!-- Type de cotisation -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">Type de cotisation</label>
            <div class="mt-1">
              <select id="type" v-model="form.type" required
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="one-time">Unique</option>
                <option value="monthly">Mensuelle</option>
                <option value="quarterly">Trimestrielle</option>
                <option value="annual">Annuelle</option>
              </select>
            </div>
          </div>

          <!-- Membres concernés -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Membres concernés</label>
            <div class="mt-1">
              <div class="relative flex items-start">
                <div class="flex items-center h-5">
                  <input id="all-members" v-model="form.allMembers" type="checkbox"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                </div>
                <div class="ml-3 text-sm">
                  <label for="all-members" class="font-medium text-gray-700">Tous les membres</label>
                  <p class="text-gray-500">Cette cotisation s'applique à tous les membres du groupe.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sélection des membres spécifiques si tous les membres n'est pas coché -->
          <div v-if="!form.allMembers">
            <label class="block text-sm font-medium text-gray-700">Sélectionner les membres</label>
            <div class="mt-1 border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
              <div v-for="member in members" :key="member.id" class="relative flex items-start py-2">
                <div class="flex items-center h-5">
                  <input :id="`member-${member.id}`" v-model="form.selectedMembers" :value="member.id" type="checkbox"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                </div>
                <div class="ml-3 text-sm">
                  <label :for="`member-${member.id}`" class="font-medium text-gray-700">{{ member.name }}</label>
                </div>
              </div>
              <div v-if="members.length === 0" class="py-2 text-sm text-gray-500 text-center">
                Aucun membre disponible
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3">
            <button type="button" @click="$router.push('/contributions')"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Annuler
            </button>
            <button type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Créer la cotisation
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Formulaire
const form = ref({
  name: '',
  description: '',
  amount: 0,
  dueDate: '',
  type: 'one-time',
  allMembers: true,
  selectedMembers: []
});

// Liste des membres (simulation)
const members = ref([]);

// Chargement des membres
onMounted(() => {
  // Simuler le chargement des membres depuis une API
  setTimeout(() => {
    members.value = [
      { id: 1, name: 'Jean Dupont' },
      { id: 2, name: 'Marie Martin' },
      { id: 3, name: 'Pierre Durand' },
      { id: 4, name: 'Sophie Lefebvre' },
      { id: 5, name: 'Thomas Moreau' }
    ];
  }, 500);
});

// Création d'une cotisation
function createContribution() {
  // Vérification des membres sélectionnés
  if (!form.value.allMembers && form.value.selectedMembers.length === 0) {
    alert('Veuillez sélectionner au moins un membre');
    return;
  }

  // Simuler l'envoi des données à une API
  console.log('Création de la cotisation:', form.value);
  
  // Redirection vers la liste des cotisations
  setTimeout(() => {
    alert('Cotisation créée avec succès !');
    router.push('/contributions');
  }, 1000);
}
</script>
