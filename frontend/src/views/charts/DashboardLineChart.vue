<template>
 <CChartLine
   :datasets="this.chartData"
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
      chartData: [
        {
          // Dummy data, becomes overwritten
          data: [{x: 10, y: 20}, {x: 15, y: 15}, {x: 20, y: 10}]
        }
      ],
      dataPoints: [

      ],
      chartOptions: []
    };
  },
  // Methods which can be called by the component
  methods: {
    // Request all the sales from the selected dealership
    fetchSalesFromDealership(dealership) {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/details/sale/dealership/${dealership}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        // From this point, to ensure sync, all processing methods MUST reside in this block
        .then((response) => {
          console.log("Payload below:")
          console.log(response.data.payload)
          this.chartData = response.data.payload

        })
        .catch((error) => {
          console.log(error);
          // Show an error message instead of showing the 404 page
          this.$router.replace("/pages/404");
        });
    },
    processDataPoints() {

    },
  },
  // Actions to take the instant the component is loaded
  mounted() {
    console.log("Dashboard chart mounted -> "+`${this.dealership}`);
    this.fetchSalesFromDealership(this.dealership);
  }
}

</script>
