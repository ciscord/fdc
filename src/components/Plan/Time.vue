
<template>
  <div class="vld-parent">

    <loading :active.sync="isLoading" 
    :can-cancel="true" 
    :is-full-page="fullPage"></loading>
        
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-8 style-paper text-center">
        <h4>Schedules</h4>
        <div class="row">
          <div class="col-lg-4 col-sm-4 text-left">
            <a @click="makeCurrent" class="btn btn-success make-current-btn-mobile-size">Make Current</a>
          </div>
          <div class="col-lg-4 col-sm-4">
            <el-select size="large" placeholder="Single Select" class="schedule-select" v-model="selects.simple" @change="selectSchedule()">
              <el-option v-for="option in schedulesData"                             
                          :value="option.entity_id"
                          :label="option.name"
                          :key="option.entity_id">
              </el-option>
              <el-option value="-1" label="Add New..." key="-1"/>
            </el-select>
          </div>
          <div class="col-lg-4 col-sm-4 text-right">
            <a  @click="deleeteSchedule" class="btn btn-danger delete-btn-mobile-size">Delete</a>
          </div>
        </div>
        <hr>
        <div v-if="selects.simple == -1" class="col-lg-12 schedules-table-content">
          <h4 class="card-title">Add Schedule</h4>
         
        </div>
        
        <div class="col-lg-12 schedules-table-content">
          <table v-if="schedulesData.length != 0" cellspacing="0" cellpadding="0" border="0" class="el-table mx-auto">
            <thead class="has-gutter">
              <tr class="text-primary" @click="selectAllActivities">
                <th><input type="checkbox" id="allActivities" v-model="selectedAllActivities"/>&nbsp;</th>
                <th v-for="column in columns" :key="column.id">{{column}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(activity, index) in schedulesData[currentIndex].activities"  :key="activity.id" @click="selectActivity(index)">
                <td><input type="checkbox" :value="index" v-model="activeActivities"></td>
                <td>{{activity.name}}</td>
                <td v-if="activity.frequency==7">Daily</td>
                <td v-if="activity.frequency==1">Weekly</td>
                <td>{{activity.hours}}</td>
                <td style="width: 18%; height:50px;" class="text-right">
                  <div class="cell">
                    <button @click="deleete(index)" type="button" class="btn btn-icon btn-danger btn-sm" v-show="activity.deleteable">
                     <i class="fa fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr class="last-row">
                <td></td>
                <td>
                  <div class="input-field col-lg-10 pl-0">
                    <input class="form-control" placeholder="Activity" ref="activity" @input="changeActivity()" v-model="input.activity" id="activity" type="text">
                  </div>
                  <div class="text-danger invalid-feedback" v-show="validActivityName" style="display: block;">
                    Invaild name.
                  </div>
                </td>
                <td>
                  <div class="input-field col-lg-10 pl-0">
                    <input class="form-control"  placeholder="Frequency" v-model="input.frequency" id="frequency" type="number">
                  </div>
                </td>
                <td>
                  <div class="input-field col-lg-10 pl-0">
                    <input class="form-control"  placeholder="Hours" v-model="input.hours" id="hours" type="number">
                  </div>
                </td>
                <td class="text-right">
                  <div class="cell">
                    <a  @click="add" class="btn btn-success add-btn"><i class="fa fa-plus" style="margin-right: 5px;"/> Add new</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-lg-4 row schedules-data-table">
        <div class="col-lg-11 style-paper mx-auto">
          <div style="text-align: center;"><h4>Shedules</h4></div>
          <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
            <tbody>
              <tr>
                <td><strong>Hours Allocated:</strong></td>
                <td v-if="schedulesData.length != 0">{{schedulesData[currentIndex].allocated}}</td>
              </tr>
              <tr>
                <td><strong>Hours Available:</strong></td>
                <td v-if="schedulesData.length != 0">{{schedulesData[currentIndex].available}}</td>
              </tr>
              <tr>
                <td><strong>Hours Rate:</strong></td>
                <td>${{hoursRate}}</td>
              </tr>
              <tr class="last-row">
                <td><strong>Weekly Potential:</strong></td>
                <td v-if="schedulesData.length != 0">${{hoursRate*schedulesData[currentIndex].available}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

<!-- modal -->
    <div v-if="showModal" class="modal-backdrop in"></div>
    <div v-if="showModal" class="modal ">
    <div class="modal-dialog">
        <div class="modal-content">
            
            <div class="modal-body">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true" @click="hideDialog">&times;</button>
                <h4 class="modal-title text-center">Add Schedule</h4>
              <fg-input  placeholder="Name" type="schedule" name="schedule" @input="changeScheduleName()" v-model="input.schedule" ></fg-input>
              <div class="text-danger invalid-feedback" style="display: block;" v-show="validScheduleName">
                The schedule value is not valid.
              </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary " @click="addSchedule" :disabled="validScheduleName">Submit</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth, Analytics } from "aws-amplify";
import {
  getSchedulesAPI,
  updateSchedulesAPI,
  addSchedulesAPI
} from "./../../api/api";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { mapActions } from 'vuex';
import {
  DatePicker,
  TimeSelect,
  Slider,
  Tag,
  Input,
  Button,
  Select,
  Option
} from "element-ui";

export default {
  components: {
    Loading,
    [Select.name]: Select,
    [Option.name]: Option
  },

  created() {
    this.setNavbarTitle('Time');
  },

  async mounted() {
    await this.getSchedules();
  },

  data() {
    return {
      //for modal input
      showModal: false,
      scheduleName: "",

      //loading
      isLoading: false,
      fullPage: true,

      //data
      schedulesData: [],
      hoursRate: 25,

      activeActivities: [],

      selects: {
        simple: ""
      },

      currentIndex: 0,
      columns: ["Activity", "Frequency", "Hours", ""],

      input: {
        activity: "",
        frequency: "",
        hours: "",
        schedule: ""
      },
      editInput: {
        activity: "",
        frequency: "",
        hours: ""
      },
      modelValidations: {
        schedule: {
          required: true,
          is_not: "current"
        }
      },
      validScheduleName: false,
      validActivityName: false
    };
  },

  computed: {
    selectedAllActivities: {
      get() {
        return this.activeActivities.length === this.schedulesData[this.currentIndex].activities.length;
      },
      set(val) {
        if (val) {
          this.activeActivities = this.schedulesData[this.currentIndex].activities.map((item, i) => i);
        } else {
          this.activeActivities = [];
        }
      }
    }
  },

  methods: {
    ...mapActions('UI', ['setNavbarTitle']),

    selectAllActivities() {
      this.selectedAllActivities = !this.selectedAllActivities;
    },

    selectActivity(id) {
      if (this.activeActivities.includes(id)) {
        this.activeActivities.splice(this.activeActivities.indexOf(id), 1);
      } else {
        this.activeActivities.push(id);
      }
    },
    
    async getSchedules() {
      this.isLoading = true;
      this.schedulesData = await getSchedulesAPI();
      this.currentIndex = 0;
      for (var i = 0; i < this.schedulesData.length; i++) {
        let schedule = this.schedulesData[i];
        for (var j = 0; j < schedule.activities.length; j++) {
          let activity = schedule.activities[j];
          if (
            activity.name.toLowerCase() == "sleep" ||
            activity.name.toLowerCase() == "eat" ||
            activity.name.toLowerCase() == "exercise"
          ) {
            activity.deleteable = false;
          } else {
            activity.deleteable = true;
          }
        }
        if (schedule.is_current == true) {
          this.currentIndex = i;
          this.selects.simple = schedule.entity_id;
        }
      }
      this.isLoading = false;
    },
    updateSchedules() {
      this.isLoading = true;
      updateSchedulesAPI(this.schedulesData[this.currentIndex]).then(data => {
        this.getSchedules();
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

    makeCurrent: function() {
      Analytics.record({ name: "plan time make current" });
    },

    changeActivity: function() {
      if (
        this.input.activity.toLowerCase() != "sleep" &&
        this.input.activity != "" &&
        this.input.activity.toLowerCase() != "eat" &&
        this.input.activity.toLowerCase() != "exercise"
      ) {
        this.validActivityName = false;
      } else {
        this.validActivityName = true;
      }
    },

    changeScheduleName: function() {
      if (
        this.input.schedule.toLowerCase() != "current" &&
        this.input.schedule != ""
      ) {
        this.validScheduleName = false;
      } else {
        this.validScheduleName = true;
      }
    },

    add: function() {
      if (this.input.activity === "") {
        this.$refs.activity.focus();
        return;
      }

      if (this.input.frequency === "") {
        this.$refs.frequency.focus();
        return;
      }

      if (this.input.hours === "") {
        this.$refs.hours.focus();
        return;
      }

      this.schedulesData[this.currentIndex].activities.push({
        name: this.input.activity,
        frequency: this.input.frequency,
        hours: this.input.hours
      });

      for (var key in this.input) {
        this.input[key] = "";
      }
      this.$refs.activity.focus();
      // this.updateSchedules()
      Analytics.record({ name: "plan time add schedule item" });
    },
    hideDialog () {
      this.showModal = false
    },
    addSchedule () {
      if (this.input.schedule == '') {
        return
      }
      Analytics.record({ name: "plan time add schedule" });
      let params = {
        user_id: this.$store.getters.user.username,
        name: this.input.schedule,
        is_current: false,
        allocated: 0,
        available: 168,
        activities: [
          { name: "Sleep", frequency: 7, hours: 8, deleteable: false },
          { name: "Eat", frequency: 7, hours: 2, deleteable: false },
          { name: "Exercise", frequency: 7, hours: 1, deleteable: false }
        ]
      };
      this.schedulesData.push(params);

      this.showModal = false;

      // need to implement addSchedule api integration
      // addSchedulesAPI(params).then(data => {
      //   this.getSchedules();
      // this.showModal = false
      // });
    },
    

    deleteTime () {
      if (!this.activeActivities.length) return;
      this.activeActivities.forEach(i => {
        this.deleteShedule(i);
      });
      this.activeActivities = [];
    },
    //function to defintely delete data
    deleete: function(index) {
      Analytics.record({ name: "plan time delete schedule item" });
      this.schedulesData[this.currentIndex].activities.splice(index, 1);
    },

    deleeteSchedule: function() {
      Analytics.record({ name: "plan time delete schedule" });
    },

    selectSchedule: function() {
      var context = this;
      Analytics.record({ name: "plan time change schedule" });

      this.activeActivities = [];
      Vue.nextTick(function() {
          var selectIndex = -1
          for (var i = 0; i < context.schedulesData.length; i++) {
            let schedule = context.schedulesData[i];
            if (schedule.entity_id == context.selects.simple) {
              context.currentIndex = i;
              selectIndex = i;
              break;
            }
          }
          if (selectIndex == -1) {
            context.showModal = true
            context.currentIndex = 0

        }
      });
    }
  }
};
</script>

<style>
.el-table .last-row td {
  border-bottom: none;
}
.modal-active{
	display:block;
}
.modal-backdrop.in {
    filter: alpha(opacity=50);
    opacity: .5;
}
.modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    display: block;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    outline: 0;
}

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
  .el-input--suffix .el-input__inner {
    margin-top:10px;
  }
  .el-select .el-input .el-select__caret{
    margin-top:5px;
  }
  .el-input--suffix .el-input__inner:hover {
    background-color: #51cbce;
  }
  .schedules-table-content {
    margin-top: 30px;
  }
  .add-btn {
    color: white !important;
  }
  .schedules-data-table {
    height: 100%;
  }
  .schedule-select {
    width: 100%;
  }
  .btn-lightgreen {
    background-color: #6bd098;
  }
  .el-select .el-input:hover .el-input__icon, .el-select .el-input:hover input {
    background-color: #51cbce !important;
  }
  .el-select .el-input:hover .el-input__icon, .el-select .el-input:hover {
    background-color: transparent !important;

  }
  
  @media (max-width: 575px){
    .make-current-btn-mobile-size {
      width: 100%;
    }
    .delete-btn-mobile-size {
      width: 100%;
    }
  }
</style>

<style lang="scss">
.el-table .td-actions {
  button.btn {
    margin-right: 5px;
  }
}
.card1 {
  background-color: #ffffff;
}
</style>
