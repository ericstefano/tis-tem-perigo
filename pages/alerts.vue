<script setup lang="ts">
async function goToResume() {
  await navigateTo('/')
}
</script>

<template>
  <div class="flex flex-col gap-8 justify-between w-full">
    <Card class="p-3 text-lg">
      Nenhum alerta no momento
    </Card>
    <Button class="w-full sm:w-80 mx-auto text-xl" @click="goToResume">
      Ver resumo
    </Button>
  </div>
</template>
