<template>
  <div class="vld-parent">
    
    
    <loading :active.sync="isLoading" 
    :can-cancel="true" 
    :is-full-page="fullPage"></loading>
        
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-12 col-sm-12 style-paper table-responsive">
        
        <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
          <thead class="has-gutter">
            <tr class="text-primary"><th class="text-center" v-for="column in columns1" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(project,index) in projectData"  :key="project.id">
              <td v-if="project.checked"><input type="checkbox" checked v-model="project.checked" @change="checkProject()"></td>
              <td v-if="!project.checked"><input type="checkbox" checked v-model="project.checked" @change="uncheckProject()"></td>
              <td class="text-center">{{project.name}}</td>
              <td class="text-center">{{project.hours_per_week}}</td>
              <td class="text-center">{{(project.fixed_or_hourly == 0? 'hourly':'fixed')}}</td>
              <td class="text-center">{{project.start_date}}</td>
              <td class="text-center">{{project.end_date}}</td>
              <td class="text-center">{{project.total_hours}}</td>
              <td class="text-center">${{project.hourly_rate}}</td>
              <td class="text-center">${{project.total_fee}}</td>
              <td class="text-center">
                <select v-model="project.status" @change="updateProject(project)">
                  <option
                      v-for="(status, index) in Object.keys(statusMap)" :key="index"
                      :value="status">
                    {{ statusMap[status] }}
                  </option>
                </select>
              </td>
              
              <td style="width: 40px; height:50px;" class="text-right"><button @click="deleteProject(index)" type="button" class="btn btn-icon btn-danger btn-sm"><i class="fa fa-times"></i></button></td>
            </tr>
            <tr class="last-row">
              <td></td>
              <td>
                <div class="input-field m-2">
                  <input class="form-control plan-projects-input-style"  ref="name" placeholder="Name" v-model="input.name" id="projects" type="text">
                </div>
              </td>
              <td>
                <div class="input-field m-2">
                  <input class="form-control plan-projects-input-style"  ref="hours_week" placeholder="Hours Week" v-model="input.hours_week" id="hours_week" type="number">
                </div>
              </td>
              <td>
                <div class="input-field m-2">
                  <select class="text-primary plan-projects-select" v-on:change="changeJobType($event)" v-model="input.fixed_hourly">
                    <option selected="selected" value="Hourly">Hourly</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>
              </td>

              <td>
                <div class="input-field m-2 mx-auto">
                  <datepicker
                      :value="input.startDate"
                      class="mx-auto plan-projects-input-style"
                      v-model="input.startDate"
                      format="yyyy-MM-dd"
                      calendar-button-icon="far fa-calendar-alt"
                      :calendar-button="true">
                  </datepicker>
                </div>
              </td>

              <td>
                <div class="input-field m-2 mx-auto ">
                  <datepicker
                      :value="input.endDate"
                      class="mx-auto plan-projects-input-style"
                      v-model="input.endDate"
                      format="yyyy-MM-dd"
                      calendar-button-icon="far fa-calendar-alt"
                      :calendar-button="true">
                  </datepicker>
                </div>
              </td>

              <td>
                <div class="input-field m-2 mx-auto">
                  <input class="form-control plan-projects-input-style"  ref="totalHours" placeholder="Total Hours" v-model="input.totalHours" id="totalHours" type="number">
                </div>
              </td>
              <td>
                <div class="input-field m-2 mx-auto">
                  <input class="form-control plan-projects-input-style"  ref="hourlyRate" placeholder="Hourly Rate" v-model="input.hourlyRate" id="hourlyRate" type="number">
                </div>
              </td>
              <td>
                <div class="input-field m-2 mx-auto">
                  <input class="form-control plan-projects-input-style"  ref="totalFee" placeholder="TotalFee" v-model="input.totalFee" id="totalFee" type="number">
                </div>
              </td>
              <td>
                <div class="input-field pr-3 m-2 mx-auto">
                  <select class="text-primary plan-projects-select" v-on:change="changeStatus($event)" v-model="input.status">
                    <option
                        v-for="(status, index) in Object.keys(statusMap)" :key="index"
                        :selected="index === 0"
                        :value="status">
                      {{ statusMap[status] }}
                    </option>
                  </select>
                </div>
              </td>
              <td  class="text-right">
                <a  @click="add" class="btn btn-success add-btn"><i class="fa fa-plus" style="margin-right: 5px;"/> Add new</a>
              </td>
            </tr>
          </tbody>
        </table>
           
      </div>
      

      <div class="col-lg-6 col-sm-12 style-paper text-center">
        <!-- projectionsData table -->
        <table cellspacing="0" cellpadding="0" border="0" class="el-table plan-projects-table">
          <thead class="has-gutter">
            <tr class="text-primary"><th class="text-center" v-for="column in columns2" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>

            <tr
                v-for="(weeklyStatus, id) in weeklyStatusData"
                :key="weeklyStatus.id"
                :class="[weeklyStatusData.length === id + 1 ? 'last-row' : '']">
              
              <td class="text-center">{{weeklyStatus.weekof | moment("MMM D, YYYY")}}</td>
              <td class="text-center">{{weeklyStatus.hours}}</td>
              <td class="text-center">{{weeklyStatus.earned.toFixed(0)}}</td>
              <td class="text-center">{{(weeklyStatus.earned/weeklyStatus.hours).toFixed(2)}}</td>
              
              
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-lg-6 plan-project-chart col-sm-12 text-center remove-paddings">
        <div class="margin-left col-lg-12 col-sm-12 style-paper">
        <!-- <small class="text-center">Cumulative Increased Earnings Over Time</small> -->
          <line-chart :data="chartData" :dataset="{borderWidth:1}" :curve="false" :colors="['#51cbce', '#ef8157', '#6bd098','#66615b', '#cac4ae']"></line-chart>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth, Analytics } from "aws-amplify";
import { mapActions } from 'vuex';
Vue.use(require("vue-moment"));
import {
  getProjectsAPI,
  addProjectsAPI,
  updateProjectsAPI
} from "./../../api/api";
import Loading from "vue-loading-overlay";
import Datepicker from "vuejs-datepicker";
import VueChartkick from "vue-chartkick";
import Chart from "chart.js";
import Vue from "vue";
Vue.use(VueChartkick, { adapter: Chart });
import "vue-loading-overlay/dist/vue-loading.css";

const statusMap = {
  0: 'Proposed',
  1: 'Active',
  2: 'Lost'
};

export default {
  components: {
    Loading,
    Datepicker
  },

  async beforeCreate() {
    let session = await Auth.currentSession();
    console.log(JSON.stringify(session));

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
    this.setNavbarTitle('Projects');
  },

  mounted() {
    this.getProjects();
  },

  data() {
    return {
      statusMap,

      isLoading: false,
      fullPage: true,
      projectData: {},
      projectionsData: {},
      yearCols: {},
      columns1: [
        "Forecast",
        "Name",
        "Hours / Week",
        "Fixed / Hourly",
        "Start Date",
        "End Date",
        "Total Hours",
        "Hourly Rate",
        "Total Fee",
        "Status",
        ""
      ],
      columns2: ["Week Of", "Hours", "Earned", "Effective Rate"],

      weekTotalHours: 0,
      weekTotalEarned: 0,

      input: {
        name: "",
        hours_week: "",
        fixed_hourly: "Hourly",
        startDate: "",
        endDate: "",
        totalHours:"",
        hourlyRate:"",
        totalFee:"",
        status: 0
      },
      editInput: {
        name: "",
        hours_week: "",
        fixed_hourly: "Hourly",
        startDate: "",
        endDate: "",
        totalHours: "",
        hourlyRate: "",
        totalFee: "",
        status: ""
      },

      chartData: [],
      weeklyStatusData: []
    };
  },

  methods: {
    ...mapActions('UI', ['setNavbarTitle']),

    changeJobType: function (event) {
      this.input.fixed_hourly = event.target.value;
    },
    changeStatus: function(event) {
      this.input.status = event.target.value;
    },
    getProjects() {
      this.isLoading = true;
      getProjectsAPI().then(data => {
        this.projectData = data;
        this.projectData.forEach(function(project, index) {
          project.checked = true;
        });
        this.isLoading = false;
        this.getWeeklyReport();
      });
    },
    addProjects(params) {
      this.isLoading = true;

      addProjectsAPI(params).then(data => {
        this.getProjects();
      });
    },

    updateProject(project) {
      project.status = parseInt(project.status)
      this.isLoading = true;

      updateProjectsAPI(project).then(data => {
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
      let params = {}

      params.name = this.input.name
      
      params.hours_per_week = parseFloat(this.input.hours_week)
      params.total_hours = parseFloat(this.input.totalHours)
      params.start_date = this.input.startDate
      params.end_date = this.input.endDate
      params.fixed_or_hourly = this.input.fixed_hourly
      params.hourly_rate = parseFloat(this.input.hourlyRate)
      params.total_fee = parseFloat(this.input.totalFee)
      params.status = parseInt(this.input.status)
      
      this.addProjects(params)


      for (var key in this.input) {
        this.input[key] = "";
      }
      this.$refs.name.focus();
      Analytics.record({ name: "plan projects add project" });
    },
    deleteProject: function(index) {
      this.projectData.splice(index, 1);
      this.getWeeklyReport();
      Analytics.record({ name: "plan projects delete project" });
    },

    checkProject: function() {
      this.getWeeklyReport();
      Analytics.record({ name: "plan projects enable forecast" });
    },
    uncheckProject: function() {
      this.getWeeklyReport();
      Analytics.record({ name: "plan projects disable forecast" });
    },

    /////////-------------- calculate modules -----------------

    getWeeklyReport() {
      let firstMonday = this.getMonday(this.getEarlistDateFromProjects());
      let lastMonday = this.getMonday(this.getLastDateFromProjects());
      let nextMonday = firstMonday;

      //add chart data
      this.chartData = [];
      this.weeklyStatusData = [];
      let chartEarnedItem = {};
      chartEarnedItem.name = "Earned";
      chartEarnedItem.data = {};

      let chartEffectiveRateitem = {};
      chartEffectiveRateitem.name = "Effective Rate";
      chartEffectiveRateitem.data = {};

      var i = 0;
      while (1) {
        i++;
        nextMonday = this.getNextMonday(nextMonday);

        this.gethoursEarnedPerWeek(nextMonday);

        chartEarnedItem.data[
          this.getFormatDate(nextMonday)
        ] = this.weekTotalEarned.toFixed(0);

        chartEffectiveRateitem.data[this.getFormatDate(nextMonday)] = (
          this.weekTotalEarned / this.weekTotalHours
        ).toFixed(2);

        this.weeklyStatusData.push({
          weekof: nextMonday,
          hours: this.weekTotalHours,
          earned: this.weekTotalEarned
        });

        if (nextMonday >= lastMonday) {
          break;
        }
      }

      this.chartData.push(chartEarnedItem);
      this.chartData.push(chartEffectiveRateitem);
    },

    gethoursEarnedPerWeek(d) {
      this.weekTotalHours = 0;
      this.weekTotalEarned = 0;
      if (this.projectData.length > 0) {
        let _weekself = this;
        this.projectData.forEach(function(project, index) {
          if (project.checked) {
            if (
              d >= new Date(project.start_date) &&
              d <= new Date(project.end_date)
            ) {
              if (project.fixed_hourly == 0) {
                //hourly
                _weekself.weekTotalHours += project.hours_per_week;
                _weekself.weekTotalEarned +=
                  project.hourly_rate * project.hours_per_week;
              } //fixed
              else {
                let hourlyRate = project.total_fee / project.total_hours;
                _weekself.weekTotalHours += project.hours_per_week;
                _weekself.weekTotalEarned +=
                  hourlyRate * project.hours_per_week;
              }
            }
          }
        });
      }
    },

    getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },

    getNextMonday(d) {
      d = new Date(d);
      d.setDate(d.getDate() + ((7 - d.getDay()) % 7) + 1);
      return d;
    },

    getFormatDate(d) {
      var today = d;
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!

      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      var today = mm + "/" + dd + "/" + yyyy;
      return today;
    },
    getEarlistDateFromProjects() {
      var earlistDate = new Date(2200, 1, 1);

      if (this.projectData.length > 0) {
        this.projectData.forEach(function(project, index) {
          if (earlistDate > new Date(project.start_date)) {
            // console.log('project.start_date' + earlistDate)
            earlistDate = new Date(project.start_date);
          }
        });
      }
      // console.log('earlist' + earlistDate)
      return earlistDate;
    },

    getLastDateFromProjects() {
      var lastDate = new Date(1980, 1, 1);

      if (this.projectData.length > 0) {
        this.projectData.forEach(function(project, index) {
          if (lastDate < new Date(project.end_date)) {
            lastDate = new Date(project.end_date);
          }
        });
      }
      // console.log('last' + lastDate)
      return lastDate;
    }
  }
};
</script>

<style scoped>
  .vdp-datepicker input {
    margin: 0 auto;
  }
  @media (max-width: 991px) {
    .remove-paddings {
      padding-left: 0;
      padding-right: 0;
    }
  }
  @media (min-width: 992px) {
    .remove-paddings {
      padding-right: 0;
    }
    /* .margin-left {
      margin-left: 30px;
    } */
  }
</style>
<style>
  .el-table--group::after, .el-table--border::after, .el-table::before {
    background-color: transparent !important; 
  }
  .plan-projects-select {
    background-color: white;
    padding: 5px;
    border: 1px solid #51cbce;
    border-radius: 3px;
  }
  .plan-projects-input-style {
    width: 80%;
    display: block;
    margin: 0 auto;
  }
  .vdp-datepicker input {
    width: 80%;
    display: block;
    padding:5px;
    background-color: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    color: #66615b;
    line-height: normal;
    font-size: 14px;
    -webkit-transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    -moz-transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    -o-transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    -ms-transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .plan-project-chart {
    height: 100%;
  }
</style>
<style lang="scss">
.el-table .last-row td {
  border-bottom: none;
}
.vdp-datepicker__calendar {
  position: fixed;
  display: block;
}
</style>
