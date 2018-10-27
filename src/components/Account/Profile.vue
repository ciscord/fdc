<template>
  <div class="vld-parent row">
    <!-- user profile -->
    
        <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage"></loading>
        
    <div class="style-paper col-md-3 padding-top">
      <div class="form-group">
        <h6 class="card-title">Email address</h6>
        <fg-input  type="email" name="email" v-validate="modelValidations.email" :error="getError('email')" v-model="userData.email"></fg-input>
      </div>
      <div class="form-group">
        <h6 class="card-title">First Name</h6>
        <fg-input  type="firstname" name="firstname" v-validate="modelValidations.firstname" :error="getError('firstname')" v-model="userData.firstname"></fg-input>
      </div>
      <div class="form-group">
        <h6 class="card-title">Last Name</h6>
        <fg-input  type="lastname" name="lastname" v-validate="modelValidations.lastname" :error="getError('lastname')" v-model="userData.lastname" ></fg-input>
      </div>
    </div>
    <!-- user market place table -->
    <div class="col-md-9 padding-left">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Which marketplaces (Upwork, Golance, Fiverr, etc.) do you use?</h5>
        </div>
        <div class="card-body row">
          <div class="col-sm-12">
            <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
              <div class="hidden-columns">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div class="el-table__header-wrapper">
                <table cellspacing="0" cellpadding="0" border="0" class="marketplaces-table">
                  <thead class="has-gutter">
                    <tr class="text-primary">
                      <th colspan="2" rowspan="1" class="is-leaf">
                        <div class="cell">Marketplace</div>
                      </th>
                      <th colspan="2" rowspan="1" class="is-leaf">
                        <div class="cell">Profile URL</div>
                      </th>
                      <th colspan="2" rowspan="1" class="is-leaf">
                        <div class="cell"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="el-table__row"  v-for="(marketplace,index) in userData.marketplaces"  :key="marketplace.id">
                      <td rowspan="1" colspan="2" class=" ">
                        <div class="cell">{{marketplace.name}}</div>
                      </td>
                      <td rowspan="1" colspan="2" class="el-table_1_column_3  ">
                        <div class="cell">{{marketplace.profile_url}}</div>
                      </td>
                      <td rowspan="1" colspan="1" class="is-right action-buttons td-actions">
                        <div class="cell">
                          <button @click="deleete(index)" type="button" class="btn btn-icon btn-danger btn-sm">
                            <i class="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr class="last-row">
                      <td rowspan="1" colspan="3" class="el-table_1_column_2  ">
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
                          <a @click="add" class="btn btn-success add-btn"><i class="fa fa-plus" style="margin-right: 5px;"/> Add new</a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="el-table__column-resize-proxy" style="display: none;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row save-button">
      <a href="#!" @click="updateProfile" class="btn btn-primary">Save</a>
    </div>
  </div>
</template>
<style scoped lang="scss">
@media (min-width: 992px) {
  .padding-left {
    padding-left: 20px;
  }
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

.save-button {
  display:block;
  text-align: center;
  margin-left: 0;
}
.add-btn {
  color: white !important;
}
.el-table tr {
  background-color: #fff;
}

.el-table__header-wrapper tbody td, .el-table__footer-wrapper tbody td{
  background-color: #fff;
}
.marketplaces-table {
  width: 100%;
}
.marketplaces-table input {
  width: 50%;
}
.marketplaces-table tbody tr:hover {
  background-color: red !important;
}
.card {
  border-radius: 3px !important;
}
.card .card-body {
  padding-top: 0;
}
.padding-top {
  padding-top: 20px;
}
</style>
<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth, Analytics } from "aws-amplify";
import axios from "axios";
import { getProfileAPI, updateProfileAPI } from "./../../api/api";
import Loading from "vue-loading-overlay";
import { mapActions } from 'vuex';

import "vue-loading-overlay/dist/vue-loading.css";

export default {
  async beforeCreate() {
    try {
      let account = await Auth.currentAuthenticatedUser();
      this.$store.commit('saveUser', account)
    } catch (err) {
    }
  },
  components: { Loading },
  created() {
    this.setNavbarTitle('Profile');
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
    ...mapActions('UI', ['setNavbarTitle']),
    
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
      updateProfileAPI(this.userData).then(data => {
        this.userData = data;
        this.isLoading = false;
        console.log(JSON.stringify(this.userData));
        this.getProfile();
      });

      Analytics.record({ name: 'account profile update profile' })
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
      Analytics.record({ name: 'account profile add marketplace' })
    },
    //function to defintely delete data
    deleete: function(index) {
      this.userData.marketplaces.splice(index, 1);
      Analytics.record({ name: 'account profile delete marketplace' })
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

// .style-paper input {
//   width: 300px;
// }

.el-table .last-row td {
  border-bottom: none;
}

.card1 {
  background-color: #ffffff;
}
</style>
