<template>
  <div>
    <CCard v-if="tableFields.length > 0">
      <CCardHeader>
        <slot name="header">List of Transactions</slot>
        <!-- Download button below -->
        <CButton 
        @click="downloadTransactions"
        color="primary" class="float-right">
          <CIcon name="cil-cloud-download" />
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          id="transactions-datatable"
          :fields="tableFields"
          :items="tableItems"
          :items-per-page="10"
          :fixed="true"
          :clickable-rows="true"
          @row-clicked="rowClicked"
          size="sm"
          hover
          sorter
          column-filter
        >
          <!-- <template v-for="field in tableFields" v-slot:[field.key]="item">
            <inventory-slot :key="field.key" :item="item" :field="field"/>
          </template> -->
          <!-- <template #missing="{ item }">
            <td>
              <CIcon name="cil-warning" class="icon" v-if="item.missing" />
            </td>
          </template> -->
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "transactionTable",
  props: ["dealership"],
  data() {
    return {
      tableFields: ["test1", "test2"],
      tableItems: [{"test1" : 1, "test2" : 2}, {"test1" : 3, "test2" : 4}, {"test2" : 3}, {"test2" : 4}],
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
    rowClicked() {
        console.log("Render Sales Modal");
    },
    downloadTransactions(){
        console.log("Download transactions");
    },
  },
  components: {
  },
};
</script>