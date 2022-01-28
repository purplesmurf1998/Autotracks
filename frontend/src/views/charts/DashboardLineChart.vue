<template>
 <CChartLine
   :datasets="something"
 />
</template>

<script>
const axios = require("axios");
import { CChartLine } from '@coreui/vue-chartjs'

export default {
  name: 'DashboardLineChart',
  props: ["dealership"],
  components: { CChartLine },
  // Data stored in the component
  data() {
    return {

    };
  },
  // Methods which can be called by the component
  methods: {
    fetchSalesFromDealership(dealership) {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/details/sale/dealership/${dealership}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          console.log("Payload below:")
          console.log(response.data.payload)
        })
        .catch((error) => {
          console.log(error);
          //Show an error message instead of showing the 404 page
          this.$router.replace("/pages/404");
        });
    },
  },
  // Actions to take the instant the component is loaded
  mounted() {
    console.log("Dashboard chart mounted -> "+`${this.dealership}`);
    this.fetchSalesFromDealership(this.dealership);
  }
}

</script>
