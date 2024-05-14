<script lang="ts" setup>
import { useStorage } from '@vueuse/core'

const openweatherkey = useStorage('openweatherkey', '')
</script>

<template>
  <div class="flex flex-col w-full gap-8">
    <h1 class="text-3xl font-bold">
      Configurações
    </h1>
    <div>
      <p class="text-2xl mb-2">
        Gerais
      </p>
      <div class="gap-2 flex flex-col">
        <Label>Chave da OpenWeatherAPI</Label>
        <PasswordInput v-model="openweatherkey" />
      </div>
    </div>
    <div>
      <p class="text-2xl mb-2">
        Alertas
      </p>
      <div class="space-y-3">
        <div class="gap-2 flex items-center">
          <Switch />
          <Label>Tempestades</Label>
        </div>
        <div class="gap-2 flex items-center">
          <Switch />
          <Label>Terremotos</Label>
        </div>
      </div>
    </div>
  </div>
</template>
