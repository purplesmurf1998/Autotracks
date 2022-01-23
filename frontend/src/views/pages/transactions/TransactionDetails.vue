<template>
  <div>
     <CForm @submit.prevent="submit">
       <CRow class="justify-content-center">
            <CCol>
                <CSelect
                label="Sales Representative"
                :lazy="false"
                :value.sync="sales_rep"
                :placeholder="sale['Sales Rep']"
                :Disabled="true"
                />
            </CCol>
            <CCol>
              <CInput
              label="Request Date:"
              :lazy="false"
              :value="sale['Request Date']"
              :Disabled="true"
              />
            </CCol>
        </CRow>
        <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Sale Amount:"
                :lazy="false"
                :value="saleObject.sale_amount + '.00'"
                :Disabled="true"
                >
                <template #prepend-content><CIcon name="cil-dollar" /></template>
                </CInput>
            </CCol>
            <CCol>
                <CInput
                label="Deposit Amount:"
                :lazy="false"
                :value="saleObject.deposit_amount + '.00'"
                :Disabled="true"
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
                :value="saleObject.notes"
                placeholder="Add notes..."
                rows="6"
                :Disabled="true"
                />
            </CCol>
        </CRow>
        <CRow>
          <CButton
            class="ml-3"
            color="success"
            id="approve_sale"
          >
          Approve Sale
          </CButton>
          <CButton
            class="ml-3"
            color="primary"
            id="approve_sale"
          >
          Mark as Delivered
          </CButton>
          <CButton
            class="ml-3"
            color="secondary"
            id="approve_sale"
          >
          Edit
          </CButton>
        </CRow>
      </CForm>
  </div>
</template>

<script>
const axios = require('axios');

export default {
  name: 'transactionDetails',
  props: [
    "showMessage", 
    "sale", 
    "setTransactionModal", 
  ],
  data() {
    return {
      form: this.getEmptyForm(),
      submitted: false,
      disableButtons: false,
      saleObject: null,
      sales_rep: "test",
      date_of_sale: '',
      delivery_status: '',

    }
  },
  methods: {
    checkIfValid () {
      return !!this.form.name && this.form.name != '';
    },
    // submit () {
    //     this.disableButtons = true;
    //     // post request to API to create the new sale instance
    //     axios({
    //         method: 'POST',
    //         url: `${this.$store.state.api}/inventory/details/sale`,
    //         headers: {
    //             'Authorization': `Bearer ${this.$store.state.auth.token}`
    //         },
    //         data: {
    //             dealership: this.vehicle.dealership,
    //             vehicle: this.vehicle._id,
    //             deposit_amount: this.form.deposit,
    //             sale_amount: this.form.saleAmount,
    //             sales_rep: this.form.staffUser,
    //             notes: this.form.notes,
    //         }
    //     }).then(response => {
    //         if (response.data.success) {
    //           this.setVehicleModal(false);
    //           this.setSaleStatus(true, response.data.payload);
    //           this.showMessage("A sale request has been submitted", "success");
    //         }
    //     }).catch(error => {
    //         console.log(error);
    //         this.setVehicleModal(false);
    //         this.showMessage(error.response.data.error, "danger");
    //         this.disableButtons = false;
    //     })
    // },
    updateSale() {
      this.disableButtons = true;
      // PUT request to API to update the vehicle
      axios({
          method: 'PUT',
          url: `${this.$store.state.api}/inventory/details/sale/${this.sale._id}`,
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
            this.showMessage("The sale request has been updated", "success");
            this.setVehicleModal(false);
            this.setSaleStatus(true, response.data.payload);
            this.showMessage("The sale request has been updated", "success");
          }
      }).catch(error => {
          console.log(error);
          this.showMessage(error.response.data.error, "danger");
          this.disableButtons = false;
      })
    },
    getSale() {
        axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/details/sale/${this.sale.id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            console.log("Success");
            this.saleObject = response.data.payload;
            console.log(this.sale);
            console.log(this.saleObject);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
  },
  mounted() {
    this.getSale();
    this.sales_rep = sale['Sales Rep'];
  }
}
</script>