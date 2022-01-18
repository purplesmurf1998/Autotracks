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
      message: null,
      messageType: null
    };
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
    "inventory-table": InventoryTable,
    "dealership-dropdown": dealershipDD,
  },
};
</script>