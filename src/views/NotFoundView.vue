<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 text-center">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    404
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Page non trouvée
                </p>
            </div>
            <div class="mt-8">
                <svg class="mx-auto h-24 w-24 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="mt-4 text-lg text-gray-700">
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <div class="mt-6">
                    <RouterLink to="/" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Retour à l'accueil
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFoundView'
}
</script>
