<template>
  <div>
    <CRow>
      <CCol>
        <vehicle-details :vehicle="vehicle" :setNewVehicle="setNewVehicle"/>
      </CCol>
      <CCol>
        <vehicle-location :vehicle="vehicle" />
      </CCol>
    </CRow>
    <vehicle-properties :vehicle="vehicle" :setNewVehicle="setNewVehicle"/>
  </div>
</template>

<script>
import VehicleDetails from "./VehicleDetails.vue";
import VehicleLocation from "./VehicleLocation.vue";
import VehicleProperties from "./VehicleProperties.vue";

export default {
  name: 'Vehicle',
  props: ["vehicle", "setNewVehicle"],
  components: {
    "vehicle-details": VehicleDetails,
    "vehicle-location": VehicleLocation,
    "vehicle-properties": VehicleProperties,
  },
};
</script>

<style>
</style>