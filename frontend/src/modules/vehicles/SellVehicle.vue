<template>
  <div>
   <CAlert :color="messageType" v-if="!!message">{{ message }}</CAlert>
     <CForm @submit.prevent="submit">
        <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Sales representative:"
                :lazy="false"
                :placeholder="sales_rep"
                :disabled="true"
                />
            </CCol>
            <CCol v-if="!canUserApprove">
                <CSelect
                label="Select manager:"
                :lazy="false"
                :options="dealershipStaff"
                :value.sync="form.manager"
                placeholder="Select a manager"
                />
            </CCol>
        </CRow>

        <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Enter the sale amount:"
                :lazy="false"
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
                label="Notes:"
                :lazy="false"
                :value.sync="form.notes"
                placeholder="Add notes..."
                rows="6"
                />
            </CCol>
        </CRow>
        <CRow class="justify-content-center">
          <CButton
            v-if="!updateSaleStatus"
            color="primary"
            type="submit"
            id = "sell-vehicle"
            :disabled="disableButtons"
          >
            {{canUserApprove ? 'Create and approve' : 'Create'}}
          </CButton>
          <CButton
            v-if="updateSaleStatus"
            color="primary"
            id = "update-vehicle"
            :disabled="disableButtons"
            @click="updateSale"
          >
            Update
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
const { showMessage } = require("../../utils/index");

export default {
  name: 'VehicleSell',
  props: [
    "selectedStaffAccount",
    "dealershipStaff",
    "showingSoldModal",
    "setVehicleModal",
    "vehicle",
    "setSaleStatus",
    "updateSaleStatus",
    "sale_id",
    "messageObj"
  ],
  data() {
    return {
      form: this.getEmptyForm(),
      submitted: false,
      disableButtons: false,
      sales_rep: this.$store.state.auth.firstName + " " + this.$store.state.auth.lastName,
      message: null,
      messageType: null,
    }
  },
  computed: {
    canUserApprove() {
      const role = this.$store.state.auth.role;
      return role === "Administration" || role === "Management"
    }
  },
  methods: {
    checkIfValid () {
      return !!this.form.name && this.form.name != '';
    },
    submit () {
        this.disableButtons = true;
        // post request to API to create the new sale instance
        const approved_by = this.canUserApprove ? this.$store.state.auth.userId : this.form.manager;
        const date_approved = this.canUserApprove ? Date.now() : null;
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
                sales_rep: this.$store.state.auth.userId,
                approved_by,
                date_approved,
                notes: this.form.notes,
            }
        }).then(response => {
            if (response.data.success) {
              showMessage("A sale request has been submitted", "success", this.messageObj);
              this.setVehicleModal(false);
              this.setSaleStatus(true, response.data.payload);
            }
        }).catch(error => {
            console.log(error);
            this.showMessage(error.response.data.error, "danger");
            this.disableButtons = false;
        })
    },
    updateSale() {
      this.disableButtons = true;
      // PUT request to API to update the vehicle
      axios({
          method: 'PUT',
          url: `${this.$store.state.api}/inventory/details/sale/${this.sale_id}`,
          headers: {
              'Authorization': `Bearer ${this.$store.state.auth.token}`
          },
          data: {
              deposit_amount: this.form.deposit,
              sale_amount: this.form.saleAmount,
              approved_by: this.form.manager,
              notes: this.form.notes,
          }
      }).then(response => {
          if (response.data.success) {
            this.showMessage("The sale request has been updated", "success");
            this.setVehicleModal(false);
            this.setSaleStatus(true, response.data.payload);
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
        notes: "",
        manager: null,
      }
    },
    showMessage(message, messageType) {
      this.message = message;
      this.messageType = messageType;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
        }, 5000);
    },
  }
}
</script>
