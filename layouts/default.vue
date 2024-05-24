<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const isConfigOpen = ref(false)
const colorMode = useColorMode()
const isDarkMode = computed(() => colorMode.preference === 'dark')
const weatherapikey = useStorage('weatherapikey', '')
function toggleColorMode() {
  isDarkMode.value ? colorMode.preference = 'light' : colorMode.preference = 'dark'
}
</script>

<template>
  <div class="flex flex-col p-4 mx-auto min-h-screen max-w-screen-md">
    <header class="mb-8">
      <nav>
        <ul class="flex justify-between items-center">
          <img src="../assets/images/logo.jpeg" class="rounded-full h-12 w-12">
          <div class="flex items-center gap-1">
            <li>
              <Button variant="ghost" size="icon" @click="toggleColorMode">
                <Icon size="1.25rem" :name="isDarkMode ? 'lucide:sun' : 'lucide:moon'" />
              </Button>
            </li>
            <li>
              <Sheet :open="isConfigOpen" @update:open="isConfigOpen = !isConfigOpen">
                <SheetTrigger :as-child="true">
                  <Button variant="ghost" size="icon">
                    <Icon size="1.25rem" :name="isConfigOpen ? 'lucide:x' : 'lucide:settings-2' " />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <h1 class="text-3xl font-bold mb-8">
                    Configurações
                  </h1>
                  <div>
                    <p class="text-2xl mb-2">
                      Gerais
                    </p>
                    <div class="gap-2 flex flex-col">
                      <Label>Chave da WeatherAPI</Label>
                      <PasswordInput v-model="weatherapikey" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </li>
          </div>
        </ul>
      </nav>
    </header>
    <main class="flex flex-1">
      <slot />
    </main>
    <Toaster />
  </div>
</template>
