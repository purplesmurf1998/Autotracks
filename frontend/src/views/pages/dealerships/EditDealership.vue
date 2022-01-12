<template>
  <div>
    <CAlert show color="danger" v-if="errorMessage" class="mb-2">{{
      errorMessage
    }}</CAlert>
    <CForm @submit.prevent="submitForm">
      <CInput
        label="Dealership Name"
        :lazy="false"
        :value.sync="updatedDealership.name"
        placeholder="Dealership Name"
      />

      <CTextarea
        label="Dealership Description"
        :lazy="false"
        :value.sync="updatedDealership.description"
        placeholder="Dealership Description"
        rows="6"
      />
      <CRow class="justify-content-center">
        <CButton color="primary" type="submit" id="save-dealership-changes" :disabled="disableButtons">
          Save
        </CButton>
        <CButton
          class="ml-1"
          color="danger"
          :disabled="disableButtons"
          @click="setEditingDealership(false)"
        >
          Cancel
        </CButton>
      </CRow>
    </CForm>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  props: ["dealership", "setEditingDealership"],
  data() {
    return {
      errorMessage: null,
      updatedDealership: {
        name: this.dealership.name,
        description: this.dealership.description,
      },
      disableButtons: false,
    };
  },
  methods: {
    submitForm() {
      const data = this.updatedDealership;
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/dealerships/${this.dealership._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data,
      })
        .then((response) => {
          if (response.data.success) {
            this.$router.go();
          } else {
            console.log(response.data);
            this.showErrorMessage(response.data.message);
          }
        })
        .catch((err) => {
          console.log(err.data);
          this.showErrorMessage(
            "Invalid field inputs. Dealership must have a name."
          );
        });
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
  },
};
</script>