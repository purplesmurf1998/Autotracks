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
          key: "firstName",
          label: "First Name",
        },
        {
          key: "lastName",
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
    this.getHistory();
  },
  methods: {
    fetchHistory() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/?admin=${this.$store.state.auth.userId}&populate=admin`,
        headers: {
          Authorization: "Bearer " + this.$store.state.auth.token,
        },
      })
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

