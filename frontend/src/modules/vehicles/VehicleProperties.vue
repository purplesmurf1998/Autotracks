<template>
  <div>
    <CCard>
      <CCardBody>
        <h4>Vehicle properties</h4>
        <hr />
        <CRow>
          <CCol>
            <CRow
              v-for="property in leftProperties"
              :key="property._id"
              class="justify-content-between ml-0 mr-0"
            >
              <CCol>
                <h6>{{ property.label }}</h6>
              </CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-0 property-field">
                  {{
                    !vehicle.properties[property.key]
                      ? "N/A"
                      : vehicle.properties[property.key]
                  }}
                </p>
              </CCol>
            </CRow>
          </CCol>
          <CCol>
            <CRow
              v-for="property in rightProperties"
              :key="property._id"
              class="justify-content-between ml-0 mr-0"
            >
              <CCol>
                <h6>{{ property.label }}</h6>
              </CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-0 property-field">
                  {{
                    !vehicle.properties[property.key]
                      ? "N/A"
                      : vehicle.properties[property.key]
                  }}
                </p>
              </CCol>
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
  name: "VehicleProperties",
  props: ["vehicle"],
  data() {
    return {
      vehicleProperties: null,
      leftProperties: null,
      rightProperties: null,
    };
  },
  methods: {
    fetchDealershipProperties() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.vehicle.dealership}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.vehicleProperties = response.data.payload;
            this.splitVehicleProperties();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    splitVehicleProperties() {
      let leftProperties = [];
      let rightProperties = [];
      this.vehicleProperties.forEach((property, index) => {
        if (index % 2 == 0) {
          // leftProperties
          leftProperties.push(property);
        } else {
          // rightProperties
          rightProperties.push(property);
        }
      });
      this.leftProperties = leftProperties;
      this.rightProperties = rightProperties;
    },
  },
  mounted() {
    this.fetchDealershipProperties();
  },
};
</script>

<style>
.property-field {
  text-align: right;
}
</style>