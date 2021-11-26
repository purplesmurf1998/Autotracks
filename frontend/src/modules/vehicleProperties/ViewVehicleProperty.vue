<template>
  <div>
    <CRow>
      <CCol>
        <p class="text-muted mb-0">Header Name:</p>
      </CCol>
      <CCol class="d-flex flex-row-reverse">
        <p class="text-muted mb-0">{{ property.label }}</p>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <p class="text-muted mb-0">Input Type:</p>
      </CCol>
      <CCol class="d-flex flex-row-reverse">
        <p class="text-muted mb-0">{{ property.inputType }}</p>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <p class="text-muted mb-0">Inventory Visible:</p>
      </CCol>
      <CCol class="d-flex flex-row-reverse">
        <p class="text-muted mb-0">{{ property.visible }}</p>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <p class="text-muted mb-0">Value Required:</p>
      </CCol>
      <CCol class="d-flex flex-row-reverse">
        <p class="text-muted mb-0">{{ property.isRequired }}</p>
      </CCol>
    </CRow>
    <hr />
    <CRow>
      <CCol>
        <p class="text-muted mb-0">Options:</p>
      </CCol>
      <CCol
        class="d-flex align-items-end flex-column"
        v-if="property.inputType == 'Options'"
      >
        <CRow v-for="option in property.options" :key="option" class="mr-0"
          ><p class="text-muted mb-0">
            {{ option }}
          </p></CRow
        >
      </CCol>
      <CCol
        class="d-flex flex-row-reverse"
        v-if="property.inputType != 'Options'"
      >
        <p class="text-muted mb-0">No value options for this input type.</p>
      </CCol>
    </CRow>
    <CRow class="d-flex justify-content-start mt-3 px-3 mb-2">
      <CButton
        color="secondary"
        class="mr-2"
        id="edit-user-acc"
        @click="setEditingProperty(true)"
        >Edit custom vehicle property</CButton
      >
    </CRow>
    <CButton
      color="danger"
      @click="
        () => {
          deletingProperty = true;
        }
      "
      >Delete custom vehicle property</CButton
    >
    <CModal :show.sync="deletingProperty" :centered="true">
      <p>
        Are you sure you want to delete this custom vehicle property? This could
        have an effect on existing vehicles in the inventory.
      </p>
      <template #header>
        <h6 class="modal-title">Delete custom vehicle property?</h6>
        <CButtonClose
          @click="
            () => {
              deletingProperty = false;
            }
          "
        />
      </template>
      <template #footer>
        <CButton @click="deletingProperty = false" color="secondary"
          >Cancel</CButton
        >
        <CButton @click="removeProperty" color="danger">Confirm</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "ViewVehicleProperty",
  props: ["property", "setEditingProperty"],
  data() {
    return {
      deletingProperty: false,
    };
  },
  methods: {
    removeProperty() {
      axios({
        method: "DELETE",
        url: `${this.$store.state.api}/dealerships/${this.$route.params.dealershipId}/vehicles/properties/${this.property._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            this.$router.go();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.remove-link {
  color: red;
}
.account-password {
  color: blue;
}
</style>