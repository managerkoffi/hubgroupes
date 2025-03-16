<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <div>
        <h2 class="text-lg font-medium text-gray-900">Cotisations</h2>
        <p class="mt-1 text-sm text-gray-500">Gérez vos cotisations et effectuez vos paiements</p>
      </div>
      <button @click="showPaymentModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Payer une cotisation
      </button>
    </div>

    <!-- Liste des cotisations -->
    <ul class="divide-y divide-gray-200">
      <li v-for="(contribution, index) in contributions" :key="index">
        <div class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="ml-3">
                <p class="text-sm font-medium text-indigo-600">{{ contribution.name }}</p>
                <p class="text-sm text-gray-500">{{ contribution.description }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(contribution.status)">
                {{ getStatusText(contribution.status) }}
              </p>
              <p class="ml-4 text-sm font-medium text-gray-900">{{ contribution.amount }} FCFA</p>
              <button v-if="contribution.status === 'pending'" @click="selectContribution(contribution)"
                class="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Payer
              </button>
            </div>
          </div>
          <div class="mt-2 sm:flex sm:justify-between">
            <div class="sm:flex">
              <p class="flex items-center text-sm text-gray-500">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd" />
                </svg>
                Échéance: {{ formatDate(contribution.dueDate) }}
              </p>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd" />
              </svg>
              <p v-if="contribution.paidAt">
                Payé le: {{ formatDate(contribution.paidAt) }}
              </p>
              <p v-else>
                Non payé
              </p>
            </div>
          </div>
        </div>
      </li>
      <li v-if="contributions.length === 0" class="px-4 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune cotisation</h3>
        <p class="mt-1 text-sm text-gray-500">
          Vous n'avez pas de cotisations à payer pour le moment.
        </p>
      </li>
    </ul>

    <!-- Modal de paiement -->
    <div v-if="showPaymentModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
          @click="showPaymentModal = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Paiement de cotisation
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Choisissez votre méthode de paiement préférée pour régler votre cotisation.
                </p>
                <div v-if="selectedContribution" class="mt-4 text-left">
                  <p class="font-medium">{{ selectedContribution.name }}</p>
                  <p class="text-gray-500">{{ selectedContribution.description }}</p>
                  <p class="font-bold mt-2">Montant: {{ selectedContribution.amount }} FCFA</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 sm:mt-6">
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Méthode de paiement</h4>

              <!-- Options de paiement -->
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(method, index) in paymentMethods" :key="index" @click="selectedPaymentMethod = method.id"
                  class="border rounded-md p-3 cursor-pointer"
                  :class="selectedPaymentMethod === method.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <img :src="method.icon" alt="Payment method icon" class="h-6 w-6 rounded">
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">{{ method.name }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Formulaire de carte de crédit -->
              <div v-if="selectedPaymentMethod === 'card'" class="space-y-3">
                <div>
                  <label for="card-number" class="block text-sm font-medium text-gray-700">Numéro de carte</label>
                  <input type="text" id="card-number"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="1234 5678 9012 3456">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="expiration" class="block text-sm font-medium text-gray-700">Date d'expiration</label>
                    <input type="text" id="expiration"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="MM/AA">
                  </div>
                  <div>
                    <label for="cvc" class="block text-sm font-medium text-gray-700">CVC</label>
                    <input type="text" id="cvc"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="123">
                  </div>
                </div>
              </div>

              <!-- Formulaire Mobile Money -->
              <div v-if="['orange', 'mtn', 'moov', 'wave'].includes(selectedPaymentMethod)" class="space-y-3">
                <div>
                  <label for="phone-number" class="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <input type="text" id="phone-number"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="+225 XX XX XX XX XX">
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <button type="button" @click="showPaymentModal = false"
                  class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Annuler
                </button>
                <button type="button" @click="processPayment"
                  class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Payer maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// État
const contributions = ref([]);
const showPaymentModal = ref(false);
const selectedContribution = ref(null);
const selectedPaymentMethod = ref('card');

// Méthodes de paiement disponibles
const paymentMethods = [
  { id: 'card', name: 'Carte bancaire', icon: '/src/assets/icons/credit-card.svg' },
  { id: 'orange', name: 'Orange Money', icon: '/src/assets/images/orange-money.png' },
  { id: 'mtn', name: 'MTN Money', icon: '/src/assets/images/mtn-money.jpg' },
  { id: 'moov', name: 'Moov Money', icon: '/src/assets/images/moov-money.jpg' },
  { id: 'wave', name: 'Wave', icon: '/src/assets/images/wave.png' },
];

// Chargement des données
onMounted(() => {
  // Simuler le chargement des données depuis une API
  setTimeout(() => {
    contributions.value = [
      {
        id: 1,
        name: 'Cotisation Annuelle 2025',
        description: 'Cotisation annuelle pour l\'adhésion au groupe',
        amount: 25000,
        status: 'pending',
        dueDate: '2025-04-30T00:00:00',
        paidAt: null
      },
      {
        id: 2,
        name: 'Cotisation Événement Spécial',
        description: 'Participation à l\'événement du 15 mai 2025',
        amount: 10000,
        status: 'pending',
        dueDate: '2025-05-01T00:00:00',
        paidAt: null
      },
      {
        id: 3,
        name: 'Cotisation Mensuelle - Mars 2025',
        description: 'Cotisation mensuelle régulière',
        amount: 5000,
        status: 'paid',
        dueDate: '2025-03-15T00:00:00',
        paidAt: '2025-03-14T10:23:45'
      }
    ];
  }, 500);
});

// Formatage de la date
function formatDate(dateString) {
  try {
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

// Classes CSS selon le statut
function getStatusClass(status) {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'late':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Texte selon le statut
function getStatusText(status) {
  switch (status) {
    case 'paid':
      return 'Payé';
    case 'pending':
      return 'En attente';
    case 'late':
      return 'En retard';
    default:
      return 'Inconnu';
  }
}

// Sélectionner une cotisation pour paiement
function selectContribution(contribution) {
  selectedContribution.value = contribution;
  showPaymentModal.value = true;
}

// Traiter le paiement
function processPayment() {
  if (!selectedContribution.value || !selectedPaymentMethod.value) {
    alert('Veuillez sélectionner une cotisation et une méthode de paiement');
    return;
  }

  // Simuler un traitement de paiement
  setTimeout(() => {
    // Mettre à jour la cotisation
    const index = contributions.value.findIndex(c => c.id === selectedContribution.value.id);
    if (index !== -1) {
      contributions.value[index].status = 'paid';
      contributions.value[index].paidAt = new Date().toISOString();
    }

    // Fermer la modal
    showPaymentModal.value = false;
    selectedContribution.value = null;

    // Afficher un message de succès
    alert('Paiement effectué avec succès !');
  }, 1500);
}
</script>
