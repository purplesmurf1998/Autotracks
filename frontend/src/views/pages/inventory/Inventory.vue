<template>
  <div class="inventory-div">
    <CRow>
      <CCol>
        <CAlert
          :color="messageObj.messageType"
          v-if="messageObj.content"
          class="mb-2">
          {{ messageObj.content }}
        </CAlert>
        <CRow class="m-0 mb-3 d-flex justify-content-between" v-if="userHasRoles('Administration')">
          <router-link :to="`/inventory/add/${selectedDealership}`" v-if="!!selectedDealership">
            <CButton color="primary" id="add-new-vehicle">
              Add vehicle(s) to the inventory
            </CButton>
          </router-link>
        </CRow>
        <CRow class="m-0 mb-3 d-flex justify-content-between" v-if="userHasRoles('Management', 'Reception')">
          <router-link :to="`/inventory/add/${$store.state.auth.dealership}`">
            <CButton color="primary" id="add-new-vehicle">
              Add vehicle(s) to the inventory
            </CButton>
          </router-link>
        </CRow>
        <CAlert color="info" v-if="!selectedDealership && userHasRoles('Administration')">Select a dealership or <strong><router-link to="/dealerships">create one</router-link></strong> before adding/viewing the inventory</CAlert>
        <dealership-dropdown
          :dealership="selectedDealership"
          @selectDealership="selectedDealership = $event"
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
      :refreshTable="fetchVehicles"/>
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
const { containsRoles, message } = require("../../../utils/index");

import InventoryTable from "./InventoryTable.vue";
import dealershipDD from "./DealershipDropdown.vue";
import Vehicle from "../vehicle/Vehicle.vue"

export default {
  name: "Inventory",
  data() {
    return {
      selectedDealership: null,
      messageObj: message,
    };
  },
  computed: {
    viewVehicle() {
      return !!this.$route.query.vehicleSelected;
    }
  },
  methods: {
    userHasRoles(...roles) {
      return containsRoles(roles);
    },
    closeModal() {
      let queries = JSON.parse(JSON.stringify(this.$route.query));
      queries = {};
      this.$router.replace({query: queries});
    },
    fetchVehicles() {
      this.$refs.inventoryTable.fetchVehicles();
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
