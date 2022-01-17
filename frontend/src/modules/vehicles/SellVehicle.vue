<template>
  <div>
    <CAlert show color="danger" v-if="errorMessage" class="mb-2">{{ errorMessage }}</CAlert>
     <CForm @submit.prevent="submit">
        <CRow class="justify-content-center">
            <CCol>
                <CSelect
                label="Sales representative"
                :lazy="false"
                :options="dealershipStaff"
                :value.sync="form.staffUser"
                placeholder="Select a sales rep"
                />
            </CCol>
        </CRow>

        <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Enter the sale amount:"
                :lazy="false"
                :options="dealershipStaff"
                :value.sync="form.saleAmount"
                placeholder="$0.00"
                >
                <template #prepend-content><CIcon name="cil-dollar" /></template>
                </CInput>
            </CCol>
            <CCol>
                <CInput
                label="Enter the deposit amount:"
                :lazy="false"
                :options="dealershipStaff"
                :value.sync="form.deposit"
                placeholder="$0.00"
                >
                <template #prepend-content><CIcon name="cil-dollar" /></template>
                </CInput>
            </CCol>
        </CRow>
        <CRow class="justify-content-center">
            <CCol>
                <CTextarea
                label="Notes"
                :lazy="false"
                :value.sync="form.notes"
                placeholder="Add notes..."
                rows="6"
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
  props: ["setVehicleSoldPending", "selectedStaffAccount", "dealershipStaff", "showingSoldModal", "setSellVehicle", "vehicle"],
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
        // post request to API to create the new dealership
        axios({
            method: 'POST',
            url: `${this.$store.state.api}/inventory/details/sell`,
            headers: {
                'Authorization': `Bearer ${this.$store.state.auth.token}`
            },
            data: {
                dealership: this.vehicle.dealership,
                vehicle: this.vehicle._id,
                deposit_amount: this.form.deposit,
                sale_amount: this.form.saleAmount,
                sales_rep: this.form.staffUser,
                notes: this.form.notes,
            }
        }).then(response => {
            if (response.data.success) {
                this.setSellVehicle(false)
            }
        }).catch(error => {
            console.log(error);
            this.showErrorMessage(error.response.data.error);
            this.disableButtons = false;
        })
    },
    getEmptyForm () {
      return {
        dealership: null,
        vehicle: null,
        deposit_amount: 0,
        sale_amount: 0,
        sales_rep: null,
        notes: "",
      }
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000)
    },
    // setVehicleSoldPending(state) {
    //   let body = {
    //     soldBy: state ? this.selectedStaffAccount : null,
    //   };
    //   axios({
    //     method: "PUT",
    //     url: `${this.$store.state.api}/inventory/vehicle/${this.vehicle._id}`,
    //     headers: {
    //       Authorization: `Bearer ${this.$store.state.auth.token}`,
    //     },
    //     data: body,
    //   })
    //     .then((response) => {
    //       if (response.data.success) {
    //         this.setNewVehicle(response.data.payload);
    //         this.showingSoldModal = false;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.showError("Error occured while setting vehicle sale status");
    //     });
    // },
  }
}
</script>