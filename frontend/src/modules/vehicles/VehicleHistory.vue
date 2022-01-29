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
              <template #author="{ item }">
                <td>
                  {{item.author.first_name + " " + item.author.last_name}}
                </td>
              </template>
              <template #timestamp="{ item }">
                <td>
                  {{getFormattedDate(item.timestamp)}}
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
          key: "author",
          label: "User",
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
    getFormattedDate(date) {
      return date.substring(0, 10) + ' ' + date.substring(11, 16);
    },

    fetchHistory() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/history/vehicle/${this.vehicle._id}`,
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

