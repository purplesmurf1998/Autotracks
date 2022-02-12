<template>
  <div>
    <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
    <CForm @submit.prevent="submitUser">
      <CRow>
        <CCol>
 
          <CRow
            v-for="(event, index) in events"
            :key="index"
          >
            <CCol>
              <label>{{ event }}</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
              <CSwitch
                :id="index"
                class="mr-1"
                color="success"
                @change.native="toggleEventChange"
                shape="pill"
              />
            </CCol>
          </CRow>

        </CCol>
      </CRow>
      <hr />
      <CRow class="d-flex justify-content-center mt-2">
        <CButton
          color="success"
          class="mr-2"
          id="save-user-changes"
          type="submit"
          >Save</CButton
        >
        <CButton color="secondary" @click="setSubscriptionModal(false)">Cancel</CButton>
      </CRow>
    </CForm>
  </div>
</template>

<script>
const axios = require('axios');

export default {
  name: 'accountSubscriptions',
  props: [
    "setSubscriptionModal",
  ],
  data() {
    return {
        events: {
            vehicle_delivered: 'Vehicle Delivery',
            vehicle_missing: 'Vehicle Missing',
            vehicle_moved: 'Vehicle Moved',
            vehicle_found: 'Vehicle Found',
            vehicle_deleted: 'Vehicle Deleted',
            vehicle_sale_pending: 'Transaction Requests',
            vehicle_approved: 'Transaction Approvals',
            transaction_modified: "Transaction Modifications",
        },
        user_events: this.$store.state.auth.userEventsSubscriptions,
    }
  },
  methods: {
    toggleEventChange() {
        console.log("Test");
    }
  },
  mounted() {
    console.log(this.user_events);
    console.log(this.events);
  }
}
</script>