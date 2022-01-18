<template>
  <div>
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
            color="secondary"
            :disabled="disableButtons"
            @click="setVehicleModal(false)"
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
  props: [
    "showMessage", 
    "selectedStaffAccount", 
    "dealershipStaff", 
    "showingSoldModal", 
    "setVehicleModal", 
    "vehicle", 
    "setSaleStatus", 
    "updateSaleStatus",
  ],
  data() {
    return {
      form: this.getEmptyForm(),
      submitted: false,
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
            url: `${this.$store.state.api}/inventory/details/sale`,
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
              this.showMessage("A sale request has been submitted", "success");
                this.setVehicleModal(false);
                this.setSaleStatus(true, response.data.payload._id);
                this.showMessage("A sale request has been submitted", "success");
            }
        }).catch(error => {
            console.log(error);
            this.showMessage(error.response.data.error, "danger");
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
  }
}
</script>