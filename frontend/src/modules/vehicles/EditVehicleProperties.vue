<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow class="ml-0 mr-0 d-flex justify-content-between">
          <h4 class="mr-3">Vehicle Properties</h4>
          <div>
            <CButton color="success" @click="submitNewProperties" class="mr-2"
              >Save changes</CButton
            >
            <CButton color="danger" @click="setEditingProperties(false)"
              >Cancel</CButton
            >
          </div>
        </CRow>
        <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
        <hr />
          <CCol v-if="!!editedVehicle">
            <div
              v-for="property in vehicleProperties"
              :key="property._id"
              class="mb-2"
            >
              <CInput
                v-if="property.inputType == 'Text'"
                :name="property.key"
                :label="property.label"
                v-model="editedVehicle[property.key]"
                horizontal
                class="mb-0"
              />
              <CInput
                v-if="property.inputType == 'List'"
                :name="property.key"
                :label="property.label"
                description="Separate list item by semi-colons ';'"
                v-model="editedVehicle[property.key]"
                horizontal
                class="mb-0"
              />
              <CSelect
                v-if="property.inputType == 'Options'"
                :options="property.options"
                :name="property.key"
                :label="property.label"
                :value.sync="editedVehicle[property.key]"
                horizontal
                class="mb-0"
              />
              <CInput
                v-if="property.inputType == 'Date'"
                :label="property.label"
                v-model="editedVehicle[property.key]"
                type="date"
                horizontal
              />
            </div>
          </CCol>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
const axios = require("axios");

const { getFormattedProperties } = require("../../utils/index");

export default {
  props: [
    "vehicle",
    "leftProperties",
    "rightProperties",
    "vehicleProperties",
    "setEditingProperties",
    "setNewVehicle",
  ],
  data() {
    return {
      editedVehicle: null,
      errorMessage: null
    };
  },
  methods: {
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
    submitNewProperties() {
      // save the new information
      let properties = this.vehicleProperties;
      let formattedProperties = getFormattedProperties(
        properties,
        this.editedVehicle
      );
      // create the request body
      let tempVehicle = this.vehicle;
      tempVehicle.properties = formattedProperties;
      // update the backend
      this.updateBackend(tempVehicle);
    },
    updateBackend(body) {
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/inventory/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: body,
      })
        .then((response) => {
          if (response.data.success) {
            // do something
            this.setNewVehicle(response.data.payload);
            this.setEditingProperties(false);
          }
        })
        .catch((err) => {
          console.log(err);
          this.showError("Error occured while editing vehicle property.");
        });
    },
  },
  mounted() {
    // get the values of the properties and add to the editedVehicle field
    const editedVehicle = {};
    if (this.vehicleProperties) {
      this.vehicleProperties.forEach((property) => {
        if (property.inputType == "List") {
          let value = "";
          let items = this.vehicle.properties[property.key];
          items.forEach((item, index) => {
            if (index < items.length - 1) {
              value += item + ";";
            } else {
              value += item;
            }
          });
          editedVehicle[property.key] = value;
        } else {
          editedVehicle[property.key] = this.vehicle.properties[property.key];
        }
      });
      this.editedVehicle = editedVehicle;
    }
  },
  components: {},
};
</script>

<style>
</style>