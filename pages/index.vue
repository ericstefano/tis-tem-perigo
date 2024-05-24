<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { toast } from 'vue-sonner'

function reloadPage() {
  window.location.reload()
}

const alerts = useState('alerts')
const alertsInLocation = useState('alertsInLocation')
const hasAlerts = computed(() => alertsInLocation.value.length)
const location = useState('location')
const geolocation = useGeolocation({ enableHighAccuracy: true })
const weatherapikey = useStorage('weatherapikey', '')
const climate = ref('')

async function fetchWeather({ key, longitude, latitude }: { key: string, longitude: string | number, latitude: string | number }) {
  return $fetch('https://api.weatherapi.com/v1/forecast.json', {
    key: 'weather',
    retry: false,
    onRequestError({ error }) {
      toast.error(`Falha ao requisitar a WeatherAPI.\n${error.message}`)
    },
    onResponseError({ response }) {
      toast.error(`Falha ao requisitar a WeatherAPI.\n${response._data.message}`)
    },
    query: {
      alerts: 'yes',
      aqi: 'no',
      key,
      q: `${latitude},${longitude}`,
    },
  })
}

async function fetchGeocodeLocation({ latitude, longitude }: { latitude: string | number, longitude: string | number }) {
  return $fetch('https://nominatim.openstreetmap.org/reverse?lat=<value>&lon=<value>&<params>', {
    key: 'geocode',
    retry: false,
    query: {
      lat: latitude,
      lon: longitude,
      format: 'jsonv2',
    },
  })
}

async function fetchInmetAlerts() {
  return $fetch('https://apiprevmet3.inmet.gov.br/avisos/ativos', {
    method: 'GET',
    headers: {
      'Connection': 'keep-alive',
      'Origin': 'https://alertas2.inmet.gov.br',
      'Referer': 'https://alertas2.inmet.gov.br/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
    },
  })
}

watch(geolocation.coords, async () => {
  if (geolocation.coords.value.accuracy) {
    geolocation.pause()
    const geocode = await fetchGeocodeLocation({ latitude: geolocation.coords.value.latitude, longitude: geolocation.coords.value.longitude })
    location.value = { state: geocode.address.state, city: geocode.address.city ?? geocode.address.town ?? geocode.address.city_district ?? geocode.address.village }
    const inmet = await fetchInmetAlerts()
    alerts.value = inmet.hoje.map(alert => ({ states: alert.estados.split(','), cities: alert.municipios.split(',').map(name => name.substring(0, name.indexOf('-') - 1)), severidade: alert.severidade, riscos: alert.riscos, descricao: alert.descricao, id: alert.id }))
    alertsInLocation.value = alerts.value.filter(alert => alert.cities.includes(location.value.city) && alert.states.includes(location.value.state))
    const weather = await fetchWeather({ key: weatherapikey.value, latitude: geolocation.coords.value.latitude, longitude: geolocation.coords.value.longitude })
    climate.value = weather.current.temp_c
  }
})
</script>

<template>
  <div v-if="!geolocation.error.value" class="flex flex-col gap-8 justify-between w-full">
    <h1 v-if="location && climate" class="text-center text-2xl">
      {{ location.city }}, {{ location.state }}
      <br>
      {{ climate }} °C
    </h1>
    <div v-else class="flex flex-col justify-center items-center gap-2">
      <Skeleton class="h-8 w-32 " />
      <Skeleton class="h-8 w-16 " />
    </div>

    <Skeleton v-if="!alerts" class="h-10 max-w-sm w-full mx-auto " />

    <h2 v-else-if="!alertsInLocation?.length" class="text-center font-bold text-4xl">
      Nenhum alerta na sua região
    </h2>

    <h2 v-else class="text-center font-bold text-4xl">
      {{ alertsInLocation?.length }} alerta(s) na sua região
    </h2>

    <Sheet>
      <SheetTrigger :as-child="true">
        <Button class="w-full sm:w-80 mx-auto text-xl" :disabled="!alerts">
          Ver alertas
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" :close="false" class="max-w-screen-md m-auto border-r border-l rounded-md">
        <div class="flex flex-col gap-4 justify-between w-full">
          <Card v-if="!hasAlerts" class="p-3 text-lg">
            Nenhum alerta no momento
          </Card>
          <template v-else>
            <Card
              v-for="alert in alertsInLocation" :key="alert.id" class="p-3 text-xl text-background text-center" :class="{
                'bg-yellow-600': alert.severidade.toLowerCase().trim() === 'perigo potencial',
                'bg-orange-600': alert.severidade.toLowerCase().trim() === 'perigo',
                'bg-red-600': alert.severidade.toLowerCase().trim() === 'grande perigo',
              }"
            >
              {{ alert.severidade }} - {{ alert.descricao }}
            </Card>
          </template>
        </div>
      </SheetContent>
    </Sheet>
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
