<script setup lang="ts">
import { useStorage } from '@vueuse/core'

async function goToAlerts() {
  await navigateTo('/alerts')
}

function reloadPage() {
  window.location.reload()
}

const geolocation = useGeolocation({ enableHighAccuracy: true })
const longitude = computed(() => geolocation.coords.value.longitude)
const latitude = computed(() => geolocation.coords.value.latitude)
const openweatherkey = useStorage('openweatherkey', '')
const { data } = useFetch<any>('https://api.openweathermap.org/data/2.5/weather', {
  key: 'weather',
  immediate: false,
  query: {
    lon: longitude,
    lat: latitude,
    appid: openweatherkey,
    units: 'metric',
  },
  transform(input) {
    return { ...input, fetchedAt: new Date() }
  },
  getCachedData(key, nuxtApp) {
    return nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key]
  },
})

const location = computed(() => data.value?.name)
const climate = computed(() => data.value?.main.temp.toFixed(1))
</script>

<template>
  <div v-if="!geolocation.error.value" class="flex flex-col gap-8 justify-between w-full">
    <h1 v-if="location && climate" class="text-center text-2xl">
      {{ location }}
      <br>
      {{ climate }} °C
    </h1>
    <div v-else class="flex flex-col justify-center items-center gap-2">
      <Skeleton class="h-8 w-32 " />
      <Skeleton class="h-8 w-16 " />
    </div>

    <h2 v-if="location && climate" class="text-center font-bold text-4xl">
      Nenhum alerta na sua região
    </h2>

    <Skeleton v-else class="h-10 max-w-sm w-full mx-auto " />
    <Button class="w-full sm:w-80 mx-auto text-xl" @click="goToAlerts">
      Ver alertas
    </Button>
  </div>
  <div v-else class="flex flex-col gap-4 items-center justify-center w-full">
    <h1 class="text-4xl text-center">
      Por favor, habilite sua localização para utilizar o
      <br>
      Tem Perigo!?
    </h1>
    <Button variant="secondary" size="lg" class="text-xl" @click="reloadPage">
      Recarregar
    </Button>
  </div>
</template>
