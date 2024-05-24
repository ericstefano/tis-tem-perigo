export default defineEventHandler(async (event) => {
  const { latitude, longitude, key } = getQuery(event)

  const geocode = await $fetch('https://nominatim.openstreetmap.org/reverse', {
    key: 'geocode',
    retry: false,
    query: {
      lat: latitude,
      lon: longitude,
      format: 'jsonv2',
    },
  })

  const state = geocode.address.state
  const city = geocode.address.city ?? geocode.address.town ?? geocode.address.city_district ?? geocode.address.village

  const weather = await $fetch('https://api.openweathermap.org/data/2.5/weather', {
    key: 'weather',
    retry: false,
    query: {
      appid: key,
      lat: latitude,
      lon: longitude,
      units: 'metric',
    },
  })

  const alerts = await $fetch('https://apiprevmet3.inmet.gov.br/avisos/ativos', {
    key: 'alerts',
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

  const parsedAlerts = alerts.hoje.map(alert => ({ states: alert.estados.split(','), cities: alert.municipios.split(',').map(name => name.substring(0, name.indexOf('-') - 1)), severidade: alert.severidade, riscos: alert.riscos, descricao: alert.descricao, id: alert.id }))
  const alertsInLocation = parsedAlerts.filter(alert => alert.cities.includes(city) && alert.states.includes(state))

  return {
    state,
    city,
    alerts: alertsInLocation,
    alertsCount: alertsInLocation.length,
    temp: weather.main.temp,
  }
})
