<template>
  <div class="vld-parent">
    
    
    <loading :active.sync="isLoading" 
    :can-cancel="true" 
    :is-full-page="fullPage"></loading>
        
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-6 col-sm-12 card1 table-responsive">
        
        <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
          <thead class="has-gutter">
            <tr><th v-for="column in columns" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(income,index) in incomeData"  :key="income.id">
              <td style="width: 40px; height:50px;">{{income.observation_month}}</td>
              <td>{{income.num_projects}}</td>
              <td>{{income.num_hours}}</td>
              <td>${{income.total_income}}</td>
              <td>${{income.total_income/income.num_hours}}</td>
              
              <td style="width: 40px; height:50px;"><a href="#!" @click="deleete(index)"><i class="fa fa-times"></i></a></td>
            </tr>
            <tr>
              <td>
                <div class="input-field">
                  <datepicker :value="input.month" v-model="input.month"  format="yyyy-MM-dd"></datepicker>
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  ref="projects" placeholder="Projects" v-model="input.projects" id="projects" type="text">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  ref="hours" placeholder="Hours" v-model="input.hours" id="hours" type="number">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  ref="income" placeholder="Income" v-model="input.income" id="income" type="number">
                </div>
              </td>
              <td></td>
              <td><a href="#!" @click="add" class="btn btn-waves">add</a></td>
            </tr>
          </tbody>
        </table>
        <h1> </h1>
        <!-- projectionsData table -->
        <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
          <thead class="has-gutter">
            <tr><th></th><th v-for="column in projectionsData.years" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>

            <tr v-for="(projection) in projectionsData.data"  :key="projection.id">
              
              <td >{{projection.scenario}}</td>
              <td v-for="(totalincome) in projection.totalincomes"  :key="totalincome.id">${{totalincome}}</td>
              
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-lg-6  col-sm-12 card1 table-responsive text-center">
        <small class="text-center">Cumulative Increased Earnings Over Time</small>
        <line-chart :data="chartData" :curve="false"></line-chart>
      </div>
    </div>
<!-- // submit button -->
    <div class="row">
      <a href="#!" @click="updateIncome" class="btn btn-success">Save</a>
    </div>


  </div>
</template>
<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";

import {
  getProjectionsAPI,
  getMonthlyIncomeAPI,
  updateIncomeAPI
} from "./../../api/api";
import Loading from "vue-loading-overlay";
import Datepicker from "vuejs-datepicker";
import VueChartkick from "vue-chartkick";
import Chart from "chart.js";
import Vue from "vue";
Vue.use(VueChartkick, { adapter: Chart });
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  components: {
    Loading,
    Datepicker
  },

  async beforeCreate() {
    try {
      this.account = await Auth.currentAuthenticatedUser();
      this.signedIn = true;
    } catch (err) {
      this.signedIn = false;
    }
    AmplifyEventBus.$on("authState", async info => {
      if (info === "signedIn") {
        this.signedIn = true;
        this.account = await Auth.currentAuthenticatedUser();
      } else {
        this.signedIn = false;
      }
    });
  },

  mounted() {
    this.getIncome();
    this.getProjections();
  },

  data() {
    return {
      isLoading: false,
      fullPage: true,
      incomeData: {},
      projectionsData: {},
      yearCols: {},
      columns: ["Month", "Projects", "Hours", "Income", "Effective Rate", ""],

      input: {
        month: "",
        projects: "",
        hours: "",
        income: ""
      },
      editInput: {
        month: "",
        projects: "",
        hours: "",
        income: ""
      },

      chartData: []
    };
  },

  methods: {
    getProjections() {
      this.isLoading = true;
      getProjectionsAPI().then(data => {
        let projectionArray = data;
        if (projectionArray.length > 0) {
          let years = Object.keys(projectionArray[0]);
          years.shift();
          years.pop();
          this.projectionsData.years = years;

          let data = [];
          this.chartData = [];
          for (var i = 0; i < projectionArray.length; i++) {
            let projects = projectionArray[i];
            let keys = Object.keys(projects);
            let values = Object.values(projects);
            values.shift();
            values.pop();
            let projection = {};
            projection.scenario = projects.scenario;
            projection.totalincomes = values;
            projection.footnote = projects.footnote;

            data.push(projection);

            //add chart data
            let chartitem = {};
            chartitem.name = projects.scenario;
            chartitem.data = {};

            for (var j = 0; j < this.projectionsData.years.length; j++) {
              chartitem.data[this.projectionsData.years[j].replace(/\s/g, "")] =
                projection.totalincomes[j];
            }
            this.chartData.push(chartitem);

            // add difference and empty row
            if (i == 0) {
              data.push({});
            } else {
              let firstTotalIncome = data[0].totalincomes;
              let difference = [];
              for (var j = 0; j < values.length; j++) {
                let income = values[j];
                let firstincome = firstTotalIncome[j];
                difference.push(income - firstincome);
              }

              let projection = {};
              projection.scenario = "Difference";
              projection.totalincomes = difference;
              projection.footnote = "";

              data.push(projection);
              data.push({});
            }
          }
          this.projectionsData.data = data;
        }
        this.isLoading = false;
      });
    },
    getIncome() {
      this.isLoading = true;
      getMonthlyIncomeAPI().then(data => {
        this.incomeData = data;
        this.isLoading = false;
        console.log(JSON.stringify(this.incomeData));
      });
    },
    updateIncome() {
      this.isLoading = true;
      updateIncomeAPI(this.incomeData).then(data => {
        this.getIncome();
      });
    },

    getError(fieldName) {
      return this.errors.first(fieldName);
    },

    validate() {
      this.$validator.validateAll().then(isValid => {
        this.$emit("on-submit", this.registerForm, isValid);
      });
    },

    add: function() {
      if (this.input.month === "") {
        return;
      }

      if (this.input.projects === "") {
        this.$refs.projects.focus();
        return;
      }

      if (this.input.hours === "") {
        this.$refs.hours.focus();
        return;
      }

      if (this.input.income === "") {
        this.$refs.income.focus();
        return;
      }

      this.incomeData.push({
        observation_month: this.input.month.toISOString().substring(0, 10),
        num_projects: this.input.projects,
        num_hours: this.input.hours,
        total_income: this.input.income
      });

      for (var key in this.input) {
        this.input[key] = "";
      }
      this.$refs.projects.focus();
    },
    //function to defintely delete data
    deleete: function(index) {
      this.incomeData.splice(index, 1);
    }
  }
};
</script>
<style lang="scss">
.vdp-datepicker__calendar {
  position: fixed;
  display: block;
}
</style>
