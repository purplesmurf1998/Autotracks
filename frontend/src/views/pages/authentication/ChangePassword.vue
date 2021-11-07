<template>
  <div class="c-app flex-row align-items-center" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="submitForm">
                  <h1>Change your password</h1>
                  <p class="text-muted">Use a password you will remember</p>
                  <CInput
                    placeholder="Current Password"
                    type="password"
                    v-model="currentPassword"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CInput
                    placeholder="New Password"
                    type="password"
                    v-model="newPassword"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CInput
                    placeholder="Confirm New Password"
                    type="password"
                    v-model="confirmNewPassword"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow class="d-flex justify-content-center">
                    <CButton color="primary" class="px-4 mr-3" type="submit">Confirm password reset</CButton>
                    <CButton color="link" class="px-0" @click="logoutUser">Logout</CButton>
                  </CRow>
                </CForm>
                <CAlert show color="danger" v-if="errorMsg" class="mt-2">{{ errorMsg }}</CAlert>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      errorMsg: null
    }
  },
  methods: {
    async submitForm () {
      if (this.currentPassword == '' || this.newPassword == '' || this.confirmNewPassword == '') {
        this.showError('Incorrect input. All fields must have a value.');
      } else if (this.newPassword != this.confirmNewPassword) {
        this.showError('New password must match');
      } else {
        // try to log the user in using the vuex store
        const response = await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        });
        
        // if not successful, show the error message
        if (!response.success) {
          this.showError(response.message);
        } 
        // if successful, redirect the user to the dashboad
        else {
          this.$router.push("/dashboard");
        }
      }
    },
    logoutUser() {
      this.$store.dispatch('logout');
      this.$router.push('/pages/login');
    },
    showError (errorMsg) {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.errorMsg = errorMsg;
      setTimeout(() => {
        this.errorMsg = null;
      }, 4000)
    },
  }
}
</script>
