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
            <CForm ref="vehicleForm" @submit.prevent="submitForm">
              <div v-for="property in vehicleProperties" :key="property._id">
                <CInput 
                  v-if="property.inputType == 'Text'"
                  :label="property.label"
                  :name="property.key"
                />
                <CInput 
                  v-if="property.inputType == 'List'"
                  :label="property.label"
                  :name="property.key"
                  description="Separate list item by semi-colons ';'"
                />
                <CSelect
                  v-if="property.inputType == 'Options'"
                  :label="property.label"
                  :options="property.options"
                  :name="property.key"
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
                      :name="property.key"
                      class="form-control"
                      :mask="[/0|1|2|3/, /\d/, '-', /0|1|2|3/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]"
                      :guide="true"
                      placeholderChar="_"
                      :showMask="true"
                      :keepCharPositions="true"
                    />
                  </template>
                </CFormGroup>
              </div>
              <CButton color="primary" type="submit">Add vehicle to the inventory</CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol></CCol>
    </CRow>
    <CModal
      :show.sync="showingModal"
      :centered="true"
    >
      <p>Do you wish to add another vehicle?</p>
      <template #header>
        <h6 class="modal-title">Vehicle added successfully!</h6>
        <CButtonClose @click="showingModal = false" />
      </template>
      <template #footer>
        <CButton @click="showingModal = false" color="success">Yes</CButton>
        <router-link to="/inventory"><CButton color="danger">No</CButton></router-link>
      </template>
    </CModal>
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
      vehicleProperties: null,
      errorMessage: null,
      showingModal: false
    }
  },
  methods: {
    submitForm(form) {
      let properties = {};
      this.vehicleProperties.forEach(property => {
        if (!form.target.elements[property.key]) {
          properties[property.key] = null;
        } else {
          properties[property.key] = form.target.elements[property.key].value
        }
      })
      
      // submit the vehicle
      this.submitVehicle(properties);
    },
    submitVehicle(properties) {
      const body = {
        dealership: this.$route.params.dealershipId,
        properties
      };
      console.log(body);
      axios({
        method: "POST",
        url: `${this.$store.state.api}/inventory`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: body
      })
      .then((response) => {
        if (response.data.success) {
          //TODO: show modal asking to enter a new vehicle or go back to the inventory
          // for now, just refresh the page
          this.$refs.vehicleForm.reset();
          this.showingModal = true;
        }
      })
      .catch((error) => {
        console.log(error);
        this.showErrorMessage('Unable to create the vehicle. Make sure the information was entered correctly.');
      });
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000)
    },
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