<template>
  <CCard>
    <CCardBody class="p-3">
      <h6>{{ user.first_name }} {{ user.last_name }}</h6>
      <p class="text-muted mb-0">Role: {{ user.role }}</p>
      <p class="text-muted mb-0">Email: {{ user.email }}</p>
      <CRow class="d-flex justify-content-start mt-3 px-3">
        <CButton color="danger" @click="removeUser(index)">Remove</CButton>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
export default {
  props: ['user', 'index', 'removeUser']
}
</script>