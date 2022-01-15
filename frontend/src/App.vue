<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
  beforeCreate() {
    this.$store.dispatch("verify");
  },
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "assets/scss/style";
</style>
