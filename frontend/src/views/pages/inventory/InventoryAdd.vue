<template>
  <div>
    <CCard v-if="dealership">
      <CCardBody>
        <h1>Adding New Vehicle</h1>
        <h5>Dealership: {{ dealership.name }}</h5>
        <p>
          In this page you can add a new vehicle to the inventory of the
          specified dealership. Vehicle model is defined in the dealership's
          parameters
          <router-link
            v-if="userHasPermissions('View Dealerships')"
            :to="`/dealerships/${dealership._id}`"
            >here</router-link
          >
          under "Vehicle Properties"
        </p>
      </CCardBody>
    </CCard>
    <CAlert
      color="danger"
      v-if="vehicleProperties && vehicleProperties.length == 0"
      >You must create vehicle properties inside the dealership details page
      before creating vehicles.</CAlert
    >
    <CAlert
      color="danger"
      v-if="errorMessage"
      >{{ errorMessage }}</CAlert
    >
    <CRow>
      <CCol>
        <CCard v-if="vehicleProperties && vehicleProperties.length > 0">
          <CCardBody>
            <h3>Vehicle Properties</h3>
            <hr />
            <CForm ref="vehicleForm" @submit.prevent="submitForm">
              <CInput
                  label="VIN"
                  name="vin"
                  v-model="vin"
                  :required="true"
                />
              <div v-for="property in vehicleProperties" :key="property._id">
                <CInput
                  v-if="property.inputType == 'Text'"
                  :label="property.label"
                  :name="property.key"
                  v-model="properties[property.key]"
                  :required="property.isRequired"
                />
                <CInput
                  v-if="property.inputType == 'List'"
                  :label="property.label"
                  :name="property.key"
                  v-model="properties[property.key]"
                  description="Separate list item by semi-colons ';'"
                  :required="property.isRequired"
                />
                <CSelect
                  v-if="property.inputType == 'Options'"
                  :label="property.label"
                  :options="property.options"
                  :name="property.key"
                  :value.sync="properties[property.key]"
                  :required="property.isRequired"
                />
                <CInput
                  v-if="property.inputType == 'Date'"
                  type="date"
                  :label="property.label"
                  :name="property.key"
                  v-model="properties[property.key]"
                  :required="property.isRequired"
                />
              </div>
              <CButton color="primary" type="submit"
                >Add vehicle to the inventory</CButton
              >
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol></CCol>
    </CRow>
    <CModal :show.sync="showingModal" :centered="true">
      <p>Do you wish to add another vehicle?</p>
      <template #header>
        <h6 class="modal-title">Vehicle added successfully!</h6>
        <CButtonClose @click="showingModal = false" />
      </template>
      <template #footer>
        <CButton @click="showingModal = false" color="success">Yes</CButton>
        <router-link to="/inventory"
          ><CButton color="danger">No</CButton></router-link
        >
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");
const {
  containsPermissions,
  getFormattedProperties,
} = require("../../../utils/index");
import MaskedInput from "vue-text-mask";

export default {
  name: "InventoryAdd",
  data() {
    return {
      dealership: null,
      vehicleProperties: null,
      errorMessage: null,
      showingModal: false,
      vin: null,
      properties: null,
    };
  },
  methods: {
    submitForm(form) {
      let properties = getFormattedProperties(
        this.vehicleProperties,
        this.properties
      );

      // submit the vehicle
      this.submitVehicle(properties);
    },
    resetForm() {
      this.vehicleProperties.forEach((property) => {
        this.properties[property.key] = "";
      });
    },
    submitVehicle(properties) {
      const body = {
        dealership: this.$route.params.dealershipId,
        vin: this.vin,
        properties,
      };
      axios({
        method: "POST",
        url: `${this.$store.state.api}/inventory`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: body,
      })
        .then((response) => {
          if (response.data.success) {
            //Show modal asking to enter a new vehicle or go back to the inventory
            this.resetForm();
            this.showingModal = true;
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.error != null)
          {
            this.showErrorMessage(
              error.response.data.error
            );
          }
          else
          {
            this.showErrorMessage(
              "Unable to create the vehicle. Make sure the information was entered correctly."
            );
          }
          window.scrollTo(0,0);
        });
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
    userHasPermissions(...permissions) {
      return containsPermissions(permissions);
    },
    fetchDealership() {
      // fetch the dealership details
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.$route.params.dealershipId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            // set the payload to the dealership
            this.dealership = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$router.replace("/pages/404");
        });
    },
    fetchVehicleProperties() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.$route.params.dealershipId}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          // set the payload to the dealership
          this.vehicleProperties = response.data.payload;
          let properties = {};
          this.vehicleProperties.forEach((property) => {
            if (property.inputType == "Options") {
              properties[property.key] = property.options[0];
            } else {
              properties[property.key] = null;
            }
          });
          this.properties = properties;
        })
        .catch((error) => {
          console.log(error);
          this.$router.replace("/pages/404");
          alert("weassup");
          this.showMessage("test", "danger");
        });
    },
  },
  components: {
    MaskedInput,
  },
  mounted() {
    this.fetchDealership();
    this.fetchVehicleProperties();
  },
};
</script>

<style>
</style>
