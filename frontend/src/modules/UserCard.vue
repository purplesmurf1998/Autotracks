<template>
  <CCard>
    <CCardBody class="p-3">
      <h6>{{ user.first_name }} {{ user.last_name }}</h6>
      <a class="remove-link" @click="removeUser(index)" href="#"
        >Delete staff account</a
      >
      <p class="text-muted mb-0">Role: {{ user.role }}</p>
      <p class="text-muted mb-0">Email: {{ user.email }}</p>
      <CRow class="d-flex justify-content-start mt-3 px-3">
        <CButton color="primary" class="mr-2" @click="setEditUser"
          >Edit</CButton
        >
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
export default {
  props: ["user"],
  methods: {
    removeUser() {
      console.log("remove user" + user._id);
    },
    setEditUser() {},
  },
};
</script>

<style scoped>
.remove-link {
  color: red;
}
</style>