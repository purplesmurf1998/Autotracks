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
    <CModal
      :show.sync="showingTransactionModal"
      :centered="true"
      title="Modal title 2"
      size="lg"
    >
      <transaction-detail 
        v-if="showingTransactionModal"
        :setTransactionModal="setTransactionModal"
        :saleDetail="sale"
        :showMessage="showMessage"
        :setNewSale="setNewSale"
      />
      <template #header>
        <h6 class="modal-title">View Transaction Detail</h6>
        <CButtonClose @click="showingTransactionModal = false" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");
import transactionDetails from './TransactionDetails.vue';

export default {
  name: "transactionTable",
  props: ["dealership", "showMessage"],
  data() {
    return {
      tableFields: ["vin", "Sales Rep", "Request Date", "Delivery Status", "Deposit", "Approved By", "Approval Date"],
      tableItems: [],
      showingTransactionModal: false,
      sale: null
    };
  },
  methods: {
    fetchSales(dealership) {
        axios({
            method: "GET",
            url: `${this.$store.state.api}/inventory/details/sale/dealership/${dealership}`,
            headers: {
                Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
        })
        .then((response) => {
          const payload = response.data.payload;
          const fields = [];
          payload.forEach((sale) => {
            //Format the data when fetched
            let items = {};
            items.id = sale._id;
            items["vin"] = sale.vehicle.vin;
            let rep_user_name = sale.sales_rep.first_name + ' ' + sale.sales_rep.last_name;
            items["Sales Rep"] = rep_user_name;
            let req_date = sale.date_of_sale.split('T')[0];
            items["Request Date"] = req_date;
            let delivery = sale.vehicle.delivered ? 'Delivered' : 'Not Delivered'
            items["Delivery Status"] = delivery;
            items["Deposit"] = '$' + sale.deposit_amount + '.00';
            let approved_by_user_name = !sale.approved_by ? 'Not approved' : sale.approved_by.first_name + ' ' + sale.approved_by.last_name;
            items["Approved By"] = approved_by_user_name;
            let approval_date = !sale.date_approved ? '-' : sale.date_approved.split('T')[0];
            items["Approval Date"] = approval_date
            fields.push(items);
          });
          this.tableItems = fields;
        })
        .catch((error) => {
          console.log(error);
          showMessage("An error occured while fetching transactions data", "danger");
        });
    },
    rowClicked(sale) {
      this.sale = sale;
      this.showingTransactionModal = true;
    },
    setNewSale(sale) {
      this.sale=sale;
    },
    setTransactionModal(value){
      this.showingTransactionModal = value;
    },
    downloadTransactions(){
      console.log("Download transactions");
    },
  },
  components: {
  },
  mounted() {
      this.fetchSales(this.dealership);
  },
  components: {
    "transaction-detail": transactionDetails,
  },
};
</script>