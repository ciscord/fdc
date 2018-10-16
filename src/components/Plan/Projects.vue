<template>
  <div class="vld-parent">
    
    
    <loading :active.sync="isLoading" 
    :can-cancel="true" 
    :is-full-page="fullPage"></loading>
        
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-12 col-sm-12 card1 table-responsive">
        
        <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
          <thead class="has-gutter">
            <tr><th v-for="column in columns1" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(project,index) in projectData"  :key="project.id">
              <td></td>
              <td>{{project.name}}</td>
              <td>{{project.hours_per_week}}</td>
              <td>{{(project.fixed_or_hourly == 0? 'hourly':'fixed')}}</td>
              <td>{{project.start_date}}</td>
              <td>{{project.end_date}}</td>
              <td>{{project.total_hours}}</td>
              <td>${{project.hourly_rate}}</td>
              <td>${{project.total_fee}}</td>
              <td v-if="project.status==0">Proposed</td>
              <td v-if="project.status==1">Active</td>
              <td v-if="project.status==2">Consider</td>
              
              <td style="width: 40px; height:50px;"><a href="#!" @click="deleete(index)"><i class="fa fa-times"></i></a></td>
            </tr>
            <tr>
              <td></td>
              <td>
                <div class="input-field">
                  <input class="form-control"  ref="name" placeholder="Name" v-model="input.name" id="projects" type="text">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  ref="hours_week" placeholder="Hours Week" v-model="input.hours_week" id="hours_week" type="number">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <select v-on:change="changeJobType($event)" v-model="input.fixed_hourly">
                    <option selected="selected" value="Hourly">Hourly</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>
              </td>

              <td>
                <div class="input-field">
                  <datepicker :value="input.startDate" v-model="input.startDate"  format="yyyy-MM-dd"></datepicker>
                </div>
              </td>

              <td>
                <div class="input-field">
                  <datepicker :value="input.endDate" v-model="input.endDate"  format="yyyy-MM-dd"></datepicker>
                </div>
              </td>

              <td>
                <div class="input-field">
                  <input class="form-control"  ref="totalHours" placeholder="Total Hours" v-model="input.totalHours" id="totalHours" type="number">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  ref="hourlyRate" placeholder="Hourly Rate" v-model="input.hourlyRate" id="hourlyRate" type="number">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  ref="totalFee" placeholder="TotalFee" v-model="input.totalFee" id="totalFee" type="number">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <select v-on:change="changeStatus($event)" v-model="input.status">
                    <option selected="selected" value="Proposed">Proposed</option>
                    <option value="Active">Active</option>
                    <option value="Consider">Consider</option>
                  </select>
                </div>
              </td>
              <td><a href="#!" @click="add" class="btn btn-waves">add</a></td>
            </tr>
          </tbody>
        </table>
           
      </div>
      

      <div class="col-lg-6  col-sm-12 card1 table-responsive text-center">
        <!-- projectionsData table -->
        <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
          <thead class="has-gutter">
            <tr><th v-for="column in columns2" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>

            <tr v-for="(weeklyStatus) in weeklyStatusData"  :key="weeklyStatus.id">
              
              <td >{{weeklyStatus.weekof | moment("MMM D, YYYY")}}</td>
              <td >{{weeklyStatus.hours}}</td>
              <td >{{weeklyStatus.earned.toFixed(0)}}</td>
              <td >{{(weeklyStatus.earned/weeklyStatus.hours).toFixed(2)}}</td>
              
              
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-lg-6  col-sm-12 card1 table-responsive text-center">
        <!-- <small class="text-center">Cumulative Increased Earnings Over Time</small> -->
        <line-chart :data="chartData" :curve="false"></line-chart>
      </div>
    </div>


  </div>
</template>
<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
Vue.use(require("vue-moment"));
import {
  getProjectionsAPI,
  getProjectsAPI,
  addProjectsAPI
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

    let session = await Auth.currentSession();
      console.log(JSON.stringify(session))

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
    this.getProjects();
    this.getProjections();
  },

  data() {
    return {

      isLoading: false,
      fullPage: true,
      projectData: {},
      projectionsData: {},
      yearCols: {},
      columns1: ["Forecast", "Name", "Hours / Week", "Fixed / Hourly", "Start Date", "End Date", "Total Hours", "Hourly Rate", "Total Fee", "Status", ""],
      columns2: ["Week Of", "Hours", "Earned", "Effective Rate"],

      weekTotalHours:0,
      weekTotalEarned:0,

      input: {
        name: "",
        hours_week: "",
        fixed_hourly: "Hourly",
        startDate: "",
        endDate: "",
        totalHours:"",
        hourlyRate:"",
        totalFee:"",
        status:"Proposed"
      },
      editInput: {
        name: "",
        hours_week: "",
        fixed_hourly: "Hourly",
        startDate: "",
        endDate: "",
        totalHours:"",
        hourlyRate:"",
        totalFee:"",
        status:""
      },

      chartData: [],
      weeklyStatusData: [],
    }
  },

  methods: {
    changeJobType: function (event) {
      this.input.fixed_hourly = event.target.value;
    },
    changeStatus: function (event) {
      this.input.status = event.target.value;
    },

    getProjections() {
     
    },
    getProjects() {
      this.isLoading = true;
      getProjectsAPI().then(data => {
        this.projectData = data;
        console.log(JSON.stringify(this.projectData));
        this.isLoading = false;
        this.getWeeklyReport()
      });
    },
    addProjects(params) {
      this.isLoading = true;

      addProjectsAPI(params).then(data => {
        this.getProjects();
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
      
      // if (this.input.name === "") {
      //   this.$refs.name.focus();
      //   return;
      // }

      // if (this.input.hours_week === "") {
      //   this.$refs.hours_week.focus();
      //   return;
      // }

      // if (this.input.startDate === "" || this.input.endDate) {
      //   return;
      // }

      // if (this.input.totalHours === "") {
      //   this.$refs.totalHours.focus();
      //   return;
      // }
      // if (this.input.totalFee === "") {
      //   this.$refs.totalFee.focus();
      //   return;
      // }
      let params = {}

      params.user_id = "11134d33-a025-4d50-88a3-c629428ab542"
      params.name = this.input.name
      
      params.hours_per_week = this.input.hours_week
      params.total_hours = this.input.totalHours
      params.start_date = this.input.startDate
      params.end_date = this.input.endDate
      params.fixed_or_hourly = this.input.fixed_hourly
      params.hourly_rate = this.input.hourlyRate
      params.total_fee = this.input.totalFee
      params.status = this.input.status
      
      this.addProjects(params)

      for (var key in this.input) {
        this.input[key] = "";
      }
      this.$refs.name.focus();
    },
    //function to defintely delete data
    deleete: function(index) {
      this.projectData.splice(index, 1);
      this.getWeeklyReport()
    },


    /////////-------------- calculate modules -----------------

    getWeeklyReport() {
      let firstMonday = this.getMonday(this.getEarlistDateFromProjects())
      let lastMonday = this.getMonday(this.getLastDateFromProjects())
      let nextMonday = firstMonday

      //add chart data
      this.chartData = [];
      this.weeklyStatusData = []
      let chartEarnedItem = {};
      chartEarnedItem.name = 'Earned';
      chartEarnedItem.data = {};

      let chartEffectiveRateitem = {};
      chartEffectiveRateitem.name = 'Effective Rate';
      chartEffectiveRateitem.data = {};

      
      var i = 0;
     while (1) {
       i ++;
        nextMonday = this.getNextMonday(nextMonday)
        

        this.gethoursEarnedPerWeek(nextMonday)

        chartEarnedItem.data[this.getFormatDate(nextMonday)] =
          this.weekTotalEarned.toFixed(0);

        chartEffectiveRateitem.data[this.getFormatDate(nextMonday)] =
        (this.weekTotalEarned/this.weekTotalHours).toFixed(2);

        this.weeklyStatusData.push({'weekof': nextMonday, 'hours': this.weekTotalHours, 'earned':this.weekTotalEarned})

        if (nextMonday >= lastMonday) {
          break;
        }

     }

     this.chartData.push(chartEarnedItem);
     this.chartData.push(chartEffectiveRateitem);
     
      console.log('-' + JSON.stringify(this.weeklyStatusData))
    },

    gethoursEarnedPerWeek(d) {
      this.weekTotalHours = 0
      this.weekTotalEarned = 0
      if (this.projectData.length > 0) {
        let _weekself = this
        this.projectData.forEach(function(project, index)
        {
          if (d >= new Date(project.start_date) && d <= new Date(project.end_date)) {
            // console.log('include date' + d)

            if( project.fixed_hourly == 0)//hourly
            {
              _weekself.weekTotalHours += project.hours_per_week
              _weekself.weekTotalEarned += project.hourly_rate * project.hours_per_week
            }else //fixed
            {
              let hourlyRate = project.total_fee/project.total_hours
              _weekself.weekTotalHours += project.hours_per_week
              _weekself.weekTotalEarned += hourlyRate * project.hours_per_week
            }

          }

        })
      }
    },

    getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff))
    },

    getNextMonday(d) {
      d = new Date(d);
      d.setDate(d.getDate() + (7-d.getDay())%7+1);
      return d
    },

    getFormatDate(d) {
      var today = d
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!

      var yyyy = today.getFullYear();
      if(dd<10){
          dd='0'+dd;
      } 
      if(mm<10){
          mm='0'+mm;
      } 
      var today = mm+'/'+dd+'/'+yyyy;
      return today
    },
    getEarlistDateFromProjects() {
      var earlistDate = new Date(2200, 1, 1);
       
      if (this.projectData.length > 0) {

        this.projectData.forEach(function(project, index)
        {
          if (earlistDate > new Date(project.start_date)) {
            // console.log('project.start_date' + earlistDate)
            earlistDate = new Date(project.start_date)
          }

        })
      }
      // console.log('earlist' + earlistDate)
      return earlistDate;
    },

    getLastDateFromProjects() {
      var lastDate = new Date(1980, 1, 1);
      
      if (this.projectData.length > 0) {

        this.projectData.forEach(function(project, index)
        {
         
          if (lastDate < new Date(project.end_date)) {
            lastDate = new Date(project.end_date)
          }
        })
      }
      // console.log('last' + lastDate)
      return lastDate;
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
