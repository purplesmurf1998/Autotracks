<template>
  <div>
    <CCard v-if="tableFields.length > 0">
      <CCardHeader>
        <slot name="header">Inventory list of vehicles</slot>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          id="inventory-datatable"
          :fields="tableFields"
          :items="tableItems"
          :items-per-page="10"
          :fixed="true"
          :clickable-rows="true"
          table-filter
          sorter
          size="sm"
          hover
        >
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "InventoryTable",
  props: ["dealership"],
  data() {
    return {
      tableFields: [],
      tableItems: [],
    };
  },
  methods: {
    switchDealerships(dealership) {
      this.dealership = dealership;
      this.fetchVehicleProperties();
      this.fetchVehicles();
    },
    fetchVehicleProperties() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.dealership}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            const payload = response.data.payload;
            const fields = [];
            payload.forEach((property) => {
              if (property.visible) {
                property._style = "20%";
                fields.push(property);
              }
            });
            this.tableFields = fields;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchVehicles() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/dealership/${this.dealership}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            const payload = response.data.payload;
            let tableItems = [];
            payload.forEach((vehicle) => {
              tableItems.push(vehicle.properties);
            });
            this.tableItems = tableItems;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchVehicleProperties();
    this.fetchVehicles();
  },
};
</script>

<style scoped>
#inventory-datatable {
  white-space: nowrap;
}
</style>