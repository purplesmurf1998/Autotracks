<template>
  <div>
    <Carousels/>
    <Forms/>
  </div>
</template>

<script>
import Carousels from './base/Carousels'
import Forms from './forms/Forms'
export default {
  name: "TestPage",
  components: {
    Carousels,
    Forms
  }
}
</script>

<style scoped>

</style>
