<template>
  <div>
    <!-- <CButton color="secondary" @click="$router.go(-1)" class="mb-2"
      >Go back to the inventory</CButton
    > -->
    <CNav fill variant="pills" class="mb-3">
      <CNavItem :active="tab == 0" @click.native="setTab(0)">
        Vehicle
      </CNavItem>
      <CNavItem :active="tab == 1" @click.native="setTab(1)">
        History
      </CNavItem>
    </CNav>
    <hr />

    <vehicle v-if="tab == 0 && vehicle" :vehicle="vehicle" :setNewVehicle="setNewVehicle"/>
    <vehicle-history v-if="tab == 1 && vehicle" :vehicle="vehicle" />
  </div>
</template>

<script>
const axios = require("axios");

import Vehicle from "../../../modules/vehicles/Vehicle.vue";
import VehicleHistory from "../../../modules/vehicles/VehicleHistory.vue";

export default {
  name: "Vehicle",
  data() {
    return {
      tab: 0,
      vehicle: null,
    };
  },
  components: {
    vehicle: Vehicle,
    "vehicle-history": VehicleHistory,
  },
  methods: {
    setTab(tab) {
      console.log(tab);
      this.tab = tab;
    },
    setNewVehicle(newVehicle) {
      this.vehicle = newVehicle;
    },
    fetchVehicle() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/vehicle/${this.$route.params.vehicleId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.vehicle = response.data.payload;
          }
        })
        .catch((error) => {
          this.$router.replace("/pages/404");
        });
    },
  },
  mounted() {
    this.fetchVehicle();
  },
};
</script>

<style>
</style>