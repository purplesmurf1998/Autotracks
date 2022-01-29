<template>
  <div>
    <DealershipDD
      :dealership="selectedDealership"
      @selectDealership="selectedDealership = $event"
      :showSetDefault="true"
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
            <h4 id="traffic" class="card-title mb-0">Traffic</h4>
            <div class="small text-muted">November 2017</div>
          </CCol>
          <CCol sm="7" class="d-none d-md-block">
            <CButton color="primary" class="float-right">
              <CIcon name="cil-cloud-download" />
            </CButton>
            <CButtonGroup class="float-right mr-3">
              <CButton
                color="outline-secondary"
                v-for="(value, key) in ['Day', 'Month', 'Year']"
                :key="key"
                class="mx-0"
                :pressed="value === selected ? true : false"
                @click="selected = value"
              >
                {{ value }}
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>
        <MainChartExample style="height: 300px; margin-top: 40px" />
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
import MainChartExample from "../charts/MainChartExample";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import WidgetsBrand from "../widgets/WidgetsBrand";
import DealershipDD from "./inventory/DealershipDropdown.vue"

export default {
  name: "Dashboard",
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand,
    DealershipDD,
  },
  data() {
    return {
      selected: null, //To be used for thet line chart
      selectedDealership: null,
    };
  },
};
</script>
