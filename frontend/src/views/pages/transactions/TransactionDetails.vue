<template>
  <div>
     <CForm @submit.prevent="submit">
       <CRow class="justify-content-center">
            <CCol>
                <CSelect
                label="Sales Representative"
                :lazy="false"
                :value.sync="sales_rep"
                :placeholder="saleDetail['Sales Rep']"
                :Disabled="true"
                />
            </CCol>
            <CCol>
              <CInput
              label="Request Date:"
              :lazy="false"
              :value="saleDetail['Request Date']"
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
            v-if="saleDetail['Approved By']=='Not approved'"
            class="ml-3"
            color="success"
            id="approve_sale"
          >
          Approve Sale
          </CButton>
          <CButton
            v-if="saleDetail['Delivery Status']!='Delivered' && saleDetail['Approved By']!='Not approved'"
            class="ml-3"
            color="primary"
            id="set_delivered"
            @click="markVehicleDelivered"
          >
          Mark as Delivered
          </CButton>
          <CButton
            v-if="saleDetail['Delivery Status']!='Delivered' && saleDetail['Approved By']=='Not approved'"
            class="ml-3"
            color="secondary"
            id="edit_sale"
            @click="markVehicleDelivered"
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
    "saleDetail", 
    "setTransactionModal",
    "setNewSale", 
  ],
  data() {
    return {
      // form: this.getEmptyForm(),
      submitted: false,
      disableButtons: false,
      saleObject: null,
      sales_rep: "test",
      date_of_sale: '',
      delivery_status: '',
    }
  },
  methods: {
    // updateSale() {
    //   this.disableButtons = true;
    //   // PUT request to API to update the vehicle
    //   axios({
    //       method: 'PUT',
    //       url: `${this.$store.state.api}/inventory/details/sale/${this.sale._id}`,
    //       headers: {
    //           'Authorization': `Bearer ${this.$store.state.auth.token}`
    //       },
    //       data: {
    //           dealership: this.vehicle.dealership,
    //           vehicle: this.vehicle._id,
    //           deposit_amount: this.form.deposit,
    //           sale_amount: this.form.saleAmount,
    //           sales_rep: this.form.staffUser,
    //           notes: this.form.notes,
    //       }
    //   }).then(response => {
    //       if (response.data.success) {
    //         this.showMessage("The sale request has been updated", "success");
    //         this.setVehicleModal(false);
    //         this.setSaleStatus(true, response.data.payload);
    //         this.showMessage("The sale request has been updated", "success");
    //       }
    //   }).catch(error => {
    //       console.log(error);
    //       this.showMessage(error.response.data.error, "danger");
    //       this.disableButtons = false;
    //   })
    // },
    getSale() {
      console.log(this.saleDetail);
        axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/details/sale/${this.saleDetail.id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            console.log("Success");
            this.saleObject = response.data.payload;
            console.log(this.saleDetail);
            console.log(this.saleObject);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    markVehicleDelivered() {
      let body = this.saleObject.vehicle;
      body.delivered = true;
      console.log(body);
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/inventory/vehicle/${body._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: body,
      })
        .then((response) => {
          if (response.data.success) {
            console.log(response.data.payload);
            this.saleDetail['Delivery Status'] = "Delivered";
            this.setNewSale(this.sale);
            this.setTransactionModal(false);
            this.showMessage("Vehicle has been marked as delivered", "success");
          }
        })
        .catch((err) => {
          console.log(err);
          this.showMessage("Error occured while updating vehicle delivery status", "danger");
        });
    },
    // getEmptyForm () {
    //   return {
    //     dealership: null,
    //     vehicle: null,
    //     deposit_amount: 0,
    //     sale_amount: 0,
    //     sales_rep: null,
    //     notes: "",
    //   }
    // },
  },
  mounted() {
    this.getSale();
    this.sales_rep = this.saleDetail['Sales Rep'];
  }
}
</script>