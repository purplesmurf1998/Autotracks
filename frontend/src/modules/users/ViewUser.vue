<template>
  <div>
    <h6>{{ user.first_name }} {{ user.last_name }}</h6>

    <CRow>
      <CCol>
        <p class="text-muted mb-0">Role:</p>
      </CCol>
      <CCol class="d-flex flex-row-reverse">
        <p class="text-muted mb-0">{{ user.role }}</p>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <p class="text-muted mb-0">Email:</p>
      </CCol>
      <CCol class="d-flex flex-row-reverse">
        <p class="text-muted mb-0">{{ user.email }}</p>
      </CCol>
    </CRow>
    <hr />
    <CRow class="d-flex justify-content-start mt-3 px-3 mb-2">
      <CButton
        color="secondary"
        class="mr-2"
        id="edit-user-acc"
        @click="setEditingUser(true)"
        v-if="userHasRoles('Administration', 'Management')"
        :disabled="$store.state.auth.userId == user._id"
        >Edit account details</CButton
      >
    </CRow>
    <CButton
      color="danger"
      @click="
        () => {
          deletingUser = true;
        }
      "
      v-if="userHasRoles('Administration', 'Management')"
      >Delete staff account</CButton
    >
    <CModal :show.sync="deletingUser" :centered="true">
      <p>Are you sure you want to delete this staff account?</p>
      <template #header>
        <h6 class="modal-title">Delete this staff user?</h6>
        <CButtonClose
          @click="
            () => {
              deletingUser = false;
            }
          "
        />
      </template>
      <template #footer>
        <CButton @click="deletingUser = false" color="danger">Cancel</CButton>
        <CButton @click="removeUser" color="success">Confirm</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");
const { containsRoles } = require("../../utils/index");

export default {
  props: ["user", "setEditingUser"],
  data() {
    return {
      deletingUser: false,
    };
  },
  methods: {
    userHasRoles(...roles) {
      return containsRoles(roles);
    },
    removeUser() {
      axios({
        method: "DELETE",
        url: `${this.$store.state.api}/users/${this.user._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.$router.go();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/pages/404");
        });
    },
  },
};
</script>

<style>
.remove-link {
  color: red;
}
.account-password {
  color: blue;
}
</style>