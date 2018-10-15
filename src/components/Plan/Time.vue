<template>
  <div class="vld-parent">
    <!-- user profile -->

    <loading :active.sync="isLoading" 
    :can-cancel="true" 
    :is-full-page="fullPage"></loading>
        
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-6 card1 table-responsive text-center">
        <h4>Schedules</h4>
        <div class="row">
          <div class="col-lg-4"><a href="#!" @click="makeCurrent" class="btn btn-waves">Make Current</a></div>
          <div class="col-lg-4">
            <el-select size="large" placeholder="Single Select" v-model="selects.simple" @change="myFunction()">
              <el-option v-for="option in schedulesData"                             
                          :value="option.entity_id"
                          :label="option.name"
                          :key="option.entity_id">
              </el-option>
            </el-select>
          </div>
          <div class="col-lg-4"><a href="#!" @click="deleeteTime" class="btn btn-waves">Delete</a></div>
        </div>
        <table v-if="schedulesData.length != 0" cellspacing="0" cellpadding="0" border="0" class="el-table ">
          <thead class="has-gutter">
            <tr><th v-for="column in columns" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(activity, index) in schedulesData[currentIndex].activities"  :key="activity.id">
              <td>{{activity.name}}</td>
              <td>{{activity.frequency}}</td>
              <td>{{activity.hours}}</td>
              <td style="width: 18%; height:50px;"><a href="#!" @click="deleete(index)"><i class="fa fa-times"></i></a></td>
            </tr>
            <tr>
              <td>
                <div class="input-field">
                  <input class="form-control" placeholder="Activity" ref="activity" v-model="input.activity" id="activity" type="text">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  placeholder="Frequency" v-model="input.frequency" id="frequency" type="number">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  placeholder="Hours" v-model="input.hours" id="hours" type="number">
                </div>
              </td>
              <td><a href="#!" @click="add" class="btn btn-waves">add</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-lg-6 card1 table-responsive">
        
        <table cellspacing="0" cellpadding="0" border="0" class="mt-5">
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
            <tr>
              <td><strong>Weekly Potential:</strong></td>
              <td v-if="schedulesData.length != 0">${{hoursRate*schedulesData[currentIndex].available}}</td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
<script>
import Vue from "vue";
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
import { getSchedulesAPI, updateSchedulesAPI } from "./../../api/api";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
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
    this.getSchedules();
  },

  data() {
    return {
      isLoading: false,
      fullPage: true,
      schedulesData: [],
      hoursRate: 25,

      selects: {
        simple: ""
      },

      currentIndex: 0,
      columns: ["Activity", "Frequency", "Hours", ""],

      input: {
        activity: "",
        frequency: "",
        hours: ""
      },
      editInput: {
        activity: "",
        frequency: "",
        hours: ""
      }
    };
  },

  methods: {
    getSchedules() {
      this.isLoading = true;
      getSchedulesAPI().then(data => {
        this.schedulesData = data;

        this.currentIndex = 0;
        for (var i = 0; i < this.schedulesData.length; i++) {
          let schedule = this.schedulesData[i];
          if (schedule.is_current == true) {
            this.currentIndex = i;
            this.selects.simple = schedule.entity_id;
            break;
          }
        }

        this.isLoading = false;
      });
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

    makeCurrent: function() {},
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
    },
    //function to defintely delete data
    deleete: function(index) {
      this.schedulesData.splice(index, 1);
    },

    deleeteTime: function() {},

    myFunction: function() {
      var context = this;
      Vue.nextTick(function() {
        for (var i = 0; i < context.schedulesData.length; i++) {
          let schedule = context.schedulesData[i];
          if (schedule.entity_id == context.selects.simple) {
            context.currentIndex = i;
            break;
          }
        }
      });
    }
  }
};
</script>
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
