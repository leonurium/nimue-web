<template>
  <div>
    <h1>Timeline {{ timeline_id }}</h1>
  </div>
</template>

<script lang="ts" setup>
  const {timeline_id} = useRoute().params
</script>

<style>

</style>