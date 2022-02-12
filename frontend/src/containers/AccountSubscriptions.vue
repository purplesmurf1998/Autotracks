<template>
  <div>
    <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
    <CForm @submit.prevent="submitEvents">
      <CRow>
        <CCol>
 
          <CRow
            v-for="(event, key) in events"
            :key="key"
          >
            <CCol>
              <label>{{ event }}</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
              <CSwitch
                :id="key"
                class="mr-1"
                color="success"
                :checked="isEventSelected(key)"
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
        new_events: [],
    }
  },
  methods: {
    toggleEventChange(element) {
        const checked = element.target.checked;
        const event = element.target.id;

        if (checked) {
            // add the event to the list
            this.new_events.push(event);
        } 
        else {
            let index = this.new_events.indexOf(event);
            if (index > -1)
                this.new_events.splice(index, 1);
        }
    },
    isEventSelected(event) {
        if (this.user_events.includes(event))
            return true;
    },
    submitEvents() {

    }
  },
  mounted() {
    this.user_events.forEach((event) => {
        this.new_events.push(event);
    });
  }
}
</script>