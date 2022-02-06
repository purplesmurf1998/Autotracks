<template>
  <div>
    <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
    <CForm @submit.prevent="submitUser">
      <CRow>
        <CCol>
          <CRow>
            <CCol>
              <label>Vehicle Missing</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
            <!-- :checked="isPermissionSelected(permission)" -->
              <CSwitch
                class="mr-1"
                color="success"
                @change.native="toggleEventChange"
                shape="pill"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <label>Vehicle Found</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
            <!-- :checked="isPermissionSelected(permission)" -->
              <CSwitch
                class="mr-1"
                color="success"
                @change.native="toggleEventChange"
                shape="pill"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <label>Vehicle Moved</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
            <!-- :checked="isPermissionSelected(permission)" -->
              <CSwitch
                class="mr-1"
                color="success"
                @change.native="toggleEventChange"
                shape="pill"
              />
            </CCol>
          </CRow>  
          <CRow>
            <CCol>
              <label>Vehicle Delivery</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
            <!-- :checked="isPermissionSelected(permission)" -->
              <CSwitch
                class="mr-1"
                color="success"
                @change.native="toggleEventChange"
                shape="pill"
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol>
              <label>Vehicle Deleted</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
            <!-- :checked="isPermissionSelected(permission)" -->
              <CSwitch
                class="mr-1"
                color="success"
                @change.native="toggleEventChange"
                shape="pill"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <label>Transaction Requests</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
            <!-- :checked="isPermissionSelected(permission)" -->
              <CSwitch
                class="mr-1"
                color="success"
                @change.native="toggleEventChange"
                shape="pill"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <label>Transaction Approvals</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
            <!-- :checked="isPermissionSelected(permission)" -->
              <CSwitch
                class="mr-1"
                color="success"
                @change.native="toggleEventChange"
                shape="pill"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <label>Transaction Modifications</label>
            </CCol>
            <CCol class="d-flex justify-content-end">
            <!-- :checked="isPermissionSelected(permission)" -->
              <CSwitch
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
    }
  },
  methods: {
    toggleEventChange() {
        console.log("Test");
    }
  },
  mounted() {
    //this.getSale();
  }
}
</script>