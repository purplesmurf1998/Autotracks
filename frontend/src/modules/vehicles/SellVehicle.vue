<template>
  <div>
    <CAlert show color="danger" v-if="errorMessage" class="mb-2">{{ errorMessage }}</CAlert>
     <CForm @submit.prevent="submit">
        <CRow class="justify-content-center">
            <CCol>
                <CSelect
                label="Sales representative"
                :options="dealershipStaff"
                :value.sync="form.stafUser"
                placehoder="Select a sales rep"
                />
            </CCol>
        </CRow>

        <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Enter the sale amount:"
                :options="dealershipStaff"
                :value.sync="form.saleAmount"
                placeholder="$0.00"
                />
            </CCol>
            <CCol>
                <CInput
                label="Enter the deposit amount:"
                :options="dealershipStaff"
                :value.sync="form.deposit"
                placeholder="$0.00"
                />
            </CCol>
        </CRow>
        
        <CRow class="justify-content-center">
        <CButton 
          color="primary"
          type="submit"
          id = "sell-vehicle"
          :disabled="disableButtons"
        >
          Create
        </CButton>
        <CButton 
          class="ml-1"
          color="danger"
          :disabled="disableButtons"
          @click="setSellVehicle(false)"
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
  name: 'VehicleSell',
  props: ["setVehicleSoldPending", "selectedStaffAccount", "dealershipStaff", "showingSoldModal", "setSellVehicle"],
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
          this.showErrorMessage(error.response.data.error);
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
    },
    setVehicleSoldPending(state) {
      let body = {
        soldBy: state ? this.selectedStaffAccount : null,
      };
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/inventory/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: body,
      })
        .then((response) => {
          if (response.data.success) {
            this.setNewVehicle(response.data.payload);
            this.showingSoldModal = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.showError("Error occured while setting vehicle sale status");
        });
    },
  }
}
</script>