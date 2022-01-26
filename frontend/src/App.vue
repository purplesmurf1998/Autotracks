<template>
  <router-view></router-view>
</template>

<script>
const { io } = require("socket.io-client");

export default {
  name: "App",
  data() {
    return {
      socket: null
    };
  },
  beforeCreate() {
    this.$store.dispatch("verify");
  },
  created() {
    const socket = io("http://localhost:5000");

    socket.on("connected", (arg) => {
      console.log(arg);
    });

    this.$store.commit('setSocket', {socket});
  },
  beforeUnmount() {
    this.socket.disconnect();
  }
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "assets/scss/style";
</style>
