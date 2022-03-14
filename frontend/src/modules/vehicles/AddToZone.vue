<template>
  <div>
    <CCol>
      <!-- <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert> -->
      <CSelect
        v-if="zones"
        :value.sync="selectedIndex"
        placeholder="Select a zone"
        :options="options"
      />
      <CRow class="d-flex justify-content-center">
        <CButton color="primary" class="mr-2" @click="addVehicleToZone"
          >Add</CButton
        >
        <CButton color="danger" @click="closeAddToZoneModal">Cancel</CButton>
      </CRow>
    </CCol>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["vehicleId", "closeAddToZoneModal"],
  data() {
    return {
      zones: [],
      options: [],
      selectedIndex: -1,
    };
  },
  methods: {
    addVehicleToZone() {
      const zone = this.zones[this.selectedIndex];

      const data = {
        lat: zone.center.lat,
        lng: zone.center.lng,
        zone: zone._id,
      };

      axios({
        method: "PUT",
        url: `${this.$store.state.api}/inventory/vehicle/${this.vehicleId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data,
      })
        .then((response) => {
          this.$emit("vehicle-location-updated", response.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchLocationZones() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/locations/zones/dealership/${this.$store.state.auth.dealership}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          this.zones = response.data.payload;
          let options = [];
          this.zones.forEach((zone, index) => {
            options.push({
              value: index,
              label: zone.name,
            });
          });
          this.options = options;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchLocationZones();
  },
};
</script>

<style>
</style>