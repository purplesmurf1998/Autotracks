<template>
  <CForm @submit.prevent="submitUser">
    <CInput label="First Name" horizontal v-model="user.first_name" size="sm" />
    <CInput label="Last Name" horizontal v-model="user.last_name" size="sm" />
    <CInput label="Email" horizontal v-model="user.email" size="sm" />
    <CSelect
      label="Role"
      :options="roles"
      horizontal
      :value.sync="user.role"
      size="sm"
    />
    <CMultiSelect
      name="permissions"
      :options="permissionsList"
      :selected="user.permissions"
      search
      searchPlaceholder="..."
      selectionType="tags"
    />
    <CRow class="d-flex justify-content-center mt-2">
      <CButton color="success" class="mr-2" type="submit">Save</CButton>
      <CButton color="secondary" @click="setEditingUser(false)">Cancel</CButton>
    </CRow>
  </CForm>
</template>

<script>
const axios = require("axios");

export default {
  data() {
    return {
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
    };
  },
  props: ["setEditingUser", "user"],
  methods: {
    submitUser() {
      console.log(this.user);
      // send the put request using axios
      const data = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
        role: this.user.role,
        permissions: this.user.permissions,
      };
      axios({
        method: "PUT",
        url: `http://localhost:5000/api/v1/users/${this.user._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data,
      })
        .then((response) => {
          if (response.data.success) {
            this.setEditingUser(false);
          } else {
            console.log(response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeUser(index) {
      this.users.splice(index, 1);
    },
  },
};
</script>