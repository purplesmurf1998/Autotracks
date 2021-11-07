<template>
  <CCard class="mx-4 mb-0">
    <CCardBody class="p-4">
      <h1>Step 3: Register users!</h1>
      <p class="text-muted">Register user account(s) with specific roles for your staff here.</p>
      <CRow>
        <CCol>
          <CForm @submit.prevent="submitUser">
            <p class="text-muted">**IMPORTANT: Passwords will be automatically generated. Users will be prompted to change their password upon first login.</p>
            <CRow>
              <CCol>
                <CLabel>First Name</CLabel>
                <CInput
                  placeholder="ex. John"
                  autocomplete="firstName"
                  v-model="currFirstName"
                />
              </CCol>
              <CCol>
                <CLabel>Last Name</CLabel>
                <CInput
                  placeholder="ex. Doe"
                  autocomplete="lastName"
                  v-model="currLastName"
                />
              </CCol>
            </CRow>
            <CLabel>Email</CLabel>
            <CInput
              placeholder="ex. john.doe@mail.com"
              autocomplete="email"
              v-model="currEmail"
            />
            <CLabel>Account Role</CLabel>
            <CSelect
              :options="options"
              placeholder="Select the account role"
              v-model="currRole"
            />
            <CRow class="d-flex justify-content-center">
              <CButton color="success" type="submit">Create Account</CButton>
            </CRow>
          </CForm>
        </CCol>
        <CCol v-if="users.length > 0">
          <user-card v-for="(user, index) in users" :key="user.email" :user="user" :index="index" :removeUser="removeUser"/>
        </CCol>
        <CCol v-if="users.length == 0" class="d-flex align-items-center">
          <p class="text-center text-muted" style="width: 100%">Created user will appear here</p>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import UserCard from "./UserCard.vue"

export default {
  data() {
    return {
      options: ['Management', 'Sales', 'Reception', 'Backshop'],
      currFirstName: '',
      currLastName: '',
      currEmail: '',
      currRole: ''
    }
  },
  props: ['users'],
  components: {
    'user-card': UserCard
  },
  methods: {
    submitUser () {
      console.log(this.currRole.target.value);
      const newUser = {
        first_name: this.currFirstName,
        last_name: this.currLastName,
        email: this.currEmail,
        role: this.currRole.target.value
      }
      this.users.push(newUser);
      this.currFirstName = '';
      this.currLastName = '';
      this.currEmail = '';
      this.currRole.target.value = ''
    },
    removeUser (index) {
      this.users.splice(index, 1);
    }
  }
}
</script>