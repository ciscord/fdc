<template>
  <div class="vld-parent">
    <!-- user profile -->
    
        <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage"></loading>
        
    <div class="row style-paper">
        <div class="form-group col-md-4">
          <h4 class="card-title">Email address</h4>
          <fg-input  type="email" name="email" v-validate="modelValidations.email" :error="getError('email')" v-model="userData.email"></fg-input>
        </div>
        <div class="form-group col-md-4">
          <h4 class="card-title">First Name</h4>
          <fg-input  type="firstname" name="firstname" v-validate="modelValidations.firstname" :error="getError('firstname')" v-model="userData.firstname"></fg-input>
        </div>
        <div class="form-group col-md-4">
          <h4 class="card-title">Last Name</h4>
          <fg-input  type="lastname" name="lastname" v-validate="modelValidations.lastname" :error="getError('lastname')" v-model="userData.lastname" ></fg-input>
        </div>
    </div>
    <!-- user market place table -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">Which marketplaces (Upwork, Golance, Fiverr, etc.) do you use?</h5>
      </div>
      <div class="card-body row">
        <div class="col-sm-12">
          <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
            <div class="hidden-columns">
              <div></div><div></div><div></div><div></div><div></div></div>
              <div class="el-table__header-wrapper">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 1555px;">
                  <colgroup><col name="el-table_1_column_1" width="48"><col name="el-table_1_column_2" width="379"><col name="el-table_1_column_3" width="376"><col name="el-table_1_column_4" width="376"><col name="el-table_1_column_5" width="376"><col name="gutter" width="0"></colgroup>
                  <thead class="has-gutter">
                    <tr class="text-primary">
                      <th colspan="2" rowspan="1" class="el-table_1_column_2     is-leaf">
                        <div class="cell">Marketplace</div>
                      </th>
                      <th colspan="2" rowspan="1" class="el-table_1_column_3     is-leaf">
                        <div class="cell">Profile URL</div>
                      </th>
                     
                      <th colspan="1" rowspan="1" class="el-table_1_column_5  is-right action-buttons td-actions  is-leaf">
                        <!-- <div class="cell">Actions</div> -->
                      </th>
                      <th class="gutter" style="width: 0px; display: none;"></th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="el-table__body-wrapper is-scrolling-none">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 1555px;">
                <colgroup><col name="el-table_1_column_1" width="48"><col name="el-table_1_column_2" width="379"><col name="el-table_1_column_3" width="376"><col name="el-table_1_column_4" width="376"><col name="el-table_1_column_5" width="376"></colgroup>
                  <tbody>
                    <tr class="el-table__row"  v-for="(marketplace,index) in userData.marketplaces"  :key="marketplace.id">
                      <td rowspan="1" colspan="2" class="el-table_1_column_2  ">
                        <div class="cell">{{marketplace.name}}</div>
                      </td>
                      <td rowspan="1" colspan="2" class="el-table_1_column_3  ">
                        <div class="cell">{{marketplace.profile_url}}</div>
                      </td>
                     
                      <td rowspan="1" colspan="1" class="el-table_1_column_5 is-right action-buttons td-actions">
                        <div class="cell">
                          <button @click="deleete(index)" type="button" class="btn btn-icon btn-danger btn-sm">
                           <i class="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="1" colspan="2" class="el-table_1_column_2  ">
                        <div class="input-field">
                          <input class="form-control" placeholder="Name" ref="name" v-model="input.name" id="name" type="text">
                        </div>
                      </td>
                      <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                        <div class="input-field">
                          <input class="form-control"  placeholder="Profile URL" v-model="input.profile_url" id="profile_url" type="text">
                        </div>
                      </td>
                      <td rowspan="1" colspan="2" class="el-table_1_column_5 is-right action-buttons td-actions">
                        <div class="cell">
                          <a  @click="add" class="btn btn-success btn-icon add-btn"><i class="fa fa-plus"></i></a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th rowspan="1" colspan="5" class="el-table_1_column_5 is-right action-buttons td-actions">
                        <div class="row save-button-row">
                          <a href="#!" @click="updateProfile" class="btn btn-primary">Save</a>
                        </div>
                      </th>
                    </tr>
                  </tbody>
             </table>
           </div><div class="el-table__column-resize-proxy" style="display: none;"></div></div></div></div>
         </div>
  </div>
</template>
<style scoped>
  .style-paper {
      -moz-transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
    -ms-transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
    -o-transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
    -webkit-transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
    background-color: #fff;
    border: 0;
    border-radius: 12px;
    box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
    color: #252422;
    margin: 0px;
    margin-bottom: 20px;
    position: relative;
    transition: transform .3s cubic-bezier(.34,2,.6,1),box-shadow .2s ease;
}
.save-button-row {
  display:block;
  text-align: center;
}
.add-btn {
  color: white !important;
}
</style>
<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
import axios from "axios";
import { getProfileAPI, updateProfileAPI } from "./../../api/api";
import Loading from "vue-loading-overlay";

import "vue-loading-overlay/dist/vue-loading.css";

export default {
  components: { Loading },

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
    this.getProfile();
  },

  data() {
    return {
      isLoading: false,
      fullPage: true,
      userData: {
        entity_id: "",
        version: "",
        changed_by_id: "",
        user_id: "",
        changed_on: "",
        firstname: "",
        lastname: "",
        email: "",
        marketplaces: []
      },

      modelValidations: {
        email: {
          required: true,
          email: true
        },
        firstname: {
          required: true,
          min: 3
        },
        lastname: {
          required: true,
          min: 3
        }
      },

      columns: ["Marketplace", "Profile URL", ""],

      input: {
        name: "",
        profile_url: ""
      },
      editInput: {
        name: "",
        profile_url: ""
      }
    };
  },

  methods: {
    getProfile() {
      this.isLoading = true;
      getProfileAPI().then(data => {
        this.userData = data;
        this.isLoading = false;
        console.log(JSON.stringify(this.userData));
      });
    },
    updateProfile() {
      this.isLoading = true;
      // var params = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
      updateProfileAPI(this.userData).then(data => {
        this.userData = data;
        this.isLoading = false;
        console.log(JSON.stringify(this.userData));
        this.getProfile();
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
      this.userData.marketplaces.push({
        name: this.input.name,
        profile_url: this.input.profile_url
      });

      for (var key in this.input) {
        this.input[key] = "";
      }
      this.$refs.name.focus();
    },
    //function to defintely delete data
    deleete: function(index) {
      this.userData.marketplaces.splice(index, 1);
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
