<template>
  <div>
    <CRow>
      <CCol>
        <CAlert 
          :color="messageType" 
          v-if="message" 
          class="mb-2">
          {{ message }}
        </CAlert>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <vehicle-details 
        :vehicle="vehicle" 
        :setNewVehicle="setNewVehicle"
        :showMessage="showMessage"
        />
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
  },
};
</script>

<style>
</style>