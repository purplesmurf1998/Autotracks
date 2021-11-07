<template>
  <div class="c-app flex-row align-items-center" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="submitForm">
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    placeholder="Email"
                    autocomplete="username email"
                    v-model="email"
                    prepend="@"
                  />
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    v-model="password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" type="submit">Login</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
                      <CButton color="link" class="d-lg-none">Register now!</CButton>
                    </CCol>
                  </CRow>
                </CForm>

                <CAlert show color="danger" v-if="errorMsg" class="mt-2">Invalid Credentials</CAlert>
              </CCardBody>
            </CCard>
            <CCard
              color="primary"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <h2>Sign up</h2>

                <p>Sign up for an admin account and start tracking your inventory today! Get three users FREE when signing up for one year.</p>
                <router-link to="/pages/register">
                  <CButton
                    color="light"
                    variant="outline"
                    size="lg"
                  >
                    Register Now!
                  </CButton>
                </router-link>
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
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMsg: null
    }
  },
  methods: {
    async submitForm () {
      if (this.email == '' || this.password == '') {
        this.showError('Invalid credentials');
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
    showError (errorMsg) {
      this.password = '';
      this.errorMsg = errorMsg;
      setTimeout(() => {
        this.errorMsg = null;
      }, 4000)

    },
  }
}
</script>
