<template>
  <div>
    <DealershipDD
      :dealership="selectedDealership"
      @selectDealership="selectedDealership = $event"
    />
      <!-- The following change event needs to be added later to update the visuals @change="$refs.inventoryTable.switchDealerships(selectedDealership)" -->
    <WidgetsDropdown
      v-if="selectedDealership"
      :dealership="selectedDealership"
      ref="wdigetDD"
    />
    <CCard>
      <CCardBody>
        <CRow>
          <CCol sm="5">
            <h4 id="traffic" class="card-title mb-0">Sales Tracker</h4>
            <div class="small text-muted">View vehicle sales grouped by month or year</div>
          </CCol>
          <CCol sm="7" class="d-none d-md-block">
            <CButton color="primary" class="float-right">
              <CIcon name="cil-cloud-download" />
            </CButton>
            <CButtonGroup class="float-right mr-3">
              <CButton
                color="outline-secondary"
                v-for="(value, key) in ['Month', 'Year']"
                :key="key"
                class="mx-0"
                :pressed="value === selected"
                @click="selectTimeScale(value)"
              >
                {{ value }}
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>
        <DashboardLineChart
          v-if="selectedDealership"
          :dealership="selectedDealership"
          :timescale="selected"
          ref="dlc"
        />
      </CCardBody>
    </CCard>
    <!-- This is an example of how to set a component's prop value from the outside -->
    <!-- no-charts -> makes the charts disappear -->
    <!-- !no-charts -> makes the charts appear -->
    <!-- :no-charts="false" -> using the v-bind directive to make a JS code line -->
    <!-- <WidgetsBrand :no-charts="false" /> -->
  </div>
</template>

<script>
// import MainChartExample from "../charts/MainChartExample";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
// import WidgetsBrand from "../widgets/WidgetsBrand";
import DealershipDD from "./inventory/DealershipDropdown.vue"
import DashboardLineChart from "@/views/charts/DashboardLineChart";

export default {
  name: "Dashboard",
  components: {
    DashboardLineChart,
    // MainChartExample,
    WidgetsDropdown,
    // WidgetsBrand,
    DealershipDD,
  },
  methods: {
    selectTimeScale(choice) {
      this.selected = choice
      this.$refs.dlc.useDataSet(choice)
      console.log("Dashboard line chart timescale: "+choice)
    }
  },
  data() {
    return {
      selected: null, //To be used for the line chart
      selectedDealership: null,
    };
  },
};
</script>
