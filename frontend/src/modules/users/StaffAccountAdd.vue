<template>
  <div>
    <CForm @submit.prevent="submitForm">
      <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
      <CRow>
        <CCol>
          <CInput
            label="First Name"
            placeholder="User first name"
            :value.sync="first_name"
          />
        </CCol>
        <CCol>
          <CInput
            label="Last Name"
            placeholder="User last name"
            :value.sync="last_name"
          />
        </CCol>
      </CRow>
      <CInput
        label="Email"
        placeholder="User email address"
        :value.sync="email"
      />
      <CSelect
        label="Account Role"
        id="role-select"
        :options="roles"
        :value.sync="role"
        placeholder="Please select a role"
      />
      <CRow>
        <CCol>
          <label>Account Password</label>
        </CCol>
        <CCol class="d-flex align-items-end flex-column">
          <p style="color: red">{{ password }}</p>
        </CCol>
      </CRow>
      <label
        >Take note of the password and pass on to staff member. User will be
        prompted to change password upon first login.</label
      >

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
          color="secondary"
          :disabled="disableButtons"
          @click="setAddingStaffAccount(false)"
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
  name: "StaffAccountAdd",
  props: ["setAddingStaffAccount", "addNewStaffAccount"],
  data() {
    return {
      disableButtons: false,
      errorMessage: null,
      roles: [
        "Management",
        "Sales Rep",
        "Reception",
      ],
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      password: this.generateRandomPassword(),
      permissions: [],
    };
  },
  methods: {
    generateRandomPassword() {
      /*
      Taken from stackoverflow post: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
      */
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 12; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    formIsValid() {
      return (
        this.first_name != "" &&
        this.last_name != "" &&
        this.email != "" &&
        this.role != ""
      );
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
    submitForm(form) {

      // create the data to be passed
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        role: this.role,
        dealership: this.$route.params.dealershipId,
        password: this.password,
      };

      // send post request to the API
      if (this.formIsValid()) {
        axios({
          method: "POST",
          url: `${this.$store.state.api}/users`,
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
          data,
        })
          .then((response) => {
            if (response.data.success) {
              this.$store.commit("setProperty", ["createUserCompleted", true]);
              this.addNewStaffAccount(response.data.payload);
              this.setAddingStaffAccount(false);
            }
          })
          .catch((err) => {
            console.log(err);
            this.showErrorMessage("Failed to create staff account.");
          });
      } else {
        this.showErrorMessage("Invalid form. Please verify the field entries.");
      }
    },
  },
};
</script>
-
<style>
</style>
