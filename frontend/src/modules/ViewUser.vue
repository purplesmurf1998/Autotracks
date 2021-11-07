<template>
  <div>
    <a class="remove-link" @click="removeUser(index)" href="#"
      >Delete staff account</a
    >
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
    <hr />
    <CRow>
      <CCol>
        <p class="text-muted mb-0">Password:</p>
      </CCol>
      <CCol class="d-flex flex-row-reverse">
        <p class="text-muted mb-0">**************</p>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <a class="account-password" href="#">View account password</a>
      </CCol>
    </CRow>
    <CRow class="d-flex justify-content-start mt-3 px-3">
      <CButton color="secondary" class="mr-2" @click="setEditingUser(true)"
        >Edit account details</CButton
      >
    </CRow>
  </div>
</template>

<script>
export default {
  props: ["user", "setEditingUser"],
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