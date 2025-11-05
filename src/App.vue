<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from 'vue-router'
import { useBlogList } from "@/composables/blog/useBlogList";

const { loadAllPosts } = useBlogList()

onMounted(async () => {
  await loadAllPosts()
})

</script>

<template>
  <RouterView />
</template>

<style>


</style>

