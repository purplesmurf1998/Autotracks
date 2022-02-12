<template>
  <div>
    <CCardBody>
      <CForm>
        <CInput label="Name" horizontal size="sm" />
        <CTextarea label="Description" horizontal rows="5" />
        <CRow class="d-flex justify-content-end m-0">
          <CButton color="success" class="mr-2">Save Changes</CButton>
          <CButton color="primary" class="mr-2">Edit Zone Perimeter</CButton>
          <CButton color="danger" @click="showConfirmDeleteModal = true"
            >Delete</CButton
          >
        </CRow>
      </CForm>
    </CCardBody>
    <!-- <CModal :show.sync="showConfirmDeleteModal" :centered="true">
      <p>
        Are you sure you want to delete this location zone? Vehicles in this
        zone will have no more associated locations.
      </p>
      <template #header>
        <h6 class="modal-title">Delete location zone?</h6>
        <CButtonClose
          @click="
            () => {
              showConfirmDeleteModal = false;
            }
          "
        />
      </template>
      <template #footer>
        <CButton @click="showConfirmDeleteModal = false" color="secondary"
          >Cancel</CButton
        >
        <CButton @click="deleteLocation" color="danger">Confirm</CButton>
      </template>
    </CModal> -->
  </div>
</template>

<script>
export default {
  props: ["zone"],
  data() {
    return {
      showConfirmDeleteModal: false,
    };
  },
  methods: {
    deleteLocation() {
      this.showConfirmDeleteModal = false;
      this.$emit("delete", this.zone._id);
    },
  },
};
</script>

<style>
</style>