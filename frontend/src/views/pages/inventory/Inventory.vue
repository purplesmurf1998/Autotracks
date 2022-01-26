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
          <router-link :to="`/inventory/add/${selectedDealership}`">
            <CButton color="primary" id="add-new-vehicle">
              Add vehicle(s) to the inventory
            </CButton>
          </router-link>
        </CRow>
        <dealership-dropdown
          :dealership="selectedDealership"
          @selectDealership="selectedDealership = $event"
        />
        <inventory-table
          v-if="selectedDealership"
          :dealership="selectedDealership"
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
      <vehicle v-if="!!$route.query.vehicleSelected" :vehicleId="$route.query.vehicleSelected"/>
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
    showQueryParams() {
      console.log(this.$route.query);
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
  components: {
    "inventory-table": InventoryTable,
    "dealership-dropdown": dealershipDD,
    'vehicle': Vehicle
  },
};
</script>