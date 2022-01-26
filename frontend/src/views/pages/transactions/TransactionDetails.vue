<template>
  <div>
     <CForm @submit.prevent="submit">
       <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Sales Representative:"
                :lazy="false"
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
        <CRow class="justify-content-center"
        v-if="saleDetail['Approved By']!='Not approved'">
            <CCol>
                <CInput
                label="Approved By"
                :lazy="false"
                :placeholder="saleDetail['Approved By']"
                :Disabled="true"
                />
            </CCol>
            <CCol>
              <CInput
              label="Approval Date:"
              :lazy="false"
              :value="saleDetail['Approval Date']"
              :Disabled="true"
              />
            </CCol>
        </CRow>
        <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Delivery Status:"
                :lazy="false"
                :placeholder="saleDetail['Delivery Status']"
                :Disabled="true"
                />
            </CCol>
            <CCol>
              <CInput
              label="Delivery Date:"
              :lazy="false"
              :value="saleDetail['Delivery Date']"
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
            @click="approveSale"
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
      disableButtons: false,
      saleObject: null,
    }
  },
  methods: {
    approveSale () {
      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getFullYear() + "-" + date_ob.getMonth() + 1 + "-" + date_ob.getDate();
      // prints date & time in YYYY-MM-DD format
      axios({
          method: 'PUT',
          url: `${this.$store.state.api}/inventory/details/sale/${this.saleDetail.id}`,
          headers: {
            'Authorization': `Bearer ${this.$store.state.auth.token}`
          },
          data: {
            approved_by: this.$store.state.auth.userId,
            date_approved: date,
          }
      }).then(response => {
          if (response.data.success) {
            console.log(response.data.payload);
            this.saleDetail['Approved By'] = this.$store.state.auth.firstName + " " + this.$store.state.auth.lastName;
            this.saleDetail['Approval Date'] = date;
            this.setNewSale(this.saleDetail);
            this.setTransactionModal(false);
            this.showMessage("The sale has been approved", "success");
          }
      }).catch(error => {
          console.log(error);
          this.showMessage(error.response.data.error, "danger");
      })
    },
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
            this.saleObject = response.data.payload;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    markVehicleDelivered() {
      let body = this.saleObject.vehicle;
      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getFullYear() + "-" + date_ob.getMonth() + 1 + "-" + date_ob.getDate();
      body.delivered = true;
      body.date_delivered = date;
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
            this.saleDetail['Delivery Date'] =  date;
            this.setNewSale(this.saleDetail);
            this.setTransactionModal(false);
            this.showMessage("Vehicle has been marked as delivered", "success");
          }
        })
        .catch((err) => {
          console.log(err);
          this.showMessage("Error occured while updating vehicle delivery status", "danger");
        });
    },
  },
  mounted() {
    this.getSale();
  }
}
</script>