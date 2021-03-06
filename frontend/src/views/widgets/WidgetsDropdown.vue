<template>
  <CRow>
    <CCol sm="6" lg="3">
      <CCard class="text-center" color="gradient-primary" textColor="white" style="height:160px">
        <CCardBody class="d-flex align-items-center">
          <CCol>
            <CCardSubtitle class="mt-2">Vehicles Count</CCardSubtitle>
            <CCardTitle class="display-3" color="gradient-secondary">{{inventoryCount}}</CCardTitle>
          </CCol>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol sm="6" lg="3">
      <CCard class="text-center" color="gradient-info" textColor="white" style="height:160px">
        <CCardBody class="d-flex align-items-center">
          <CCol>
            <CCardSubtitle class="mt-2">
              Sold Vehicles Percentage ({{inventoryCount-inventoryNotSoldCount}}/{{inventoryCount}})
            </CCardSubtitle>
            <CCardTitle class="display-3" color="gradient-warning" v-if="soldVehiclesPercentage">{{soldVehiclesPercentage}}%</CCardTitle>
            <CCardTitle class="display-3" color="gradient-warning" v-if="!soldVehiclesPercentage">0%</CCardTitle>
          </CCol>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol sm="6" lg="3">
      <CWidgetDropdown
        color="gradient-warning"
        :text="'Stale Vehicles Percentage (' + staleVehiclesCount+'/'+inventoryCount + ')'"
        style="height:160px"
      >
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
              <CIcon
                name="cil-settings"
                />
            </template>
            <CDropdownItem v-for="staleNum in [1,3,6,9,12]"
                           :key="staleNum"
                           @click.native="fetchStaleVehicles(dealership, staleNum)">{{staleNum}} month(s)</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
          <CCardBody class="d-flex align-items-center">
            <CCol>
              <CCardTitle class="display-3 d-flex justify-content-center" color="gradient-secondary" v-if="staleVehiclesPercentage">
                {{staleVehiclesPercentage}}%
              </CCardTitle>
              <CCardTitle class="display-3 d-flex justify-content-center" color="gradient-secondary" v-if="!staleVehiclesPercentage">
                0%
              </CCardTitle>
            </CCol>
          </CCardBody>
        </template>
      </CWidgetDropdown>
    </CCol>
    <CCol sm="6" lg="3">
      <CWidgetDropdown
        color="gradient-danger"
        :text="'Inventory Count By ' + property_label"
        style="height:160px"
      >
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
             <CIcon
             name="cil-settings"
             @click.native="fetchVehicleProperties"/>
            </template>
            <CDropdownItem v-for="vp in vehicleProperties"
            :key="vp.label"
            @click.native="filterVisualByProperty(vp.key, vp.label)">{{vp.label}}</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
          <CChartBarSimple
            class="mt-3 mx-3"
            style="height:70px"
            background-color="rgb(250, 152, 152)"
            label="Vehicle"
            :labels="propKeys"
            :dataPoints="categoryCount"
          />
        </template>
      </CWidgetDropdown>
    </CCol>
  </CRow>
</template>

<script>
const axios = require("axios");
import { CChartBarSimple } from '../charts/index.js'

export default {
  name: 'WidgetsDropdown',
  props: ["dealership"],
  data() {
    return {
      inventoryCount: "-1",
      inventoryNotSoldCount: "-1",
      staleVehiclesCount: "-1",
      vehicleProperties: null,
      property_label: null,
      property_key: null,
      propKeys: [],
      categoryCount: [],
    };
  },
  computed: {
    soldVehiclesPercentage() {
      let invNum = parseInt(this.inventoryCount);
      let notSoldNum = parseInt(this.inventoryNotSoldCount);
      return ((invNum-notSoldNum)/invNum).toFixed(4)*100;
    },
    staleVehiclesPercentage() {
      let invNum = parseInt(this.inventoryCount);
      let staleNum = parseInt(this.staleVehiclesCount);
      return ((staleNum)/invNum).toFixed(4)*100;
    }
  },
  methods: {
    fetchVehiclesInInventory(dealership) {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/dealership/${dealership}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          const inventoryCount = response.data.inventoryCount;
          this.inventoryCount = inventoryCount.toString();
          this.fetchVehicleProperties();
          this.fetchNotSoldVehiclesInInventory(dealership);
          this.fetchStaleVehicles(dealership, 1);
          setTimeout(() => {
            this.filterVisualByProperty(this.property_key, this.property_label);
          }, 200);
        })
        .catch((error) => {
          console.log(error);
          //Show an error message instead of showing the 404 page
          this.$router.replace("/pages/404");
        });
    },
    fetchNotSoldVehiclesInInventory(dealership) {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/dealership/${dealership}/notSold`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          const inventoryNotSoldCount = response.data.inventoryNotSoldCount;
          this.inventoryNotSoldCount = inventoryNotSoldCount.toString();
        })
        .catch((error) => {
          console.log(error);
          //Show an error message instead of showing the 404 page
          this.$router.replace("/pages/404");
        });
    },
    fetchStaleVehicles(dealership, staleTime) {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/dealership/${dealership}/stale`,
        params: {
          staleTime: staleTime
        },
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.staleVehiclesCount.length !== 0) {
            const staleVehiclesCount = response.data.staleVehiclesCount;
            this.staleVehiclesCount = staleVehiclesCount.toString();
          }
          else {
            this.staleVehiclesCount = 0;
          }
        })
        .catch((error) => {
          console.log(error);
          //Show an error message instead of showing the 404 page
          this.$router.replace("/pages/404");
        });
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
        const payload = response.data.payload;
        const fields = [];
        payload.forEach((property) => {
          if (property.visible) {
            fields.push(property);
          }
        });
        this.vehicleProperties = fields;
        this.property_label = this.vehicleProperties[0].label;
        this.property_key = this.vehicleProperties[0].key;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    filterVisualByProperty(key, label) {
      this.property_label = label;
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/dealership/${this.dealership}/visual3/${key}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
      .then((response) => {
        const payload = response.data.payload;
        payload.sort((a, b) => b.count - a.count);
        const fields = [];
        const values = [];
        let i = 0;
        let othersSum = 0;
        payload.forEach((property) => {
          i++;
          if (i<10)
          {
            fields.push(property.value);
            values.push(property.count);
          }
          else {
            othersSum += property.count;
          }
        });
        fields.push("Others");
        values.push(othersSum);
        this.propKeys=fields;
        this.categoryCount=values;
      })
      .catch((error) => {
        console.log(error);
      });

    },
  },
  mounted() {
    this.fetchVehiclesInInventory(this.dealership);
  },
  components: { CChartBarSimple }
}

</script>
