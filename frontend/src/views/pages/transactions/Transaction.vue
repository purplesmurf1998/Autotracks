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
          :messageObj="messageObj"
          ref="transactionTable"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import TransactionTable from "./TransactionTable.vue";
import dealershipDD from "../inventory/DealershipDropdown.vue";

export default {
  name: "Transaction",
  data() {
    return {
      selectedDealership: null,
      messageObj: {
        content: null,
        messageType: null,
      },
    };
  },
  components: {
    "transaction-table": TransactionTable,
    "dealership-dropdown": dealershipDD,
  },
};
</script>