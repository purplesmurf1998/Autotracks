<template>
    <div>
        <CRow class="m-0 mb-2 d-flex justify-content-between">
            <CButton
                color="secondary"
                id="set-dealership-default"
                v-if="
                !!dealership_prop &&
                (!$store.state.auth.dealership || $store.state.auth.dealership != dealership_prop) &&
                showSetDefault
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
                :value.sync="dealership_prop"
                placeholder="Select a dealership to view their inventory"
                @change="dealershipSelected($router.app._route.fullPath, $event)"
            />
    </div>
</template>

<script>
const axios = require("axios");
const { showMessage } = require("../../../utils/index");

export default {
  name: "DealershipDropdown",
  props: ["dealership", "showSetDefault", "messageObj"],
  data() {
    return {
      adminDealerships: [],
      defaultAdminDealership: null,
      dealership_prop: this.dealership,
    };
  },
  methods: {
    dealershipSelected(current_url, selected_val) {
        /*If this method called from the inventory page, call the switchDealerships method in the InventoryTable component
        * else this method is called from the dashbaord page and we should update visuals for the provided dealership_id
        */
        if (current_url.indexOf('inventory') > -1)
        {
            this.dealership_prop = selected_val.target.value
            //Propogate the selected dealershipID to the parent component (i.e. Inventory) via sending the selectDealership event
            this.$emit('selectDealership', this.dealership_prop);
            this.$parent.$refs.inventoryTable.switchDealerships(this.dealership_prop);
        }
        else if (current_url.indexOf('dashboard') > -1)
        {
            this.dealership_prop = selected_val.target.value
            //Propogate the selected dealershipID to the parent component (i.e. dashboard) via sending the selectDealership event
            this.$emit('selectDealership', this.dealership_prop);
            this.$parent.$refs.widgetDD.fetchVehiclesInInventory(this.dealership_prop);
            this.$parent.$refs.dlc.fetchSalesFromDealership(this.dealership_prop);
        }
        else if (current_url.indexOf('transactions') > -1) {
          this.dealership_prop = selected_val.target.value
          this.$emit('selectDealership', this.dealership_prop);
          this.$parent.$refs.transactionTable.fetchSales(this.dealership_prop);
        }
        else {
          this.dealership_prop = selected_val.target.value
          this.$emit('selectDealership', this.dealership_prop);
        }
    },
    setDefaultDealership() {
      // find the dealership's name
      const index = this.adminDealerships.findIndex(
        (dealership) => dealership.value == this.dealership_prop
      );
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/users/${this.$store.state.auth.userId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          dealership: this.dealership_prop,
        },
      })
        .then((_response) => {
          this.defaultAdminDealership = this.dealership_prop;
          this.$store.commit("setProperty", [
            "dealership",
            this.dealership_prop,
          ]);
          showMessage(`${this.adminDealerships[index].label} successfully set as your default dealership`, 'success', this.messageObj);
        })
        .catch((_error) => {
          showMessage(`An error occured while attempting to set ${this.adminDealerships[index].label} as your default dealership`, 'danger', this.messageObj);
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
  mounted() {
    /*
    Get the dealership being viewed. If the user is an administrator, offer a dropdown so they can select
    which dealership to view. If not an administrator, use the dealership associated to the account.
    */
    if (this.$store.state.auth.role != "Administration") {
      // administrators will have no dealership associated to their account
      // fetch the properties associated to the dealership
      this.dealership_prop = this.$store.state.auth.dealership;
    } else {
      // fetch the dealerships associated to the admin
      this.fetchAdminDealerships();

      //if the admin has a default dealership selected, show its inventory
      if (this.$store.state.auth.dealership) {
        this.dealership_prop = this.$store.state.auth.dealership;
        this.$emit('selectDealership', this.dealership_prop);
      }
    }
  },
};
</script>
