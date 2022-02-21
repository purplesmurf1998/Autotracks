<template>
  <div class="inventory-div">
    <CRow>
      <CCol>
        <CAlert
          show
          @showMessage="showMessage($event)"
          :color="messageType"
          v-if="message"
          class="mb-2">
          {{ message }}
        </CAlert>
        <CRow class="m-0 mb-3 d-flex justify-content-between">
          <router-link :to="`/inventory/add/${selectedDealership}`" v-if="!!selectedDealership">
            <CButton color="primary" id="add-new-vehicle">
              Add vehicle(s) to the inventory
            </CButton>
          </router-link>
        </CRow>
        <CAlert color="info" v-if="!selectedDealership && $store.state.auth.role == 'Administration'">Select a dealership or <strong><router-link to="/dealerships">create one</router-link></strong> before adding/viewing the inventory</CAlert>
        <dealership-dropdown
          :dealership="selectedDealership"
          @selectDealership="selectedDealership = $event"
          :showMessage="showMessage"
          :showSetDefault="true"
        />
        <inventory-table
          v-if="selectedDealership || $store.state.auth.role != 'Administration'"
          :dealership="selectedDealership ? selectedDealership : $store.state.auth.dealership"
          ref="inventoryTable"
        />
      </CCol>
    </CRow>
    <CModal
      :show.sync="viewVehicle"
      :centered="false"
      title="Vehicle Information Page"
      size="xl"
    >
      <vehicle v-if="!!$route.query.vehicleSelected" 
      :vehicleId="$route.query.vehicleSelected" 
      :refreshTable="$refs.inventoryTable.fetchVehicles"/>
      <template #header>
        <h6 class="modal-title">Vehicle Information Page</h6>
        <CButtonClose @click="closeModal" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");
import InventoryTable from "./InventoryTable.vue";
import dealershipDD from "./DealershipDropdown.vue";
import Vehicle from "../vehicle/Vehicle.vue"

export default {
  name: "Inventory",
  data() {
    return {
      selectedDealership: null,
      message: null,
      messageType: null
    };
  },
  computed: {
    viewVehicle() {
      return !!this.$route.query.vehicleSelected;
    }
  },
  methods: {
    closeModal() {
      let queries = JSON.parse(JSON.stringify(this.$route.query));
      queries = {};
      this.$router.replace({query: queries});
    },
    showMessage(message, messageType) {
      this.message = message;
      this.messageType = messageType;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
      }, 5000)
    },
  },
  mounted() {
    var vehicle_id = localStorage.getItem('vehicle')
    if (vehicle_id) {
      this.$router.push("/inventory?vehicleSelected=" + vehicle_id);
      localStorage.removeItem('vehicle');
    }
  },
  components: {
    "inventory-table": InventoryTable,
    "dealership-dropdown": dealershipDD,
    'vehicle': Vehicle
  },
};
</script>
