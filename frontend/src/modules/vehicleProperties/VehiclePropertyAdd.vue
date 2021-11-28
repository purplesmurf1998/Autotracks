<template>
  <div>
    <CForm @submit.prevent="submitNewProperty">
      <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
      <CInput
        label="Header Name"
        id="header-name-txt"
        placeholder="Enter the label for the vehicle property"
        :value.sync="label"
      />
      <CSelect
        label="Input Type"
        id="input-type-cmb"
        :options="['Text', 'Number', 'Currency', 'Date', 'Options', 'List']"
        :value.sync="inputType"
        placeholder="Please select the input type"
      />
      <CRow>
        <CCol>
          <CSelect
            label="Value required?"
            id="is-required-cmb"
            :options="['Yes', 'No']"
            :value.sync="isRequired"
          />
        </CCol>
        <CCol>
          <CSelect
            label="Visible in inventory?"
            id="is-visible-cmb"
            :options="['Yes', 'No']"
            :value.sync="visible"
          />
        </CCol>
      </CRow>
      <CInput
        label="Options"
        id="header-name-txt"
        placeholder="ex. Showroom;Demoline;Garage"
        :value.sync="options"
        v-if="inputType == 'Options'"
      />
      <CTextarea
        label="Description (optional)"
        placeholder="Enter a description of the vehicle property"
        rows="5"
        :value.sync="description"
      />
      <CRow class="justify-content-center mt-2">
        <CButton
          color="primary"
          type="submit"
          :disabled="disableButtons"
          id="create-staff"
        >
          Create
        </CButton>
        <CButton
          class="ml-1"
          color="danger"
          :disabled="disableButtons"
          @click="setAddingVehicleProperty(false)"
        >
          Cancel
        </CButton>
      </CRow>
    </CForm>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "VehiclePropertyAdd",
  props: ["setAddingVehicleProperty", "addNewVehicleProperty"],
  data() {
    return {
      label: "",
      inputType: "",
      isRequired: "Yes",
      visible: "Yes",
      options: "",
      description: "",
      errorMessage: null,
      disableButtons: false,
    };
  },
  methods: {
    submitNewProperty() {
      // simple validation step
      if (this.label == "" || this.inputType == "") {
        this.showErrorMessage("Header Name and Input Type are required fields");
        return false;
      }

      // parse the options
      let options = [];
      if (this.inputType == "Options" && !this.options.includes(";")) {
        this.showErrorMessage(
          "Options input type must have more than one option and be separated by a semicolon (;)"
        );
        return false;
      } else if (this.inputType == "Options") {
        options = this.options.split(";");
      }

      // create the new property object
      const newProperty = {
        label: this.label,
        inputType: this.inputType,
        isRequired: this.isRequired == "Yes",
        visible: this.visible == "Yes",
        description: this.description,
        options,
      };

      // post the the new property to the API
      this.createNewProperty(newProperty);
    },
    createNewProperty(newProperty) {
      axios({
        method: "POST",
        url: `${this.$store.state.api}/dealerships/${this.$route.params.dealershipId}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: newProperty,
      })
        .then((response) => {
          if (response.data.success) {
            this.addNewVehicleProperty(response.data.payload);
            this.setAddingVehicleProperty(false);
          }
        })
        .catch((error) => {
          console.log(error);
          this.showErrorMessage("Unable to create the vehicle property.");
        });
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
  },
};
</script>

<style>
</style>