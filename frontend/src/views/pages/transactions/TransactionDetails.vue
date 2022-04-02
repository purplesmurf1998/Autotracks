<template>
  <div>
     <CForm @submit.prevent="submit">
       <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Sales Representative:"
                :lazy="false"
                :placeholder="saleDetail['Sales Rep']"
                :disabled="true"
                />
            </CCol>
            <CCol>
              <CInput
              label="Request Date:"
              :lazy="false"
              :value="saleDetail['Request Date']"
              :disabled="true"
              />
            </CCol>
        </CRow>
        <CRow class="justify-content-center">
          <CCol>
              <CInput
              label="Manager"
              :lazy="false"
              :placeholder="saleDetail['Manager']"
              :disabled="true"
              />
          </CCol>
          <CCol>
            <CInput
            label="Approval Date:"
            :lazy="false"
            :value="saleDetail['Approval Date']"
            :disabled="true"
            />
          </CCol>
        </CRow>
        <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Delivery Status:"
                :lazy="false"
                :placeholder="saleDetail['Delivery Status']"
                :disabled="true"
                />
            </CCol>
            <CCol>
              <CInput
              label="Delivery Date:"
              :lazy="false"
              :value="saleDetail['Delivery Date']"
              :disabled="true"
              />
            </CCol>
        </CRow>
        <CRow class="justify-content-center">
            <CCol>
                <CInput
                label="Sale Amount:"
                :lazy="false"
                :value.sync="form.sale_amount"
                :placeholder="saleObject.sale_amount + '.00'"
                :disabled="disableButtons"
                >
                <template #prepend-content><CIcon name="cil-dollar" /></template>
                </CInput>
            </CCol>
            <CCol>
                <CInput
                label="Deposit Amount:"
                :lazy="false"
                :value.sync="form.deposit_amount"
                :placeholder="saleObject.deposit_amount + '.00'"
                :disabled="disableButtons"
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
                :placeholder="saleObject.notes"
                rows="6"
                :disabled="disableButtons"
                />
            </CCol>
        </CRow>
        <CRow>
          <CButton
            v-if="saleDetail['Approval Date']=='-' && disableButtons && userHasRoles('Administration', 'Management')"
            class="ml-3"
            color="primary"
            id="approve_sale"
            @click="approveSale"
          >
          Approve Sale
          </CButton>
          <CButton
            v-if="saleDetail['Delivery Status']!='Delivered' && saleDetail['Approval Date']!='-' && disableButtons && userHasRoles('Administration', 'Management')"
            class="ml-3"
            color="primary"
            id="set_delivered"
            @click="markVehicleDelivered"
          >
          Mark as Delivered
          </CButton>
          <CButton
            v-if="saleDetail['Delivery Status']!='Delivered' && saleDetail['Approval Date']=='-' && disableButtons && userHasRoles('Administration', 'Management')"
            class="ml-3"
            color="secondary"
            id="edit_sale"
            @click="editSale(false)"
          >
          Edit
          </CButton>
          <CButton
            v-if="saleDetail['Delivery Status']!='Delivered' && saleDetail['Approval Date']=='-' && disableButtons && userHasRoles('Administration', 'Management')"
            class="ml-3"
            color="danger"
            id="edit_sale"
            @click="showDeleteModal = true"
          >
          Delete
          </CButton>
        </CRow>
        <CRow class="justify-content-center">
          <CButton
            v-if="!disableButtons && userHasRoles('Administration', 'Management')"
            color="primary"
            id = "update-sale"
            @click="updateSale"
          >
            Update
          </CButton>
          <CButton
            v-if="!disableButtons && userHasRoles('Administration', 'Management')"
            class="ml-1"
            color="secondary"
            :disabled="disableButtons"
            @click="editSale(true)"
          >
            Cancel
          </CButton>
      </CRow>
      </CForm>
      <CModal :show.sync="showDeleteModal" :centered="true">
      <template #header>
        <h6 class="modal-title">Delete Transaction</h6>
        <CButtonClose @click="showDeleteModal = false" />
      </template>
      <p>
        Are you sure you want to cancel this sale request?
      </p>
      <template #footer>
        <CButton @click="deleteSale" color="primary">Confirm</CButton>
        <CButton @click="showDeleteModal = false" color="secondary"
          >Cancel</CButton>

      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require('axios');
const { containsRoles, showMessage } = require("../../../utils/index");

export default {
  name: 'transactionDetails',
  props: [
    "saleDetail",
    "setTransactionModal",
    "setNewSale",
    "dealership",
    "fetchSales",
    "messageObj"
  ],
  data() {
    return {
      disableButtons: true,
      saleObject: null,
      form: null,
      showDeleteModal: false,
    }
  },
  methods: {
    userHasRoles(...roles) {
      return containsRoles(roles);
    },
    deleteSale() {
      axios({
        method: "DELETE",
        url: `${this.$store.state.api}/inventory/details/sale/${this.saleDetail.id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.showDeleteModal = false;
            this.setTransactionModal(false);
            showMessage("The transaction been deleted.", "success", this.messageObj);
            this.fetchSales(this.dealership);
          }
        })
        .catch((err) => {
          console.log(err);
          showMessage("An error occured while deleting this transaction.", "danger", this.messageObj);
        });
    },
    editSale(value) {
      this.disableButtons = value;
    },
    approveSale () {
      let ts = Date.now();
      let date_ob = new Date(ts);
      axios({
          method: 'PUT',
          url: `${this.$store.state.api}/inventory/details/sale/${this.saleDetail.id}`,
          headers: {
            'Authorization': `Bearer ${this.$store.state.auth.token}`
          },
          data: {
            date_approved: date_ob,
          }
      }).then(response => {
          if (response.data.success) {
            this.fetchSales(this.dealership);
            this.setTransactionModal(false);
            showMessage("The sale has been approved", "success", this.messageObj);
          }
      }).catch(error => {
          console.log(error);
          showMessage(error.response.data.error, "danger", this.messageObj);
      })
    },
    getSale() {
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
            this.form = this.getEmptyForm();
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
      body.delivered = true;
      body.date_delivered = date_ob;
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
            this.fetchSales(this.dealership);
            this.setTransactionModal(false);
            showMessage("Vehicle has been marked as delivered", "success", this.messageObj);
          }
        })
        .catch((err) => {
          console.log(err);
          showMessage("Error occured while updating vehicle delivery status", "danger", this.messageObj);
        });
    },
    updateSale() {
      let body = this.form;
      axios({
          method: 'PUT',
          url: `${this.$store.state.api}/inventory/details/sale/${this.saleDetail.id}`,
          headers: {
              'Authorization': `Bearer ${this.$store.state.auth.token}`
          },
          data: body
      }).then(response => {
          if (response.data.success) {
            this.fetchSales(this.dealership);
            this.setTransactionModal(false);
            showMessage("The transaction has been updated", "success", this.messageObj);
          }
      }).catch(error => {
          console.log(error);
          this.setTransactionModal(false);
          showMessage(error.response.data.error, "danger", this.messageObj);
      })
    },
    getEmptyForm() {
      return {
        sale_amount: this.saleObject.sale_amount,
        deposit_amount: this.saleObject.deposit_amount,
        notes: this.saleObject.notes,
      }
    },
  },
  mounted() {
    this.getSale();
  }
}
</script>
