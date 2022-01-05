<template>
  <div>
    <CRow>
      <CCol>
        <CAlert show :color="MessageType" v-if="Message" class="mb-2">
          {{ Message }}
        </CAlert>
        <CRow class="m-0 mb-3 d-flex justify-content-between">
          <router-link :to="`/inventory/add/${selectedDealership}`">
            <CButton color="primary" id="add-new-vehicle">
              Add vehicle(s) to the inventory
            </CButton>
          </router-link>
          <CButton
            color="secondary"
            id="set-dealership-default"
            v-if="
              !!selectedDealership &&
              (!$store.state.auth.dealership ||
                $store.state.auth.dealership != selectedDealership)
            "
            @click="setDefaultDealership"
          >
            Set selected dealership as default
          </CButton>
        </CRow>
        <CSelect
          v-if="$store.state.auth.role == 'Administration'"
          id="dealership-select-cmb"
          :options="adminDealerships"
          :value.sync="selectedDealership"
          placeholder="Select a dealership to view their inventory"
          @change="$refs.inventoryTable.switchDealerships(selectedDealership)"
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

export default {
  name: "Inventory",
  data() {
    return {
      tableItems: [],
      tableFields: [],
      adminDealerships: [],
      selectedDealership: null,
      defaultAdminDealership: null,
      Message: null,
      MessageType: null,
    };
  },
  methods: {
    showMessage(message) {
      this.Message = message;
      if (message.includes('error'))
        this.MessageType = 'danger';
      else
        this.MessageType = 'success';
      setTimeout(() => {
        this.Message = null;
        this.MessageType = null;
      }, 5000);
    },
    setDefaultDealership() {
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/users/${this.$store.state.auth.userId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          dealership: this.selectedDealership,
        },
      })
        .then((response) => {
          this.defaultAdminDealership = this.selectedDealership;
          this.$store.commit("setProperty", [
            "dealership",
            this.selectedDealership,
          ]);
          // find the dealership's name
          const index = this.adminDealerships.findIndex(
            (dealership) => dealership.value == this.selectedDealership
          );
          this.showMessage(
            `${this.adminDealerships[index].label} successfully set as your default dealership`
          );
        })
        .catch((error) => {
          this.showMessage(
              `An error occured while attempting to set ${this.adminDealerships[index].label} as your default dealership`
            );
        });
    },
    fetchAdminDealerships() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        params: {
          admin: this.$store.state.auth.userId,
        },
      })
        .then((response) => {
          if (response.data.success) {
            // convert the payload to a propery select array
            const payload = response.data.payload;
            const dealerships = [];
            payload.forEach((dealership) => {
              dealerships.push({
                value: dealership._id,
                label: dealership.name,
              });
            });
            this.adminDealerships = dealerships;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$router.replace("/pages/404");
        });
    },
  },
  components: {
    "inventory-table": InventoryTable,
  },
  mounted() {
    /* 
    Get the dealership being viewed. If the user is an administrator, offer a dropdown so they can select
    which dealership to view. If not an administrator, use the dealership associated to the account.
    */
    if (this.$store.state.auth.role != "Administration") {
      // administrators will have no dealership associated to their account
      // fetch the properties associated to the dealership
      this.selectedDealership = this.$store.state.auth.dealership;
    } else {
      // fetch the dealerships associated to the admin
      this.fetchAdminDealerships();

      //if the admin has a default dealership selected, show its inventory
      if (this.$store.state.auth.dealership) {
        this.selectedDealership = this.$store.state.auth.dealership;
      }
    }
  },
};
</script>