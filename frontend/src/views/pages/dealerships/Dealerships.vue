<template>
  <div>
    <CRow>
      <CCol>
        <CRow>
          <div class="col-lg-auto">
            <CAlert
              v-if="!$store.state.auth.createDealershipCompleted"
              color="success"
              >Welcome to your <strong>Dealerships</strong> page! Here you can see all
              your dealerships which each contain their very own
              <u>inventory</u>, <u>vehicle</u> properties and <u>staff</u>.
              Start your experience by creating your very first dealership by
              click the button below.</CAlert
            >
            <CAlert
              v-if="
                $store.state.auth.createDealershipCompleted &&
                !$store.state.auth.createUserCompleted
              "
              color="primary"
              >Good job on creating your very first dealership! Now to get your
              team started, select your dealership and start building your
              staff.</CAlert
            >
          </div>
        </CRow>
        <CRow class="mb-3">
          <div class="col-sm-auto">
            <CButton
              color="primary"
              id="add-new-dealership"
              @click="
                () => {
                  addingDealership = true;
                }
              "
              >Add New Dealership</CButton
            >
          </div>
          <div class="col-sm-auto"></div>
        </CRow>
        <CCard v-if="tableItems.length > 0">
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
                <td>{{ item.admin.first_name }} {{ item.admin.last_name }}</td>
              </template>
              <template #name="{ item }">
                <td>
                  {{ item.name }}
                  <CBadge
                    color="primary"
                    v-if="
                      $store.state.auth.createDealershipCompleted &&
                      !$store.state.auth.createUserCompleted
                    "
                    :style="{
                      'vertical-align': 'middle',
                      'margin-top': '-0.5em',
                    }"
                    >NEW!</CBadge
                  >
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CModal
      :show.sync="addingDealership"
      :centered="true"
      title="Modal title 2"
      size="lg"
    >
      <dealership-add
        v-if="addingDealership"
        :setAddingDealership="setAddingDealership"
      />
      <template #header>
        <h6 class="modal-title">Create a new dealership!</h6>
        <CButtonClose @click="addingDealership = false" />
      </template>
      <template #footer>
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
      toast: { contant: "static", title: "Toast Title" },
      tableItems: [],
      tableFields: [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "description",
          label: "Description",
        },
        {
          key: "admin",
          label: "Owner",
        },
        {
          key: "created_at_formatted",
          label: "Date Created",
        },
      ],
    };
  },
  mounted() {
    this.fetchDealerships();
  },
  methods: {
    setAddingDealership(value) {
      this.addingDealership = value;
    },
    clickRow(dealership) {
      const dealershipId = dealership._id;
      this.$router.push(`/dealerships/${dealershipId}`);
    },
    resetSelectedDealership() {
      this.selectedDealership = null;
    },
    fetchDealerships() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/?admin=${this.$store.state.auth.userId}&populate=admin`,
        headers: {
          Authorization: "Bearer " + this.$store.state.auth.token,
        },
      })
        .then((response) => {
          this.tableItems = response.data.payload;
        })
        .catch((error) => {
          console.log(error);
          this.$router.replace("/pages/404");
        });
    },
  },
};
</script>
