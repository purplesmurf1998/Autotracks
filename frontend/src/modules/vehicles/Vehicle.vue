<template>
  <div>
    <CRow>
      <CCol>
        <vehicle-details :vehicle="vehicle" />
      </CCol>
      <CCol>
        <vehicle-location :vehicle="vehicle" />
      </CCol>
    </CRow>
    <vehicle-properties :vehicle="vehicle" />
  </div>
</template>

<script>
import VehicleDetails from "./VehicleDetails.vue";
import VehicleLocation from "./VehicleLocation.vue";
import VehicleProperties from "./VehicleProperties.vue";

export default {
  props: ["vehicle"],
  components: {
    "vehicle-details": VehicleDetails,
    "vehicle-location": VehicleLocation,
    "vehicle-properties": VehicleProperties,
  },
};
</script>

<style>
</style>