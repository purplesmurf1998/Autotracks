<template>
  <div class="c-app d-flex align-items-center min-vh-100" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CButton color="secondary" class="mx-4 mb-2" @click="goBack">
            Back
          </CButton>
          <!-- Register admin component -->
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Step 1: Register new account!</h1>
                <p class="text-muted">This account will be the admin account to the dealership.</p>
                <CRow>
                  <CCol>
                    <CInput
                      id="first-name-txt-field"
                      label="First Name"
                      placeholder="ex. John"
                      autocomplete="username"
                      v-model="adminUser.adminFirstName"
                    />
                  </CCol>
                  <CCol>
                    <CInput
                      id="last-name-txt-field"
                      label="Last Name"
                      placeholder="ex. Doe"
                      autocomplete="username"
                      v-model="adminUser.adminLastName"
                    />
                  </CCol>
                </CRow>
                <CInput
                  id="email-txt-field"
                  label="email"
                  placeholder="ex. john.doe@mail.com"
                  autocomplete="email"
                  v-model="adminUser.adminEmail"
                />
                <CInput
                  id="password-txt-field"
                  label="Password"
                  placeholder="password"
                  type="password"
                  autocomplete="new-password"
                  v-model="adminUser.adminPassword"
                />
                <CInput
                  id="confirm-password-txt-field"
                  label="Confirm Password"
                  placeholder="confirm password"
                  type="password"
                  autocomplete="new-password"
                  v-model="adminUser.adminConfirmPassword"
                />
                <CInput
                  label="Account Role"
                  value="Administration"
                  disabled
                />
              </CForm>
            </CCardBody>
          </CCard>
          <CAlert show color="danger" v-if="errorMessage" class="mt-2">Invalid Credentials</CAlert>
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
const axios = require('axios');

export default {
  name: 'Register',
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
      errorMessage: null
    }
  },
  methods: {
    goBack () {
      this.$router.push('/pages/login');
    },
    async completeRegistration () {
      /**********************************************
       * used axios since from the documentation axios() and fetch() are the most
       * commonly used http request APIs for SPAs.
       *
       * I left the code used with got in case you wanted to fix it but I was getting
       * an undefined error and couldn't figure out how to fix it. I think a problem
       * with the import.
       *
       * TODO: add some validation check (password = confirmPassword) and visual feedback
       *       when a field is entered wrong or not entered at all.
      ***********************************************/

      // send request to register new user
      axios({
        method: 'POST',
        url: 'http://localhost:5000/api/v1/auth/register',
        data: {
          first_name: this.adminUser.adminFirstName,
          last_name: this.adminUser.adminLastName,
          email: this.adminUser.adminEmail,
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
          password: this.adminUser.adminPassword
        }
      }).then(async (response) => {
        console.log(response);
        //double check valid response
        if (response.status == 200) {
          // log the user in
          const response = await this.$store.dispatch('login', {
            email: this.adminUser.adminEmail,
            password: this.adminUser.adminPassword
          });

          // if not successful, show the error message
          if (!response.success) {
            this.showErrorMessage(response.message);
          }
          // if successful, redirect the user to the dashboad
          else {
            this.$router.push("/dashboard");
          }
        }
      }).catch(err => {
        console.log(err);
        // send an invalid registration message
        this.showErrorMessage('Invalid information or duplicate account.');
        this.adminUser.adminPassword = '';
        this.adminUser.adminConfirmPassword = '';
      })
    },
    showErrorMessage(msg) {
      // show the error message for 5 seconds and then dissapear
      this.errorMessage = msg;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000)
    }
  }
}
</script>
