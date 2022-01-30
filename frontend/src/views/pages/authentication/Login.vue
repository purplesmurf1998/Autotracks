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
                    id="email-txt-field"
                    placeholder="Email"
                    autocomplete="username email"
                    v-model="email"
                  >
                    <template #prepend-content><CIcon name="cib-mail-ru"/></template>
                  </CInput>
                  <CInput
                    id="password-txt-field"
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    v-model="password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" type="submit" id="login-btn">Login</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0" id="forgot-pswrd-btn">Forgot password?</CButton>
                    </CCol>
                  </CRow>
                  <CAlert v-if="errorMessage" color="danger" class="mt-2">{{ errorMessage }}</CAlert>
                </CForm>
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
      errorMessage: null
    }
  },
  methods: {
    async submitForm () {
      // try submitting the info after basic validatio procedures
      if (this.email == '' || this.password == '') {
        this.showError('Please enter valid credentials.');
      } else {
        // log user in using the vuex store
        const payload = {
          email: this.email,
          password: this.password
        }

        const res = await this.$store.dispatch('login', payload);
        if (res.success) {
          this.$router.push('/dashboard');
        } else {
          this.showError(res.message);
        }
      }
    },
    showError (error) {
      this.errorMessage = error;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000)
    },
    }
  }
</script>
