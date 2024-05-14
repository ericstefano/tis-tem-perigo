<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const isInConfig = computed(() => route.name === 'config')
const isDarkMode = computed(() => colorMode.preference === 'dark')

async function handleGoToConfig() {
  await navigateTo(isInConfig.value ? '/' : '/config')
}

function toggleColorMode() {
  isDarkMode.value ? colorMode.preference = 'light' : colorMode.preference = 'dark'
}
</script>

<template>
  <div class="flex flex-col p-4 mx-auto min-h-screen max-w-screen-md">
    <header class="mb-8">
      <nav>
        <ul class="flex justify-end items-center gap-1">
          <li>
            <Button variant="ghost" size="icon" @click="toggleColorMode">
              <Icon size="1.25rem" :name="isDarkMode ? 'lucide:sun' : 'lucide:moon'" />
            </Button>
          </li>
          <li>
            <Button variant="ghost" size="icon" @click="handleGoToConfig">
              <Icon size="1.25rem" :name="isInConfig ? 'lucide:x' : 'lucide:settings-2'" />
            </Button>
          </li>
        </ul>
      </nav>
    </header>
    <main class="flex flex-1">
      <slot />
    </main>
  </div>
</template>
