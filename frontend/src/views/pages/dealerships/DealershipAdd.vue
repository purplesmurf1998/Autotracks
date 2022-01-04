<template>
  <div>
    <CAlert show color="danger" v-if="errorMessage" class="mb-2">{{ errorMessage }}</CAlert>
    <CForm @submit.prevent="submit">
      <CInput
        label="Dealership Name"
        :lazy="false"
        :value.sync="form.name"
        placeholder="Dealership Name"
      />

      <CTextarea
        label="Dealership Description"
        :lazy="false"
        :value.sync="form.description"
        placeholder="Dealership Description"
        rows="6"
      />
      <CRow class="justify-content-center">
        <CButton 
          color="primary"
          type="submit"
          id = "create-dealership"
          :disabled="disableButtons"
        >
          Create
        </CButton>
        <CButton 
          class="ml-1"
          color="danger"
          :disabled="disableButtons"
          @click="setAddingDealership(false)"
        >
          Cancel
        </CButton>
      </CRow>
    </CForm>
  </div>
</template>

<script>
const axios = require('axios');

export default {
  name: 'DealershipAdd',
  props: ["setAddingDealership"],
  data() {
    return {
      form: this.getEmptyForm(),
      submitted: false,
      errorMessage: null,
      disableButtons: false
    }
  },
  methods: {
    checkIfValid () {
      return !!this.form.name && this.form.name != '';
    },
    submit () {
      this.disableButtons = true;
      if (this.checkIfValid()) {
        // post request to API to create the new dealership
        axios({
          method: 'POST',
          url: `${this.$store.state.api}/dealerships`,
          headers: {
            'Authorization': `Bearer ${this.$store.state.auth.token}`
          },
          data: {
            name: this.form.name,
            description: this.form.description,
            admin: this.form.admin
          }
        }).then(response => {
          if (response.data.success) {
            this.$router.go();
          }
        }).catch(error => {
          this.showErrorMessage(err.response.data.error);
          this.disableButtons = false;
        })
      } else {
        this.showErrorMessage('Must have a proper dealership name.');
        this.disableButtons = false;
      }
    },
    getEmptyForm () {
      return {
        name: "",
        description: "",
        admin: this.$store.state.auth.userId
      }
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000)
    }
  }
}
</script>