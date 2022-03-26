<template>
  <div>
    <CAlert :color="messageObj.messageType" v-if="!!messageObj.content">{{ messageObj.content }}</CAlert>
    <DealershipDD
      :dealership="selectedDealership"
      @selectDealership="selectedDealership = $event"
      :showSetDefault="true"
    />
      <!-- The following change event needs to be added later to update the visuals @change="$refs.inventoryTable.switchDealerships(selectedDealership)" -->
    <WidgetsDropdown
      v-if="selectedDealership || $store.state.auth.role != 'Administration'"
      :dealership="selectedDealership ? selectedDealership : $store.state.auth.dealership"
      ref="widgetDD"
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
            <!-- Use this button to select the number of periods to display -->
            <CButtonGroup class="float-right mr-3">
              <CButton
                color="outline-secondary"
                v-for="(value, key) in ['Last 12', 'All']"
                :key="key"
                class="mx-0"
                :pressed="value === selectedPeriod"
                @click="selectPeriod(value)"
              >
                {{ value }}
              </CButton>
            </CButtonGroup>
            <!-- Use this button to select monthly or yearly buckets -->
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
          v-if="selectedDealership || $store.state.auth.role != 'Administration'"
          :dealership="selectedDealership ? selectedDealership : $store.state.auth.dealership"
          :timescale="selected"
          :periods="selectedPeriod"
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

const { message } = require("../../utils/index");

import WidgetsDropdown from "../widgets/WidgetsDropdown";
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
    /*
    Both selectTimeScale and selectPeriod call the useDataSet from the child DashboardLineChart.
    However, these need to be different methods for the sake of @click.
    */
    selectTimeScale(choice) {
      this.selected = choice
      this.$refs.dlc.useDataSet(this.selected, this.selectedPeriod)
      console.log("Dashboard line chart timescale: "+choice)
    },
    selectPeriod(choice) {
      this.selectedPeriod = choice
      this.$refs.dlc.useDataSet(this.selected, this.selectedPeriod)
      console.log("Dashboard line chart period: "+choice)
    },
  },
  data() {
    return {
      // Defaults for selected (timescale) and selectedPeriod are here.
      selected: "Month", //To be used for the line chart
      selectedDealership: null,
      selectedPeriod: "All",
      messageObj: message,
    };
  },
};
</script>
