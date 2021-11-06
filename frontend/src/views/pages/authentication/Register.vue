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
import RegisterAdmin from "./../../../modules/RegisterAdmin.vue";
const got = require('got');

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
    async completeRegistration () {
      const body = await got.post('http://localhost:5000/api/v1/auth/register', {
        json: {
          first_name: this.adminFirstName,
          last_name: this.adminLastName,
          email: this.adminEmail,
          role: "Administration",
          permissions: [
            "Add Dealerships",
            "View Dealerships",
            "Edit Dealerships",
            "Delete Dealerships",
            "Add Staff Users",
            "View Staff Users",
            "Edit Staff Users",
            "Delete Staff Users",
            "Add Vehicles",
            "View Vehicles",
            "Edit Vehicle Properties",
            "Edit Vehicle Locations",
            "Sell Vehicles",
            "Delete Vehicles"
          ],
          password: this.adminPassword
        },
        responseType: 'json'
      });
      console.log(body)
      await this.$router.push('/dashboard');
    },
  }
}
</script>
