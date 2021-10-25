<template>
  <div class="c-app d-flex align-items-center min-vh-100" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CButton color="secondary" class="mx-4 mb-2" @click="goBack">
            Back
          </CButton>
          <register-admin :adminUser.sync="adminUser"/>
          <CRow class="mt-2 d-flex justify-content-center">
            <CButton color="primary" @click="completeRegistration">
              Complete Registration
            </CButton>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import RegisterAdmin from "../../modules/RegisterAdmin.vue";

export default {
  name: 'Register',
  components: {
    'register-admin': RegisterAdmin,
  },
  data() {
    return {
      // register admin field values
      adminUser: {
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPassword: '',
        adminConfirmPassword: ''
      },
    }
  },
  methods: {
    goBack () {
      this.$router.push('/pages/login');
    },
    completeRegistration () {
      this.$router.push('/dashboard');
    }
  }
}
</script>
