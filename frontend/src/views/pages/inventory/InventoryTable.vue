<template>
  <div>
    <CCard v-if="tableFields.length > 0">
      <CCardHeader>
        <slot name="header">Inventory list of vehicles</slot>
        <!-- Download button below -->
        <CButton @click="downloadInventory" color="primary" class="float-right">
          <CIcon name="cil-cloud-download" />
        </CButton>
        <CButton
          v-if="delivered_bool"
          @click="setDeliveredBool(false)"
          color="secondary"
          class="float-right mr-3"
        >
          Hide Delivered Vehicles
        </CButton>
        <CButton
          v-if="!delivered_bool"
          @click="setDeliveredBool(true)"
          color="secondary"
          class="float-right mr-3"
        >
          Show Delivered Vehicles
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :fields="tableFields"
          :items="tableItems"
          :items-per-page="20"
          :fixed="true"
          :clickable-rows="true"
          @row-clicked="rowClicked"
          sorter
          size="sm"
          hover
          column-filter
          pagination
        >
          <template v-for="field in tableFields" v-slot:[field.key]="item">
            <inventory-slot
              :key="field.key" 
              :item="item" 
              :field="field" 
            />
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script >
const axios = require("axios");
import InventorySlot from "./InventorySlot.vue";
import Vehicle from "../vehicle/Vehicle.vue";
import XLSX from "xlsx";

export default {
  name: "InventoryTable",
  props: ["dealership"],
  data() {
    return {
      tableFields: [],
      tableItems: [],
      delivered_bool: false,
      dealership_prop: this.dealership,
    };
  },
  methods: {
    downloadInventory() {
      let tableData = this.tableItems.map((item) => {
        return { ...item };
      });
      let formattedData = [];
      tableData.forEach((item) => {
        for (let i in item) {
          if (Array.isArray(item[i])) 
            item[i] = item[i].join(",");
          if (i == '_classes')
            delete item[i];
        }
        delete item["_id"];
        let vin = item["vin"];
        let newObj = Object.assign({ vin: vin }, item);
        formattedData.push(newObj);
      });
      const data = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "data");
      XLSX.writeFile(wb, "inventory.xlsx");
    },
    setDeliveredBool(value) {
      this.delivered_bool = value;
      this.fetchVehicleProperties();
    },
    rowClicked(vehicle) {
      let queries = JSON.parse(JSON.stringify(this.$route.query));
      queries.vehicleSelected = vehicle._id;
      this.$router.replace({ query: queries });
    },
    switchDealerships(dealership) {
      this.dealership_prop = dealership;
      this.fetchVehicleProperties();
      this.fetchVehicles();
    },
    fetchVehicleProperties() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.dealership_prop}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          const payload = response.data.payload;
          const fields = [];
          fields.push({ key: "vin", label: "VIN" });
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchVehicles() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/dealership/${this.dealership_prop}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          const payload = response.data.payload;
          let tableItems = [];
          payload.forEach((vehicle) => {
            //Check if vehicle has properties
            if (!this.delivered_bool) {
              if (!vehicle.delivered) {
                if (vehicle.properties != null) {
                  let properties = vehicle.properties;
                  properties._id = vehicle._id;
                  properties.vin = vehicle.vin;
                  if (vehicle.missing) {
                    properties._classes = "table-warning";
                  }
                  tableItems.push(properties);
                }
              }
            }
            if (this.delivered_bool) {
              if (vehicle.delivered) {
                if (vehicle.properties != null) {
                  let properties = vehicle.properties;
                  properties._id = vehicle._id;
                  properties.vin = vehicle.vin;
                  if (vehicle.missing) {
                    properties._classes = "table-warning";
                  }
                  tableItems.push(properties);
                }
              }
            }
          });
          this.tableItems = tableItems;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchVehicleProperties();
  },
  components: {
    "inventory-slot": InventorySlot,
    vehicle: Vehicle,
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
}
</style>
