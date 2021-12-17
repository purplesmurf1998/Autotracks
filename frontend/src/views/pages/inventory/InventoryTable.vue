<template>
  <div>
    <CCard v-if="tableFields.length > 0">
      <CCardHeader>
        <slot name="header">Inventory list of vehicles</slot>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :fields="tableFields"
          :items="tableItems"
          :striped="true"
          :items-per-page="10"
          :fixed="true"
          :clickable-rows="true"
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
    },
    fetchVehicleProperties() {
      console.log(this.dealership);
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
  },
  mounted() {
    this.fetchVehicleProperties();
  },
};
</script>