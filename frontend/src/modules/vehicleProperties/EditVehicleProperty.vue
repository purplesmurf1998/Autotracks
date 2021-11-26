<template>
  <div>
    <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
    <CForm @submit.prevent="submitProperty">
      <CInput
        label="Header Name"
        id="header-name"
        v-model="currProperty.label"
      />
      <CSelect
        label="Input Type"
        id="input-type-cmb"
        :options="['Text', 'Number', 'Currency', 'Date', 'Options', 'List']"
        :value.sync="currProperty.inputType"
      />
      <CRow>
        <CCol>
          <CSelect
            label="Value required?"
            id="is-required-cmb"
            :options="['Yes', 'No']"
            :value.sync="currProperty.isRequired"
          />
        </CCol>
        <CCol>
          <CSelect
            label="Visible in inventory?"
            id="is-visible-cmb"
            :options="['Yes', 'No']"
            :value.sync="currProperty.visible"
          />
        </CCol>
      </CRow>
      <CInput
        label="Options"
        id="header-name-txt"
        placeholder="ex. Showroom;Demoline;Garage"
        :value.sync="currProperty.options"
        v-if="currProperty.inputType == 'Options'"
      />
      <CTextarea
        label="Description (optional)"
        placeholder="Enter a description of the vehicle property"
        rows="5"
        :value.sync="currProperty.description"
      />
      <hr />
      <CRow class="d-flex justify-content-center mt-2">
        <CButton
          color="success"
          class="mr-2"
          id="save-user-changes"
          type="submit"
          >Save</CButton
        >
        <CButton color="secondary" @click="cancelUpdate">Cancel</CButton>
      </CRow>
    </CForm>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "EditVehicleProperty",
  props: ["setEditingProperty", "property", "updateProperty", "index"],
  data() {
    return {
      disableButtons: false,
      errorMessage: null,
      currProperty: {
        label: this.property.label,
        inputType: this.property.inputType,
        visible: this.property.visible,
        isRequired: this.property.isRequired,
        options: "",
        description: this.property.description || "",
      },
    };
  },
  methods: {
    cancelUpdate() {
      this.updateProperty(this.property, this.index);
      this.setEditingProperty(false);
    },
    submitProperty() {
      // simple validation step
      if (this.currProperty.label == "" || this.currProperty.inputType == "") {
        this.showErrorMessage("Header Name and Input Type are required fields");
        return false;
      }

      // parse the options
      let options = [];
      if (
        this.currProperty.inputType == "Options" &&
        !this.currProperty.options.includes(";")
      ) {
        this.showErrorMessage(
          "Options input type must have more than one option and be separated by a semicolon (;)"
        );
        return false;
      } else if (this.currProperty.inputType == "Options") {
        options = this.currProperty.options.split(";");
      }

      const newProperty = {
        label: this.currProperty.label,
        inputType: this.currProperty.inputType,
        isRequired: this.currProperty.isRequired == "Yes",
        visible: this.currProperty.visible == "Yes",
        description: this.currProperty.description,
        options,
      };

      axios({
        method: "PUT",
        url: `${this.$store.state.api}/dealerships/${this.$route.params.dealershipId}/vehicles/properties/${this.property._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: newProperty,
      })
        .then((response) => {
          if (response.data.success) {
            this.updateProperty(response.data.payload, this.index);
            this.setEditingProperty(false);
          } else {
            console.log(response);
            this.showError("Incomplete or invalid fields.");
          }
        })
        .catch((err) => {
          console.log(err);
          this.showError("Error updating staff account information.");
        });
    },
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
  },
  mounted() {
    // parse the options and convert back into a string
    if (this.property.inputType == "Options") {
      let optionString = "";
      const length = this.property.options.length;
      for (let i = 0; i < length; i++) {
        if (i < length - 1) {
          optionString += this.property.options[i] + ";";
        } else {
          optionString += this.property.options[i];
        }
      }
      console.log(optionString);
      this.currProperty.options = optionString;
    }

    // convert visible and required to Yes/No
    this.currProperty.visible = this.property.visible ? "Yes" : "No";
    this.currProperty.isRequired = this.property.isRequired ? "Yes" : "No";
  },
};
</script>