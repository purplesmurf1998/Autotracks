<template>
  <div>
    <CCardBody>
      <CForm>
        <CInput label="Name" horizontal size="sm" v-model="name" />
        <CTextarea
          label="Description"
          horizontal
          rows="5"
          v-model="description"
        />
        <CRow
          class="d-flex justify-content-end m-0"
          v-if="editingPath != zone._id"
        >
          <CButton color="success" class="mr-2" @click="saveAndClose"
            >Save and Close</CButton
          >
          <CButton color="primary" class="mr-2" @click="editPerimter"
            >Edit Zone Perimeter</CButton
          >
          <CButton color="danger" @click="showConfirmDeleteModal = true"
            >Delete</CButton
          >
        </CRow>
        <CRow class="d-flex justify-content-end m-0" v-else>
          <CButton color="success" class="mr-2" @click="savePath"
            >Save and Close</CButton
          >
          <CButton color="secondary" @click="cancelPath">Cancel</CButton>
        </CRow>
      </CForm>
    </CCardBody>
    <CModal :show.sync="showConfirmDeleteModal" :centered="true">
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
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  props: ["zone", "editingPath"],
  data() {
    return {
      showConfirmDeleteModal: false,
      name: "",
      description: "",
    };
  },
  methods: {
    savePath() {
      this.$emit("save-edited-path");
    },
    cancelPath() {
      this.$emit("cancel-edited-path");
    },
    editPerimter() {
      this.$emit("edit-perimeter", this.zone);
    },
    deleteLocation() {
      this.showConfirmDeleteModal = false;
      this.$emit("delete", this.zone._id);
    },
    saveAndClose() {
      if (
        this.name == this.zone.name &&
        this.description == this.zone.description
      ) {
        this.$emit("close");
        return;
      }

      const data = {
        name: this.name,
        description: this.description,
      };

      axios({
        method: "PUT",
        url: `${this.$store.state.api}/locations/zones/${this.zone._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data,
      })
        .then((response) => {
          this.$emit("closeAndSave", response.data.payload);
        })
        .catch((error) => {
          console.log(error);
          this.showErrorMessage("Unable to save the information");
        });
    },
  },
  mounted() {
    this.name = this.zone.name;
    this.description = this.zone.description;
  },
};
</script>
