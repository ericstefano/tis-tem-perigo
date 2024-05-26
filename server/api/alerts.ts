export default defineEventHandler(async (event) => {
  const { latitude, longitude, key } = getQuery(event)
  const headers = getHeaders(event)
  console.log(headers)
  interface GeocodeResponse {
    address: {
      state: string
      city: string
      town: string
      city_district: string
      village: string
    }
  }

  const geocode = await $fetch<GeocodeResponse>('https://nominatim.openstreetmap.org/reverse', {
    query: {
      lat: latitude,
      lon: longitude,
      format: 'jsonv2',
    },
    headers: {
      'User-Agent': headers['User-Agent'],
      'referer': headers.referer,
    },
  })

  const state = geocode.address.state
  const city = geocode.address.city ?? geocode.address.town ?? geocode.address.city_district ?? geocode.address.village

  interface WeatherResponse {
    main: {
      temp: string | number
    }
  }

  const weather = await $fetch<WeatherResponse>('https://api.openweathermap.org/data/2.5/weather', {
    query: {
      appid: key,
      lat: latitude,
      lon: longitude,
      units: 'metric',
    },
  })

  interface Alert {
    estados: string
    municipios: string
    descricao: string
    riscos: string[]
    severidade: 'Perigo Potencial' | 'Perigo' | 'Grande Perigo'
    id: number | string
  }

  interface AlertsResponse {
    hoje: Alert[]
    amanha: Alert[]
  }

  const alerts = await $fetch<AlertsResponse>('https://apiprevmet3.inmet.gov.br/avisos/ativos', {
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

  const parsedAlerts = alerts.hoje.map(alert => ({ states: alert.estados.split(','), cities: alert.municipios.split(',').map(name => name.substring(0, name.indexOf('-') - 1)), severidade: alert.severidade, riscos: alert.riscos.at(0), descricao: alert.descricao, id: alert.id }))
  const alertsInLocation = parsedAlerts.filter(alert => alert.cities.includes(city) && alert.states.includes(state))

  return {
    state,
    city,
    alerts: alertsInLocation,
    alertsCount: alertsInLocation.length,
    temp: weather.main.temp,
  }
})
