<template>
  <div>
    <CAlert :color="messageType" v-if="!!message">{{ message }}</CAlert>
    <CRow>
      <CCol xl="6">
        <vehicle-details :vehicle="vehicle" :setNewVehicle="setNewVehicle" :showMessage="showMessage"/>
        <vehicle-properties :vehicle="vehicle" :setNewVehicle="setNewVehicle"/>
      </CCol>
      <CCol xl="6">
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
  name: 'Vehicle',
  props: ["vehicle", "setNewVehicle"],
  data() {
    return {
      message: null,
      messageType: null,
    }
  },
  methods: {
    showMessage(message, messageType) {
      this.message = message;
      this.messageType = messageType;
      setTimeout(() => {
          this.message = null;
          this.messageType = null;
      }, 5000);
    },
  },
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