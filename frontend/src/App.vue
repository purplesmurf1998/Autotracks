<template>
  <router-view></router-view>
</template>

<script>
export default {
<<<<<<< HEAD
  name: 'App',
  beforeCreate() {
    this.$store.dispatch('verify');
  }
=======
  name: 'App'
>>>>>>> 0d32b0b ([AP-54] Jenkins and Docker setup complete)
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
