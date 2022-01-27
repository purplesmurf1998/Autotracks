<template>
  <div>
    <CAlert show :color="messageType" v-if="message" class="mb-2">{{ message }}</CAlert>
    <CForm @submit.prevent="submit">
      <CInput
        label="Title"
        :lazy="false"
        :value.sync="title"
        placeholder="Custom List Title"
      />
      <p class="mb-0">Dealership</p>
      <dealership-dropdown
        v-if="$store.state.auth.role == 'Administration'"
        :dealership="selectedDealership"
        @selectDealership="selectedDealership = $event"
      />
      <p class="mb-2">Notes</p>
      <quill-editor :content="notes"/>
      <CRow class="justify-content-center mt-3">
        <CButton 
          color="primary"
          type="submit"
          id = "create-dealership"
          :disabled="disableButtons"
        >
          Create
        </CButton>
        <CButton 
          class="ml-1"
          color="danger"
          :disabled="disableButtons"
        >
          Cancel
        </CButton>
      </CRow>
    </CForm>
  </div>
</template>

<script>
const axios = require('axios');
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import DealershipDD from "../inventory/DealershipDropdown.vue"

Vue.use(VueQuillEditor)

export default {
  props: ['finishAddingVehicleList'],
  data() {
    return {
      title: '',
      notes: '',
      disableButtons: false,
      message: null,
      messageType: null,
      selectedDealership: null
    }
  },
  methods: {
    submit() {
      this.disableButtons = true

      const list = {
        title: this.title,
        notes: this.notes,
        owner: this.$store.state.auth.userId,
        dealership: this.selectedDealership
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
        data
      }).then((response) => {
        this.disableButtons = false;
        this.title = '';
        this.notes = '';
        this.finishAddingVehicleList(response.data.payload);
      }).catch((error) => {
        console.log(error);
      });
    },
    showMessage(message, messageType) {
      this.message = message;
      this.messageType = messageType;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
      }, 5000);
    }
  },
  components: {
    'dealership-dropdown': DealershipDD
  }
}
</script>

<style>

</style>