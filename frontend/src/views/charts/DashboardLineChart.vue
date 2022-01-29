<template>
 <CChartLine
   :datasets="this.chartData"
   :options="this.chartOptions"
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
          // Canary in the Coal Mine situation:
          // If this is the data in the chart, the API failed!
          data: [
            {x: "2022-01-28", y: 12000},
            {x: "2022-01-29", y: 14000},
          ]
        }
      ],
      dataPoints: [],
      dataPayload: [],
      chartOptions: {
        title: {
          display: true,
          text: "Vehicle Sales Over Time"
        },
        scales: {
          xAxes: [{
            type: "time",
            ticks: {
              min: "2021-01-29T03:02:09.136Z",
              max: "2023-01-29T03:02:09.136Z"
            },
            scaleLabel: {
              display: true,
              labelString: "Date Of Sale"
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Value Of Sale"
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
        url: `${this.$store.state.api}/inventory/details/sale/dealership/${dealership}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        // From this point, to ensure sync, all processing methods MUST reside in this block
        .then((response) => {
          console.log("Sales requested successfully!")
          this.dataPayload = response.data.payload
          this.processDataPoints()
        })
        .catch((error) => {
          console.log(error);
          // Show an error message instead of showing the 404 page
          this.$router.replace("/pages/404");
        });
    },
    processDataPoints() {
      console.log("Processing data points...")
      this.dataPayload.forEach(sale => {
        console.log(sale);
        const salePoint = new Object()
        // salePoint.vehicle = sale.vehicle.vin
        salePoint.x = sale.date_of_sale
        salePoint.y = sale.sale_amount
        this.dataPoints.push(salePoint)
      })
      console.log("Data points processed:")
      console.log(this.dataPoints)
      this.chartOptions.scales.xAxes[0].ticks.min = this.dataPoints[0].x.valueOf()
      this.chartOptions.scales.xAxes[0].ticks.max = this.dataPoints.at(-1).x.valueOf()
      console.log("Chart min: "+this.chartOptions.scales.xAxes[0].ticks.min)
      console.log("Chart max: "+this.chartOptions.scales.xAxes[0].ticks.max)

      this.chartData[0].data = this.dataPoints

      console.log("Chart data:")
      console.log(this.chartData)
    },
  },
  // Actions to take the instant the component is loaded
  mounted() {
    console.log("Dashboard chart mounted -> "+`${this.dealership}`);
    setTimeout(() => {
      this.fetchSalesFromDealership(this.dealership);
    }, 1)
  }
}

</script>
