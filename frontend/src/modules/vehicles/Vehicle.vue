<template>
  <div>
    <CAlert :color="messageObj.messageType" v-if="!!messageObj.content">{{ messageObj.content }}</CAlert>
    <CRow>
      <CCol xl="6">
        <vehicle-details
          :vehicle="vehicle"
          :setNewVehicle="setNewVehicle"
          :refreshTable="refreshTable"
          :messageObj="messageObj"
        />
        <vehicle-properties :vehicle="vehicle" :setNewVehicle="setNewVehicle" />
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
  props: ["vehicle", "setNewVehicle", "refreshTable"],
  data() {
    return {
      messageObj: {
        content: null,
        messageType: null,
      }
    };
  },
  components: {
    "vehicle-details": VehicleDetails,
    "vehicle-location": VehicleLocation,
    "vehicle-properties": VehicleProperties,
    "vehicle-comments": VehicleComments,
  },
};
</script>

<style>
</style>