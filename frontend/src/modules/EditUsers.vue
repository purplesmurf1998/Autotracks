<template>
  <div>
    <CAlert v-if="!!errorMessage" color="danger" >{{ errorMessage }}</CAlert>
    <CForm @submit.prevent="submitUser">
      <CInput
        label="First Name"
        id="first-name"
        horizontal
        v-model="currUser.first_name"
      />
      <CInput
        label="Last Name"
        id="last-name"
        horizontal
        v-model="currUser.last_name"
      />
      <CInput label="Email" horizontal v-model="currUser.email" disabled="true"/>
      <CSelect
        label="Role"
        :options="roles"
        horizontal
        :value.sync="currUser.role"
        @change="setDefaultSelected"
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
          <CRow v-for="(permission, index) in permissionsListRight" :key="index">
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
      <CRow class="d-flex justify-content-center mt-2">
        <CButton color="success" class="mr-2" id="save-user-changes" type="submit">Save</CButton>
        <CButton color="secondary" @click="cancelUpdate">Cancel</CButton>
      </CRow>
    </CForm>
  </div>
</template>

<script>
const axios = require("axios");

export default {
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
        'Add Dealerships',
        'View Dealerships',
        'Edit Dealerships',
        'Delete Dealerships',
        'Add Staff Users',
        'View Staff Users',
        'Edit Staff Users',
      ],
      permissionsListRight: [
        'Delete Staff Users',
        'Add Vehicles',
        'View Vehicles',
        'Edit Vehicle Properties',
        'Edit Vehicle Locations',
        'Sell Vehicles',
        'Delete Vehicles'
      ],
      currUser: {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
        role: this.user.role,
        permissions: this.user.permissions,
      },
      newPermissions: []
    };
  },
  props: ["setEditingUser", "user", 'updateUser', 'index'],
  methods: {
    cancelUpdate() {
      this.updateUser(this.user, this.index);
      this.setEditingUser(false);
    },
    submitUser() {
      // simple validation checks
      if (this.currUser.first_name == '' || this.currUser.last_name == '') {
        this.showError('Staff account must have a valid first and last name.');
      } else {
        // send the put request using axios
        const data = this.currUser;
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
            this.updateUser(response.data.payload, this.index);
            this.setEditingUser(false);
          } else {
            console.log(response);
            this.showError('Incomplete or invalid fields.')
          }
        })
        .catch((err) => {
          console.log(err);
          this.showError('Error updating staff account information.')
        });
      }
    },
    isPermissionSelected(permission) {
      const index = this.currUser.permissions.indexOf(permission);
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
      this.currUser.permissions.push(permission);
    },
    removePermission(permission) {
      const index = this.currUser.permissions.indexOf(permission);
      this.currUser.permissions.splice(index, 1);
    },
    setDefaultSelected() {
      this.currUser.permissions = [];
      this.currUser.permissions = this.getDefaultSelected();
    },
    getDefaultSelected() {
      switch (this.currUser.role) {
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
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000)
    }
  },
};
</script>