<template>
  <div>
    <CCard>
          <CCardHeader>
            <slot name="header"> Vehicle History </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :fields="tableFields"
              :items="tableItems"
              :striped="true"
              :items-per-page="10"
              :fixed="true"
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
  </div>
</template>

<script>
const axios = require("axios");

export default {
  props: ["vehicle"],
  data(){
    return {
      tableItems: [],
            tableFields: [
        {
          key: "author.first_name",
          label: "First Name",
        },
        {
          key: "author.first_name",
          label: "Last Name",
        },
        {
          key: "timestamp",
          label: "Time Created",
        },
                {
          key: "log",
          label: "History Log",
        },
      ],
    };   
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    fetchHistory() {
      axios({
        method: "GET",
        //Not sure what to do for the url
        url: `${this.$store.state.api}/history/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: "Bearer " + this.$store.state.auth.token,
        },
      })
      //Not sure how to translate this into 
        .then((response) => {
          this.tableItems = response.data.payload;
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

