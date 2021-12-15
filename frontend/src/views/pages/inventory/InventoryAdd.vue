<template>
  <div>
    <CCard v-if="dealership">
      <CCardBody>
        <h1>Adding New Vehicle</h1>
        <h5>Dealership: {{ dealership.name }}</h5>
        <p>In this page you can add a new vehicle to the inventory of the specified dealership. 
          Vehicle model is defined in the dealership's parameters 
          <router-link v-if="userHasPermissions('View Dealerships')" :to="`/dealerships/${dealership._id}`">here</router-link> 
          under "Vehicle Properties"</p>
      </CCardBody>
    </CCard>
    <CRow>
      <CCol>
        <CCard v-if="vehicleProperties">
          <CCardBody>
            <h3>Vehicle Properties</h3>
            <hr>
            <div v-for="property in vehicleProperties" :key="property._id">
              <CInput 
                v-if="property.inputType == 'Text'"
                :label="property.label"
              />
              <CSelect
                v-if="property.inputType == 'Options'"
                :label="property.label"
                :options="property.options"
              />
              <CFormGroup
                wrapperClasses="input-group pt-2 pb-3"
                v-if="property.inputType == 'Date'"
              >
                <template #prepend-content>
                  <CIcon name="cil-calendar"/>
                </template>
                <template #label>
                  {{ property.label }}
                </template>
                <template #input>
                  <masked-input
                    type="text"
                    name="date"
                    class="form-control"
                    :mask="[/0|1|2|3/, /\d/, '/', /0|1|2|3/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]"
                    :guide="true"
                    placeholderChar="_"
                    :showMask="true"
                    :keepCharPositions="true"
                  />
                </template>
              </CFormGroup>
            </div>
            <CButton color="primary">Add vehicle to the inventory</CButton>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol></CCol>
    </CRow>
  </div>
</template>

<script>
const axios = require('axios');
const { containsPermissions } = require("../../../utils/index");
import MaskedInput from 'vue-text-mask'

export default {
  name: 'InventoryAdd',
  data() {
    return {
      dealership: null,
      vehicleProperties: null
    }
  },
  methods: {
    userHasPermissions(...permissions) {
      // console.log(permissions);
      // console.log(containsPermissions(permissions));
      return containsPermissions(permissions);
    },
    fetchDealership() {
      // fetch the dealership details
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.$route.params.dealershipId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        }
      })
      .then((response) => {
        if (response.data.success) {
          // set the payload to the dealership
          this.dealership = response.data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    fetchVehicleProperties() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.$route.params.dealershipId}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        }
      })
      .then((response) => {
        if (response.data.success) {
          // set the payload to the dealership
          this.vehicleProperties = response.data.payload;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
  components: {
    MaskedInput
  },
  mounted() {
    this.fetchDealership();
    this.fetchVehicleProperties();
  }
}
</script>

<style>

</style>