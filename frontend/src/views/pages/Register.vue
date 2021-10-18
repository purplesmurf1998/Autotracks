<template>
  <div class="c-app d-flex align-items-center min-vh-100" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CButton color="secondary" class="mx-4 mb-2" @click="goBack">
            Back
          </CButton>
          <register-admin v-if="registerStep == 1" :adminUser.sync="adminUser"/>
          <edit-dealership v-if="registerStep == 2" :dealershipAccount.sync="dealershipAccount"/>
          <edit-users v-if="registerStep == 3" :users.sync="userList"/>
          <CRow class="mt-2 d-flex justify-content-center">
            <CButton color="primary" @click="nextStep" v-if="registerStep < 3">
              Next Step
            </CButton>
            <CButton color="primary" @click="completeRegistration" v-if="registerStep == 3">
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
import EditDealership from "../../modules/EditDealership.vue";
import EditUsers from "../../modules/EditUsers.vue";

export default {
  name: 'Register',
  components: {
    'register-admin': RegisterAdmin,
    'edit-dealership': EditDealership,
    'edit-users': EditUsers
  },
  data() {
    return {
      registerStep: 1,
      // register admin field values
      adminUser: {
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPassword: '',
        adminConfirmPassword: ''
      },
      // dealership field values
      dealershipAccount: {
        dealershipName: '',
        dealershipDescription: ''
      },
      userList: []
    }
  },
  methods: {
    goBack () {
      if (this.registerStep == 1) {
        this.$router.push('/pages/login');
      } else {
        this.registerStep = this.registerStep - 1;
      }
    },
    nextStep () {
      this.registerStep = this.registerStep + 1;
    },
    completeRegistration () {
      this.$router.push('/dashboard');
    }
  }
}
</script>
