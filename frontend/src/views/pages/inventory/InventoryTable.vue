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
          @row-clicked="rowClicked"
          table-filter
          sorter
          size="sm"
          hover
        >
          <template #missing="{ item }">
            <td>
              <CIcon name="cil-warning" class="icon" v-if="item.missing" />
            </td>
          </template>
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
    rowClicked(vehicle) {
      this.$router.push(`/inventory/details/${vehicle._id}`);
    },
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
            const fields = [
              {
                key: "missing",
                label: "",
              },
            ];
            payload.forEach((property) => {
              if (property.visible) {
                fields.push(property);
              }
            });
            this.tableFields = fields;
            if (this.tableFields.length == 1) {
              this.tableItems = [];
            } else {
              this.fetchVehicles();
            }
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
              let properties = vehicle.properties;
              properties._id = vehicle._id;
              properties.missing = vehicle.missing;
              tableItems.push(properties);
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
  },
};
</script>

<style scoped>
#inventory-datatable {
  white-space: nowrap;
}
.icon {
  color: rgb(255, 106, 20);
}
.icon-td {
  display: flex;
  align-items: center;
  /* margin-top: -3%;
  padding-top: 20%; */
}
</style>