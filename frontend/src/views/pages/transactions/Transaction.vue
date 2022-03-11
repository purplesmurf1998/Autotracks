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
        <dealership-dropdown
          :dealership="selectedDealership"
          @selectDealership="selectedDealership = $event"
          :showMessage="showMessage"
        />
        <transaction-table
          v-if="selectedDealership || $store.state.auth.role != 'Administration'"
          :dealership="selectedDealership ? selectedDealership : $store.state.auth.dealership"
          :showMessage="showMessage"
          ref="transactionTable"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
const axios = require("axios");
import TransactionTable from "./TransactionTable.vue";
import dealershipDD from "../inventory/DealershipDropdown.vue";

export default {
  name: "Transaction",
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
    "transaction-table": TransactionTable,
    "dealership-dropdown": dealershipDD,
  },
};
</script>