 <template>
  <CCard class="mx-4 mb-0">
    <CCardBody class="p-4">
      <CForm>
        <h1>Step 1: Register new account!</h1>
        <p class="text-muted">This account will be the admin account to the dealership.</p>
        <CRow>
          <CCol>
            <CLabel>First Name</CLabel>
            <CInput
              placeholder="ex. John"
              autocomplete="username"
              v-model="adminUser.adminFirstName"
              @keyup="$emit('update:adminUser.adminFirstName', adminUser.adminFirstName);"
            />
          </CCol>
          <CCol>
            <CLabel>Last Name</CLabel>
            <CInput
              placeholder="ex. Doe"
              autocomplete="username"
              v-model="adminUser.adminLastName"
              @keyup="$emit('update:adminUser.adminLastName', adminUser.adminLastName);"
            />
          </CCol>
        </CRow>
        <CLabel>Email</CLabel>
        <CInput
          placeholder="ex. john.doe@mail.com"
          autocomplete="email"
          v-model="adminUser.adminEmail"
          @keyup="$emit('update:adminUser.adminEmail', adminUser.adminEmail);"
        />
        <CLabel>Password</CLabel>
        <CInput
          placeholder="ex. password1234"
          type="password"
          autocomplete="new-password"
          v-model="adminUser.adminPassword"
          @keyup="$emit('update:adminUser.adminPassword', adminUser.adminPassword);"
        />
        <CLabel>Confirm Password</CLabel>
        <CInput
          placeholder="ex. password1234"
          type="password"
          autocomplete="new-password"
          v-model="adminUser.adminConfirmPassword"
          @keyup="$emit('update:adminUser.adminConfirmPassword', adminUser.adminConfirmPassword);"
        />
        <CLabel>Account Role</CLabel>
        <CInput
          value="Administration"
          disabled
        />
      </CForm>
    </CCardBody>
    <!-- <CCardFooter class="p-4">
      <CRow>
        <CCol col="6">
          <CButton block color="facebook">
            Facebook
          </CButton>
        </CCol>
        <CCol col="6">
          <CButton block color="twitter">
            Twitter
          </CButton>
        </CCol>
      </CRow>
    </CCardFooter> -->
  </CCard>
</template>

<script>
export default {
  props: ['adminUser']
}
</script>
