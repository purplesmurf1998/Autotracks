<template>
  <div>
    <!-- <CButton color="secondary" @click="$router.go(-1)" class="mb-2"
      >Go back to the inventory</CButton
    > -->
    <CModal
      :show.sync="viewVehicle"
      :centered="true"
      :closeOnBackdrop="false"
      title="Vehicle Information Page"
      size="xl"
    >
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
      <template #header>
        <h6 class="modal-title">Vehicle Information Page</h6>
        <CButtonClose @click="closeModal" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");

import Vehicle from "../../../modules/vehicles/Vehicle.vue";
import VehicleHistory from "../../../modules/vehicles/VehicleHistory.vue";

export default {
  props: ['vehicleId'],
  name: "Vehicle",
  data() {
    return {
      tab: 0,
      vehicle: null,
      viewVehicle: false
    };
  },
  components: {
    vehicle: Vehicle,
    "vehicle-history": VehicleHistory,
  },
  methods: {
    setTab(tab) {
      this.tab = tab;
    },
    closeModal() {
      this.$router.push('/inventory');
    },
    setNewVehicle(newVehicle) {
      this.vehicle = newVehicle;
    },
    fetchVehicle() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/vehicle/${this.$route.params.vehicleId}`,
        //url: `${this.$store.state.api}/inventory/vehicle/${this.vehicleId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          this.vehicle = response.data.payload;
          this.viewVehicle = true;
        })
        .catch((error) => {
          console.log(error);
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