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
          :items-per-page="20"
          :fixed="true"
          :clickable-rows="true"
          @row-clicked="rowClicked"
          size="sm"
          hover
          sorter
          column-filter
          pagination
        >
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
        :setNewSale="setNewSale"
        :dealership="dealership"
        :fetchSales="fetchSales"
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
const { showMessage } = require("../../../utils/index");
import transactionDetails from './TransactionDetails.vue';
import XLSX from 'xlsx';

export default {
  name: "transactionTable",
  props: ["dealership"],
  data() {
    return {
      tableFields: ["vin", "Sales Rep", "Request Date", "Delivery Status", "Delivery Date", "Deposit", "Manager", "Approval Date"],
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
          var vehicle_id = localStorage.getItem('vehicle')
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
            items["Delivery Date"] = !sale.vehicle.date_delivered ? '-' : sale.vehicle.date_delivered.split('T')[0];
            items["Deposit"] = '$' + sale.deposit_amount + '.00';
            let approved_by_user_name = !sale.approved_by ? '-' : sale.approved_by.first_name + ' ' + sale.approved_by.last_name;
            items["Manager"] = approved_by_user_name;
            let approval_date = !sale.date_approved ? '-' : sale.date_approved.split('T')[0];
            items["Approval Date"] = approval_date
            //If a transaction notification clicked, check the vehicle storage if defined and render the transaction modal
            if (vehicle_id && vehicle_id == sale.vehicle._id) {
              this.rowClicked(items);
              localStorage.removeItem('vehicle');
            }
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
      let tableData = this.tableItems.map(item => {
        return {...item};
      });
      tableData.forEach((item) => {
        delete item['id'];
      })
      const data = XLSX.utils.json_to_sheet(tableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, 'data');
      XLSX.writeFile(wb,'transactions.xlsx');
    },
  },
  mounted() {
    this.fetchSales(this.dealership);
  },
  components: {
    "transaction-detail": transactionDetails,
  },
};
</script>