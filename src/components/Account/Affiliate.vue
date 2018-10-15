<template>
  <div class="vld-parent">
    <!-- user profile -->
    
        <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage"></loading>
        
    <div class="row">
      <div class="col-lg-12 col-sm-3">
        
        <h4><b> Affiliate Info</b></h4>
        
        <h5><b>Your Affiliate ID:</b>{{affiliateId}}</h5>
        <h5><b>Your Affiliate Link:</b><a v-if="affiliateId" :href="'https://app.freelancedevelopercoach.com/sign-up/?affiliate-id=' + affiliateId">https://app.freelancedevelopercoach.com/sign-up/?affiliate-id{{affiliateId}}</a></h5><br>
        <h4><b>Summary</b></h4>
        <h5><b>Total Pending:</b>${{affiliatePending}}</h5>
        <h5><b>Total Paid:</b>${{affiliatePaid}}</h5>
      </div>
    </div>
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-12 card1 table-responsive">
        <h4>Transaction History</h4>
        <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
          <thead class="has-gutter">
            <tr><th v-for="column in columns" :key="column.id">{{column}}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(affiliate) in affiliateData"  :key="affiliate.id">
              <td>{{ affiliate.timestamp | moment("MMM D, YYYY") }}</td>
              <td>{{affiliate.action}}</td>
              <td>${{affiliate.amount}}</td>
              <td>{{affiliate.status}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
import { getAffiliateAPI, getProfileAPI } from "./../../api/api";
import Loading from "vue-loading-overlay";

import "vue-loading-overlay/dist/vue-loading.css";
import Vue from "vue";
Vue.use(require("vue-moment"));
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
    this.getAffiliate();
    this.getProfile();
  },

  data() {
    return {
      isLoading: false,
      fullPage: true,

      affiliateId: "",
      affiliateLink: "",
      affiliateData: [],
      affiliatePending: 0,
      affiliatePaid: 0,

      columns: ["Date", "Action", "Amount", "Status"]
    };
  },

  methods: {
    getProfile() {
      getProfileAPI().then(data => {
        this.isLoading = false;
        this.affiliateId = data.affiliate_id;
      });
    },

    getAffiliate() {
      this.isLoading = true;
      getAffiliateAPI().then(data => {
        this.affiliateData = data;
        this.affiliatePaid = 0;
        this.affiliatePending = 0;
        for (var i = 0; i < this.affiliateData.length; i++) {
          let affiliate = this.affiliateData[i];

          if (affiliate.status === "pending") {
            this.affiliatePending += affiliate.amount;
          } else if (affiliate.status === "paid") {
            this.affiliatePaid += affiliate.amount;
          }
        }
      });
    },

    getError(fieldName) {
      return this.errors.first(fieldName);
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
