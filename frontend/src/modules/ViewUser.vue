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
    <CRow>
      <CCol>
        <p class="text-muted mb-0">Permissions:</p>
      </CCol>
      <CCol class="d-flex align-items-end flex-column">
        <CRow
          v-for="permission in user.permissions"
          :key="permission"
          class="mr-0"
          ><p class="text-muted mb-0">
            {{ permission }}
          </p></CRow
        >
      </CCol>
    </CRow>
    <CRow class="d-flex justify-content-start mt-3 px-3 mb-2">
      <CButton color="secondary" class="mr-2" @click="setEditingUser(true)"
        >Edit account details</CButton
      >
    </CRow>
    <a class="remove-link ml-1 mt-2" @click="removeUser(index)" href="#"
      >Delete staff account</a
    >
  </div>
</template>

<script>
const axios = require("axios");

export default {
  props: ["user", "setEditingUser"],
  data() {
    return {};
  },
  methods: {
    removeUser() {
      console.log("remove user" + user._id);
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