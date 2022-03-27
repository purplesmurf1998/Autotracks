<template>
  <div>
    <CRow>
      <CCol>
        <CAlert  
          :color="messageObj.messageType" 
          v-if="messageObj.content" 
          class="mb-2">
          {{ messageObj.content }}
        </CAlert>
        <dealership-dropdown
          :dealership="selectedDealership"
          @selectDealership="selectedDealership = $event"
        />
        <transaction-table
          v-if="selectedDealership || $store.state.auth.role != 'Administration'"
          :dealership="selectedDealership ? selectedDealership : $store.state.auth.dealership"
          ref="transactionTable"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
const axios = require("axios");
const { message } = require("../../../utils/index");
import TransactionTable from "./TransactionTable.vue";
import dealershipDD from "../inventory/DealershipDropdown.vue";

export default {
  name: "Transaction",
  data() {
    return {
      selectedDealership: null,
      messageObj: message,
    };
  },
  components: {
    "transaction-table": TransactionTable,
    "dealership-dropdown": dealershipDD,
  },
};
</script>