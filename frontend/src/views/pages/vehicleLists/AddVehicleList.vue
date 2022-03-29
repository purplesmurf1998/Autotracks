<template>
  <div>
    <CForm @submit.prevent="submit">
      <CInput
        label="Title"
        :lazy="false"
        :value.sync="title"
        required
        placeholder="Custom List Title"
      />
      <p class="mb-0" v-if="$store.state.auth.role == 'Administration'">Dealership</p>
      <dealership-dropdown
        v-if="$store.state.auth.role == 'Administration'"
        :dealership="selectedDealership"
        :messageObj="messageObj"
        @selectDealership="selectedDealership = $event"
      />
      <p class="mb-2">Notes</p>
      <quill-editor v-model="notes" />
      <CRow class="justify-content-center mt-3">
        <CButton
          color="primary"
          type="submit"
          id="create-dealership"
          :disabled="disableButtons"
        >
          Create
        </CButton>
        <CButton class="ml-1" color="danger" :disabled="disableButtons" @click="closeAddListModal">
          Cancel
        </CButton>
      </CRow>
    </CForm>
  </div>
</template>

<script>
const axios = require("axios");

import Vue from "vue";
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import DealershipDD from "../inventory/DealershipDropdown.vue";
import { showMessage } from '../../../utils';

Vue.use(VueQuillEditor);

export default {
  props: ["finishAddingVehicleList", "closeAddListModal", "messageObj"],
  data() {
    return {
      title: "",
      notes: "",
      disableButtons: false,
      selectedDealership: null,
    };
  },
  methods: {
    submit() {
      this.disableButtons = true;
      let dealership = this.selectedDealership ? this.selectedDealership : this.$store.state.auth.dealership
      const list = {
        title: this.title,
        notes: this.notes,
        owner: this.$store.state.auth.userId,
        dealership: dealership,
      };
      this.postVehicleList(list);
    },
    postVehicleList(data) {
      axios({
        method: "POST",
        url: `${this.$store.state.api}/vehicle-list`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data,
      })
        .then((response) => {
          showMessage("Custom list has been created successfully", "success", this.messageObj);
          this.resetForm();
          this.finishAddingVehicleList(response.data.payload);    
        })
        .catch((error) => {
          console.log(error);
        });
    },
    resetForm() {
      this.disableButtons = false;
      this.title = "";
      this.notes = "";
    },
  },
  components: {
    "dealership-dropdown": DealershipDD,
  },
};
</script>