<template>
 <CChartBar
   :datasets="this.dataPoints"
   :labels="this.dataLabels"
   :options="this.chartOptions"
 />
</template>

<script>
const axios = require("axios");
import { CChartBar } from '@coreui/vue-chartjs'

export default {
  name: 'DashboardLineChart',
  props: ["dealership", "timescale", "periods"],
  components: { CChartBar },
  // Data stored in the component
  data() {
    return {
      chartData: [
        {
          // Canary in the Coal Mine situation:
          // If this is the data in the chart, the API failed!
          data: [
            {x: "2022-01-28", y: 12000},
            {x: "2022-01-29", y: 14000},
          ]
        }
      ],
      monthlyPoints: [],
      monthlyLabels: [],
      yearlyPoints: [],
      yearlyLabels: [],
      dataPoints: [{data:[], backgroundColor: '#2982cc', label: 'Sales over time'}],
      dataLabels: ["First", "Second"],
      dataPayload: [],
      chartOptions: {
        scales: {
          xAxes: [{
            //type: "time"
          }],
          yAxes: [{
            ticks:{
              beginAtZero: true,
              //callback: function(value) {if (value % 1 === 0){return value}}
              stepSize: 1
            }
          }]
        }
      }
    };
  },
  // Methods which can be called by the component
  methods: {
    // Request all the sales from the selected dealership
    fetchSalesFromDealership(dealership) {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dashboard-visuals/dealership/${dealership}/visual3`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        // From this point, to ensure sync, all processing methods MUST reside in this block
        .then((response) => {
          this.dataPayload = response.data.payload
          this.monthlyLabels = this.dataPayload.formattedSalesByMonth[0]
          this.monthlyPoints = this.dataPayload.formattedSalesByMonth[1]
          this.yearlyLabels = this.dataPayload.formattedSalesByYear[0]
          this.yearlyPoints = this.dataPayload.formattedSalesByYear[1]
          this.dataLabels = this.dataPayload.formattedSalesByMonth[0]
          this.dataPoints[0].data = this.dataPayload.formattedSalesByMonth[1]
          this.useDataSet(this.timescale, this.periods);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /*
    This method uses Array.slice(N) with a negative integer to get the last N objects.
    It returns a shallow copy and does not modify the original array.
    */
    useDataSet(type, period) {
      if (type == "Month") {
        if (period == "All") {
          this.dataLabels = this.monthlyLabels
          this.dataPoints[0].data = this.monthlyPoints
        }
        else if (period == "Last 12") {
          this.dataLabels = this.monthlyLabels.slice(-12)
          this.dataPoints[0].data = this.monthlyPoints.slice(-12)
        }
      }
      else if (type == "Year") {
        if (period == "All") {
          this.dataLabels = this.yearlyLabels
          this.dataPoints[0].data = this.yearlyPoints
        }
        else if (period == "Last 12") {
          this.dataLabels = this.yearlyLabels.slice(-12)
          this.dataPoints[0].data = this.yearlyPoints.slice(-12)
        }
      }
    },
  },
  // Actions to take the instant the component is loaded
  mounted() {
    setTimeout(() => {
      this.fetchSalesFromDealership(this.dealership);
    }, 1)
  }
}

</script>
