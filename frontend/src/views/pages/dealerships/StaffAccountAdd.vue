<template>
  <div>
    <CForm @submit.prevent="submitForm">
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
        @change="setSelected"
        placeholder="Please select a role"
      />
      <label v-if="role != ''">Account Permissions</label>
      <CMultiSelect
        v-if="role != ''"
        name="permissions"
        :options="permissionsList"
        :selected="selected"
        search
        searchPlaceholder="..."
        selectionType="tags"
      />
      <CRow>
        <CCol>
          <label>Account Password</label>
        </CCol>
        <CCol class="d-flex align-items-end flex-column">
          <p style="color: red">password123</p>
        </CCol>
      </CRow>
      <label
        >Take note of the password and pass on to staff member. User will be
        prompted to change password upon first login.</label
      >

      <CRow class="justify-content-center mt-2">
        <CButton color="primary" 
        type="submit" 
        :disabled="disableButtons"
        id="create-staff">
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
  props: ["setAddingStaffAccount"],
  data() {
    return {
      disableButtons: false,
      roles: [
        "Management",
        "Sales Rep",
        "Sales Rep + Showroom",
        "Sales Rep + Demoline",
        "Sales Rep + Benefits",
        "Reception",
      ],
      permissionsList: [
        {
          value: "Add Dealerships",
          text: "Add Dealerships",
        },
        {
          value: "View Dealerships",
          text: "View Dealerships",
        },
        {
          value: "Edit Dealerships",
          text: "Edit Dealerships",
        },
        {
          value: "Delete Dealerships",
          text: "Delete Dealerships",
        },
        {
          value: "Add Staff Users",
          text: "Add Staff Users",
        },
        {
          value: "View Staff Users",
          text: "View Staff Users",
        },
        {
          value: "Edit Staff Users",
          text: "Edit Staff Users",
        },
        {
          value: "Delete Staff Users",
          text: "Delete Staff Users",
        },
        {
          value: "Add Vehicles",
          text: "Add Vehicles",
        },
        {
          value: "View Vehicles",
          text: "View Vehicles",
        },
        {
          value: "Edit Vehicle Properties",
          text: "Edit Vehicle Properties",
        },
        {
          value: "Edit Vehicle Locations",
          text: "Edit Vehicle Locations",
        },
        {
          value: "Sell Vehicles",
          text: "Sell Vehicles",
        },
        {
          value: "Delete Vehicles",
          text: "Delete Vehicles",
        },
      ],
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      selected: [],
      permissions: [],
    };
  },
  methods: {
    test(control) {
      console.log("test");
    },
    setSelected() {
      this.selected = this.getSelected();
      console.log(this.selected);
    },
    getSelected() {
      /*
        "Management",
        "Sales Rep",
        "Sales Rep + Showroom",
        "Sales Rep + Demoline",
        "Sales Rep + Benefits",
        "Reception"
      */
      /*
      'Add Dealerships',
      'View Dealerships',
      'Edit Dealerships',
      'Delete Dealerships',
      'Add Staff Users',
      'View Staff Users',
      'Edit Staff Users',
      'Delete Staff Users',
      'Add Vehicles',
      'View Vehicles',
      'Edit Vehicle Properties',
      'Edit Vehicle Locations',
      'Sell Vehicles',
      'Delete Vehicles'
     */
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
    showErrorMessage(message) {},
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
        permissions: this.selected,
        password: "password1234",
      };

      console.log(data);

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
            console.log(response);
            if (response.data.success) {
              this.$router.go();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("invalid form");
        this.showErrorMessage("Invalid form. Please verify the field entries.");
      }
    },
  },
};
</script>

<style>
</style>