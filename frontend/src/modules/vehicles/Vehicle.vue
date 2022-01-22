<template>
  <div>
    <CRow>
      <CCol md="6">
        
        <vehicle-details :vehicle="vehicle" :setNewVehicle="setNewVehicle"/>
        <vehicle-properties :vehicle="vehicle" :setNewVehicle="setNewVehicle"/>
      </CCol>
      <CCol md="6">
        <vehicle-location :vehicle="vehicle" />
        <vehicle-comments :vehicle="vehicle" />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import VehicleDetails from "./VehicleDetails.vue";
import VehicleLocation from "./VehicleLocation.vue";
import VehicleProperties from "./VehicleProperties.vue";
import VehicleComments from "./VehicleComments.vue";

export default {
  props: ["vehicle", "setNewVehicle"],
  components: {
    "vehicle-details": VehicleDetails,
    "vehicle-location": VehicleLocation,
    "vehicle-properties": VehicleProperties,
    'vehicle-comments': VehicleComments
  },
};
</script>

<style>
</style>