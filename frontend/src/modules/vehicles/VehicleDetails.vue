<template>
  <div>
    <CCard>
      <CCardBody>
        <h4>Vehicle Details</h4>
        <hr />
        <CRow>
          <CCol>
            <CRow class="justify-content-between ml-0 mr-0">
              <h6>Deposit Status</h6>
              <p class="mb-0">$0.00</p>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <h6>Sale Status</h6>
              <p class="mb-0">Not Sold</p>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <h6>Delivery Status</h6>
              <p class="mb-0">Not Delivered</p>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "VehicleDetails",
  props: ["vehicle"],
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<style>
</style>