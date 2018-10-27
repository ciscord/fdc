<template>
  <div class="vld-parent">
    
    
    <loading :active.sync="isLoading" 
    :can-cancel="true" 
    :is-full-page="fullPage"></loading>
        
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-6 col-sm-12 style-paper">
        <div style="text-align: center;">
          <h4>Title</h4>
        </div>
        <table cellspacing="0" cellpadding="0" border="0" class="el-table">
          <thead class="has-gutter">
            <tr class="text-primary"><th v-for="column in columns" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(income,index) in incomeData" :key="income.id">
              <td>{{income.observation_month}}</td>
              <td>{{income.projects}}</td>
              <td>{{income.hours}}</td>
              <td>${{income.total_income}}</td>
              <td>${{income.total_income/income.hours}}</td>
              
              <td style="width: 40px; height:50px;text-align:center;">
                <button @click="deleteIncome(index)" type="button" class="btn btn-icon btn-danger btn-sm"><i class="fa fa-times"></i></button>
              </td>
            </tr>
            <tr class="last-row">
              <td>
                <div class="input-field text-left">
                  <datepicker
                      :value="input.month"
                      v-model="input.month"
                      format="yyyy-MM-dd"
                      calendar-button-icon="far fa-calendar-alt"
                      :calendar-button="true">
                  </datepicker>
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control col-lg-8"  ref="projects" placeholder="Projects" v-model="input.projects" id="projects" type="text">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control col-lg-8"  ref="hours" placeholder="Hours" v-model="input.hours" id="hours" type="number">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control col-lg-8"  ref="income" placeholder="Income" v-model="input.income" id="income" type="number">
                </div>
              </td>
              <td></td>
              <a  @click="add" class="btn btn-success add-btn"><i class="fa fa-plus" style="margin-right: 5px;"/> Add new</a>
            </tr>
          </tbody>
        </table>
        <!-- projectionsData table -->
      </div>
      <div class="col-lg-5 col-sm-12 style-paper text-center chart-cont">
        <div style="text-align: center;">
          <h4>Cumulative Increased Earnings Over Time</h4>
        </div>
        <line-chart :data="chartData" :dataset="{borderWidth:1}" :curve="false" :colors="['#51cbce', '#ef8157', '#6bd098','#66615b', '#cac4ae']" ></line-chart>
      </div>
    </div>
<!-- // submit button -->
      <div class="row">
        <div class="col-lg-6 col-sm-12 style-paper">
          <div style="text-align: center;">
            <h4>Title</h4>
          </div>
          <table cellspacing="0" cellpadding="0" border="0" class="el-table">
            <thead class="has-gutter">
              <tr><th></th><th class="text-primary" v-for="column in projectionsData.years" :key="column.id">{{column}}</th></tr>
            </thead>
            <tbody>

              <tr v-for="(projection, id) in projectionsData.data"  :key="projection.id" :class="[projectionsData.data.length === id + 1 ? 'last-row' : '']">
                <td v-if="projection.scenario != 'Difference'">{{projection.scenario}}</td>
                <th v-if="projection.scenario == 'Difference'">{{projection.scenario}}</th>
                <td v-for="(totalincome) in projection.totalincomes"  :key="totalincome.id">
                  <strong v-if="projection.scenario == 'Difference'">${{totalincome}}</strong>
                  <span v-if="projection.scenario != 'Difference'">${{totalincome}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";

import { mapActions } from 'vuex';
import { Auth, Analytics } from "aws-amplify";

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
  created() {
    this.setNavbarTitle('Income');
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
    ...mapActions('UI', ['setNavbarTitle']),
    
    getProjections() {
      this.isLoading = true;
      getProjectionsAPI().then(data => {
        let projectionArray = data;
        if (projectionArray.length > 0) {
          let years = Object.keys(projectionArray[0]);
          years.shift();
          years.pop();
          this.projectionsData.years = years;

          let data = []
          this.chartData = []
          for (var i=0; i<projectionArray.length; i++) {
            let projects = projectionArray[i]
            let keys     = Object.keys(projects)
            let values   = Object.values(projects)
            values.shift()
            values.pop()
            let projection          = {}
            projection.scenario     = projects.scenario
            projection.totalincomes = values
            projection.footnote     = projects.footnote
            
            data.push(projection)

            //add chart data
            let chartitem = {}
            chartitem.name = projects.scenario
            chartitem.data = {}
            let firstTotalIncome = data[0].totalincomes
            for (var j=0; j< this.projectionsData.years.length; j++) {
                for (var b=0; b< values.length; b++) {
                  let income      = values[j]
                  let firstincome = firstTotalIncome[j]
                  var dif         = income - firstincome
                }
                if(i != 0){
                  chartitem.data[this.projectionsData.years[j].replace(/\s/g, '') ] = dif;
                }
            }
            this.chartData.push(chartitem)
            // add difference and empty row
            if (i == 0) {
              /*data.push({})*/
            }else {
              let firstTotalIncome = data[0].totalincomes
              let difference = []
              for (var j=0; j< values.length; j++) {
                let income      = values[j]
                let firstincome = firstTotalIncome[j]
                difference.push(income - firstincome)
              }

              let projection = {}
              projection.scenario = "Difference"
              projection.totalincomes = difference
              projection.footnote = ""
              
              data.push(projection)
              /*data.push({})*/
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
      });
    },
    updateIncome(newIncome) {
      this.isLoading = true;
      console.log(newIncome)
      updateIncomeAPI(newIncome).then(data => {
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

      let newIncome = {
        "projects": parseInt(this.input.projects),
        "hours": parseFloat(this.input.hours),
        "total_income": parseFloat(this.input.income),
        "observation_month": this.input.month
      };

      this.updateIncome(newIncome)

      for (var key in this.input) {
        this.input[key] = "";
      }
      this.$refs.projects.focus();
      Analytics.record({ name: 'plan income add month' })
    },
    //function to defintely delete data
    deleteIncome: function(index) {
      this.incomeData.splice(index, 1);
      Analytics.record({ name: 'plan income delete month' })
    }
  }
};
</script>

<style lang="scss">
.el-table .last-row td {
  border-bottom: none;
}
.vdp-datepicker__calendar {
  position: fixed;
  display: block;
}
.vdp-datepicker__calendar-button {
  position: absolute;
  display: block;
  padding: 5px;
  float: right;
  right: 32px;
}
</style>

<style scoped>
    .style-paper {
      -moz-transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
      -ms-transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
      -o-transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
      -webkit-transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
      background-color: #fff;
      border: 0;
      border-radius: 3px;
      box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
      color: #252422;
      margin: 0px;
      margin-bottom: 20px;
      position: relative;
      transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
  }
  .add-btn {
    color: white !important;
  }
  .chart-cont {
    margin-left: 20px;
  }
  #projects {
    margin-left: 3px;
  }
  .row-hover:hover {
    background-color: #f5f7fa !important;
  }
</style>
