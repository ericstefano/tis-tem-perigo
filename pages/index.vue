<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { toast } from 'vue-sonner'

function reloadPage() {
  window.location.reload()
}
const geolocation = useGeolocation({ enableHighAccuracy: true })
const weatherapikey = useStorage('weatherapikey', '')
const data = ref(null)

async function fetchAlerts({ key, longitude, latitude }: { key: string, longitude: string | number, latitude: string | number }) {
  return $fetch('/api/alerts', {
    params: {
      key,
      latitude,
      longitude,
    },
    onRequestError({ error }) {
      toast.error(`Falha ao requisitar a API.\n${error.message}`)
    },
    onResponseError({ response }) {
      toast.error(`Falha ao requisitar a API.\n${response._data.message}`)
    },
    retry: false,
  })
}

watch(geolocation.coords, async () => {
  if (geolocation.coords.value.accuracy) {
    geolocation.pause()
    data.value = await fetchAlerts({ latitude: geolocation.coords.value.latitude, longitude: geolocation.coords.value.longitude, key: weatherapikey.value })
  }
})
</script>

<template>
  <div v-if="!geolocation.error.value && weatherapikey" class="flex flex-col gap-8 justify-between w-full">
    <h1 v-if="!!data" class="text-center text-2xl leading-tightest">
      {{ data?.city }}, {{ data?.state }}
      <br>
      {{ data?.temp }} °C
    </h1>

    <div v-else class="flex flex-col justify-center items-center gap-2">
      <Skeleton class="h-8 w-32 " />
      <Skeleton class="h-8 w-16 " />
    </div>

    <Skeleton v-if="!data" class="h-10 max-w-sm w-full mx-auto " />

    <h2 v-else-if="!data?.alertsCount" class="text-center font-bold text-4xl">
      Nenhum alerta na sua região
    </h2>

    <h2 v-else class="text-center font-bold text-4xl">
      {{ data?.alertsCount }} alerta(s) na sua região
    </h2>

    <Sheet>
      <SheetTrigger :as-child="true">
        <Button class="w-full sm:w-80 mx-auto text-xl" :disabled="!data?.alertsCount">
          Ver alertas
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" :close="false" class="max-w-screen-sm m-auto border-r border-l rounded-md">
        <div class="flex flex-col gap-4 justify-between w-full">
          <Card
            v-for="alert in data?.alerts" :key="alert.id" class="py-1 px-4 text-lg text-background truncate"
            :class="{
              'bg-yellow-600': alert.severidade.toLowerCase().trim() === 'perigo potencial',
              'bg-orange-600': alert.severidade.toLowerCase().trim() === 'perigo',
              'bg-red-600': alert.severidade.toLowerCase().trim() === 'grande perigo',
            }"
          >
            {{ alert.severidade }} - {{ alert.descricao }}
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  </div>
  <div v-else-if="!weatherapikey" class="flex flex-col gap-4 items-center justify-center w-full">
    <h1 class="text-4xl text-center">
      Por favor, insira sua chave de API na seção de Configurações
    </h1>
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
