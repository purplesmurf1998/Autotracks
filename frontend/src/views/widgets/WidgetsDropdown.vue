<template>
  <CRow>
    <CCol sm="6" lg="3">
      <CCard class="text-center" color="gradient-primary" textColor="white" style="height:160px">
        <CCardBody class="d-flex align-items-center">
          <CCol>
            <CCardTitle class="display-3" color="gradient-secondary">{{inventoryCount}}</CCardTitle>
            <CCardSubtitle>Vehicles Count</CCardSubtitle>
          </CCol>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol sm="6" lg="3">
      <CWidgetDropdown color="gradient-info" header="9.823" title="Test" text="Members online">
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end"
            :caret="false"
          >
            <template #toggler-content>
              <CIcon name="cil-location-pin"/>
            </template>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
          <CChartLineSimple
            pointed
            class="mt-3 mx-3"
            style="height:70px"
            :data-points="[1, 18, 9, 17, 34, 22, 11]"
            point-hover-background-color="info"
            :options="{ elements: { line: { tension: 0.00001 }}}"
            label="Members"
            labels="months"
          />
        </template>
      </CWidgetDropdown>
    </CCol>
    <CCol sm="6" lg="3">
      <CWidgetDropdown
        color="gradient-warning"
        header="9.823"
        text="Members online"
      >
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
              <CIcon name="cil-settings"/>
            </template>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
          <CChartLineSimple
            class="mt-3"
            style="height:70px"
            background-color="rgba(255,255,255,.2)"
            :data-points="[78, 81, 80, 45, 34, 12, 40]"
            :options="{ elements: { line: { borderWidth: 2.5 }}}"
            point-hover-background-color="warning"
            label="Members"
            labels="months"
          />
        </template>
      </CWidgetDropdown>
    </CCol>
    <CCol sm="6" lg="3">
      <CWidgetDropdown
        color="gradient-danger"
        :text="'Inventory Count By ' + property"
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
            @click.native="filterVisualByProperty(vp.label)">{{vp.label}}</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
          <CChartBarSimple
            class="mt-3 mx-3"
            style="height:70px"
            background-color="rgb(250, 152, 152)"
            label="Members"
            labels="months"
          />
        </template>
      </CWidgetDropdown>
    </CCol>
  </CRow>
</template>

<script>
const axios = require("axios");
import { CChartLineSimple, CChartBarSimple } from '../charts/index.js'

export default {
  name: 'WidgetsDropdown',
  props: ["dealership"],
  data() {
    return {
      inventoryCount: "-1",
      vehicleProperties: null,
      property: null,
    };
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
        this.property = this.vehicleProperties[0].label;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    filterVisualByProperty(label) {
      this.property = label;
      //fetch the vehicle from the inventory grouped by the vehicle property
      //create a new contorller. we need the dealership id and the vehicle property

    },
  },
  mounted() {
    this.fetchVehiclesInInventory(this.dealership);
    this.fetchVehicleProperties();
  },
  components: { CChartLineSimple, CChartBarSimple }
}

var elem = document.getElementById('total-sales');
console.log(elem);
</script>
