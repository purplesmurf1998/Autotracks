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
        @change="setDefaultSelected"
        placeholder="Please select a role"
      />
      <label class="mb-0">Account permissions</label>
      <hr />
      <CRow>
        <CCol>
          <CRow v-for="(permission, index) in permissionsListLeft" :key="index">
            <CCol>
              <label>{{ permission }}</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
              <CSwitch
                :id="permission"
                class="mr-1"
                color="success"
                :checked="isPermissionSelected(permission)"
                @change.native="togglePermissionChange"
                shape="pill"
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow
            v-for="(permission, index) in permissionsListRight"
            :key="index"
          >
            <CCol>
              <label>{{ permission }}</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
              <CSwitch
                :id="permission"
                class="mr-1"
                color="success"
                :checked="isPermissionSelected(permission)"
                @change.native="togglePermissionChange"
                shape="pill"
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <hr />
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
          color="danger"
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
        "Sales Rep + Showroom",
        "Sales Rep + Demoline",
        "Sales Rep + Benefits",
        "Reception",
      ],
      permissionsListLeft: [
        "Add Dealerships",
        "View Dealerships",
        "Edit Dealerships",
        "Delete Dealerships",
        "Add Staff Users",
        "View Staff Users",
        "Edit Staff Users",
      ],
      permissionsListRight: [
        "Delete Staff Users",
        "Add Vehicles",
        "View Vehicles",
        "Edit Vehicle Properties",
        "Edit Vehicle Locations",
        "Sell Vehicles",
        "Delete Vehicles",
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
    isPermissionSelected(permission) {
      const index = this.permissions.indexOf(permission);
      return index >= 0;
    },
    togglePermissionChange(element) {
      const checked = element.target.checked;
      const permission = element.target.id;

      if (checked) {
        // add the permission to the list
        this.addPermission(permission);
      } else {
        this.removePermission(permission);
      }
    },
    addPermission(permission) {
      this.permissions.push(permission);
    },
    removePermission(permission) {
      const index = this.permissions.indexOf(permission);
      this.permissions.splice(index, 1);
    },
    setDefaultSelected() {
      this.permissions = [];
      this.permissions = this.getDefaultSelected();
    },
    getDefaultSelected() {
      switch (this.role) {
        case "Management":
          return [
            "View Dealerships",
            "Add Staff Users",
            "View Staff Users",
            "Edit Staff Users",
            "Delete Staff Users",
            "View Vehicles",
            "Edit Vehicle Locations",
          ];
        case "Sales Rep":
          return ["View Vehicles", "Edit Vehicle Locations", "Sell Vehicles"];
        case "Sales Rep + Showroom":
          return ["View Vehicles", "Edit Vehicle Locations", "Sell Vehicles"];
        case "Sales Rep + Demoline":
          return ["View Vehicles", "Edit Vehicle Locations", "Sell Vehicles"];
        case "Sales Rep + Benefits":
          return ["View Vehicles", "Edit Vehicle Locations", "Sell Vehicles"];
        case "Reception":
          return [
            "Add Vehicles",
            "View Vehicles",
            "Edit Vehicle Properties",
            "Edit Vehicle Locations",
            "Delete Vehicles",
          ];
        default:
          return ["View Vehicles"];
      }
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
      // console.log("####### STAFF USER FORM SUBMIT ########");
      // console.log(`First Name: ${this.first_name}`);
      // console.log(`Last Name: ${this.last_name}`);
      // console.log(`Email: ${this.email}`);
      // console.log(`Role: ${this.role}`);
      // console.log(`Permissions: ${this.selected}`);
      // console.log(form.target.permissions.selected);

      // create the data to be passed
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        role: this.role,
        dealership: this.$route.params.dealershipId,
        permissions: this.permissions,
        password: this.password,
      };

      // send post request to the API
      if (this.formIsValid()) {
        axios({
          method: "POST",
          url: "http://localhost:5000/api/v1/users",
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

<style>
</style>