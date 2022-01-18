<template>
  <div>
    <CRow>
      <CCol>
        <CAlert 
          show
          @showMessage="showMessage($event)" 
          :color="MessageType" 
          v-if="Message" 
          class="mb-2">
          {{ Message }}
        </CAlert>
        <CRow class="m-0 mb-3 d-flex justify-content-between">
          <router-link :to="`/inventory/add/${selectedDealership}`">
            <CButton color="primary" id="add-new-vehicle">
              Add vehicle(s) to the inventory
            </CButton>
          </router-link>
        </CRow>
        <dealership-dropdown
          :dealership="selectedDealership"
          @selectDealership="selectedDealership = $event"
          :showMessage="showMessage"
        />
        <inventory-table
          v-if="selectedDealership"
          :dealership="selectedDealership"
          ref="inventoryTable"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
const axios = require("axios");
import InventoryTable from "./InventoryTable.vue";
import dealershipDD from "./DealershipDropdown.vue";

export default {
  name: "Inventory",
  data() {
    return {
      selectedDealership: null,
      Message: null,
      MessageType: null
    };
  },
  methods: {
    showMessage(message, messageType) {
      this.Message = message;
      this.MessageType = messageType;
      setTimeout(() => {
          this.Message = null;
          this.MessageType = null;
      }, 5000);
    },
  },
  components: {
    "inventory-table": InventoryTable,
    "dealership-dropdown": dealershipDD,
  },
};
</script>