<template>
  <div class="vld-parent">
    <!-- user profile -->
    
        <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage"></loading>
        
    <div class="row">
      <div class="col-lg-4 col-sm-3">
        <form>
            <div class="form-group">
              <label>Email address</label>
              <fg-input  type="email" name="email" v-validate="modelValidations.email" :error="getError('email')" v-model="userData.email"></fg-input>
            </div>
            <div class="form-group">
              <label>First Name</label>
              <fg-input  type="firstname" name="firstname" v-validate="modelValidations.firstname" :error="getError('firstname')" v-model="userData.firstname"></fg-input>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <fg-input  type="lastname" name="lastname" v-validate="modelValidations.lastname" :error="getError('lastname')" v-model="userData.lastname"></fg-input>
            </div>
        </form>
      </div>
    </div>
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-12 card1 table-responsive">
        <h4>Which marketplaces (Upwork, Golance, Fiverr, etc.) do you use?</h4>
        <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
          <thead class="has-gutter">
            <tr><th v-for="column in columns" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(marketplace,index) in userData.marketplaces"  :key="marketplace.id">
              <td>{{marketplace.name}}</td>
              <td>{{marketplace.profile_url}}</td>
              <td style="width: 18%; height:50px;"><a href="#!" @click="deleete(index)"><i class="fa fa-times"></i></a></td>
            </tr>
            <tr>
              <td>
                <div class="input-field">
                  <input class="form-control" placeholder="Name" ref="name" v-model="input.name" id="name" type="text">
                </div>
              </td>
              <td>
                <div class="input-field">
                  <input class="form-control"  placeholder="Profile URL" v-model="input.profile_url" id="profile_url" type="text">
                </div>
              </td>
              <td><a href="#!" @click="add" class="btn btn-waves">add</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
<!-- // submit button -->
    <div class="row">
      <a href="#!" @click="updateProfile" class="btn btn-success">Save</a>
    </div>
  </div>
</template>
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
