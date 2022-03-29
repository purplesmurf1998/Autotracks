<template>
  <div>
    <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
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
      <CInput
        label="Email"
        horizontal
        v-model="currUser.email"
        disabled="true"
      />
      <CSelect
        label="Role"
        :options="roles"
        horizontal
        :value.sync="currUser.role"
      />
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
  name: 'EditDealership',
  props: {
      currUser: {
        type: Object,
        default: function(){
        return{};
      }
    }
  },
  data() {
    return {
      disableButtons: false,
      errorMessage: null,
      roles: [
        "Management",
        "Sales Rep",
        "Reception",
      ],
      currUser: {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
        role: this.user.role,
      },
    };
  },
  props: ["setEditingUser", "user", "updateUser", "index"],
  methods: {
    cancelUpdate() {
      this.updateUser(this.user, this.index);
      this.setEditingUser(false);
    },
    submitUser() {
      // simple validation checks
      if (this.currUser.first_name == "" || this.currUser.last_name == "") {
        this.showError("Staff account must have a valid first and last name.");
      } else {
        // send the put request using axios
        const data = this.currUser;
        axios({
          method: "PUT",
          url: `${this.$store.state.api}/users/${this.user._id}`,
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
              this.showError("Incomplete or invalid fields.");
            }
          })
          .catch((error) => {
            console.log(error);
            this.showError("Error updating staff account information.");
          });
      }
    },
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
  },
};
</script>