<template>
  <div>
    <CRow v-if="!selectedDealership">
      <CCol>
        <CRow class="mb-2">
          <CCol>
            <CButton
              color="primary"
              id = "add-new-dealership"
              @click="
                () => {
                  addingDealership = true;
                }
              "
              >Add New Dealership</CButton
            >
          </CCol>
        </CRow>
        <CCard>
          <CCardHeader>
            <slot name="header"> List of registered dealerships </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :fields="tableFields"
              :items="tableItems"
              :striped="true"
              :items-per-page="10"
              :fixed="true"
              :clickable-rows="true"
              @row-clicked="clickRow"
            >
              <template #admin="{ item }">
                <td>
                  {{ item.admin.first_name }} {{ item.admin.last_name }}
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <!-- <CRow>
      <Dealership
        v-if="selectedDealership != null"
        :dealership="selectedDealership"
        :resetSelectedDealership="resetSelectedDealership"
      ></Dealership>
    </CRow> -->
    <CModal
      :show.sync="addingDealership"
      :centered="true"
      title="Modal title 2"
      size="lg"
    >
      <dealership-add />
      <template #header>
        <h6 class="modal-title">Create a new dealership!</h6>
        <CButtonClose @click="addingDealership = false" />
      </template>
      <template #footer>
        <!-- <CRow class="justify-content-center">
        </CRow>
        <CButton @click="addingDealership = false" color="danger">Discard</CButton>
        <CButton @click="addingDealership = false" color="success">Accept</CButton> -->
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
import Dealership from "./Dealership";
import DealershipAdd from "./DealershipAdd.vue";

const axios = require("axios");

export default {
  name: "Dealerships",
  components: {
    Dealership,
    "dealership-add": DealershipAdd,
  },
  data() {
    return {
      addingDealership: false,
      selectedDealership: null,
      tableItems: [],
      tableFields: [
        { 
          key: "name",
          label: "Name"
        },
        { 
          key: "description" ,
          label: "Description"
        },
        { 
          key: "admin" ,
          label: "Owner"
        },
        { 
          key: "created_at_formatted",
          label: "Date Created" 
        },
      ]
    };
  },
  mounted() {
    this.fetchDealerships();
  },
  methods: {
    clickRow(dealership) {
      //this.selectedDealership = dealership
      //console.log(dealership)
      const dealershipId = dealership._id;
      this.$router.push(`/dealerships/${dealershipId}`);
    },
    resetSelectedDealership() {
      this.selectedDealership = null;
      console.log("Selected Dealership has been reset");
    },
    fetchDealerships() {
      console.log(
        this.$store.state.auth.userId + "\n" + this.$store.state.auth.token
      );

      axios({
        method: "GET",
        url:
          "http://localhost:5000/api/v1/dealerships/?admin=" +
          this.$store.state.auth.userId +
          "&populate=admin",
        headers: {
          Authorization: "Bearer " + this.$store.state.auth.token,
        },
      })
        .then((response) => {
          this.tableItems = response.data.data;
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
</style>
