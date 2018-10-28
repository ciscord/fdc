<template>
  <div class="vld-parent">
    <!-- user profile -->
    
        <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage"></loading>
        
    <div class="row">
      <div class="col-lg-12 col-sm-12 row affiliate-info">
        <div class="style-paper col-lg-7">
          <h4> Affiliate Info</h4>
          <hr>
          <table cellspacing="0" cellpadding="0" border="0" class="el-table">
            <tbody>
              <tr>
                <td><b>Your Affiliate ID</b></td>
                <td>{{ affiliateId }}</td>
              </tr>
              <tr class="last-row">
                <td><b>Long Affiliate Link</b></td>
                <td><a v-if="affiliateId" :href="affiliateLink" target="_blank">{{affiliateLink}}</a></td>
              </tr>
              <tr>
                <td><b>Short Affiliate Link</b></td>
                <td><a v-if="affiliateId" :href="affiliateShortLink" target="_blank">{{affiliateShortLink}}</a></td>
              </tr>
            </tbody>
          </table>
          <!-- <h6><b> </b></h6>
          <h6><b> </b></h6><br> -->
        </div>
        <div class="style-paper summary-cont col-lg-5 ml-auto">
          <h4>Summary</h4>
          <hr>
          <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
            <tbody>
              <tr>
                <td><b>Total Pending</b></td>
                <td>${{ affiliatePending }}</td>
              </tr>
              <tr class="last-row">
                <td><b>Total Paid</b></td>
                <td>${{ affiliatePaid }}</td>
              </tr>
            </tbody>
          </table>
          <!-- <h6><b> </b></h6>
          <h6><b></b></h6> -->
        </div>
      </div>
    </div>
    <!-- user market place table -->
    <div class="row">
      <div class="col-lg-12 col-sm-12 row affiliate-info">
        <div class="style-paper col-lg-7">
          <h4>Transaction History</h4>
          <table cellspacing="0" cellpadding="0" border="0" class="el-table ">
            <thead class="has-gutter">
              <tr class="text-primary"><th v-for="column in columns" :key="column.id">{{column}}</th></tr>
            </thead>
            <tbody>
              <tr
                  v-for="(affiliate, id) in affiliateData"  :key="affiliate.id"
                  :class="[affiliateData.length === id + 1 ? 'last-row' : '']">
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

  </div>
</template>
<style scoped>
  @media only screen and (max-width: 991px) {
    .summary-cont{
      margin-right: 0 !important;
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
.content {
  margin-left: 20px;
}
.el-table::before {
  height: 0px;
}
.summary-cont {
  margin-right: -15px;
}
.affiliate-info {
  padding-right: 0;
}
h6 {
  text-transform: none;
}
</style>
<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
import { getAffiliateAPI, getProfileAPI } from "./../../api/api";
import Loading from "vue-loading-overlay";
import { mapActions } from 'vuex';

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

  created() {
    this.setNavbarTitle('Affilate');
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
      affiliateShortLink: "",
      affiliateData: [],
      affiliatePending: 0,
      affiliatePaid: 0,

      columns: ["Date", "Action", "Amount", "Status"]
    };
  },

  methods: {
    ...mapActions('UI', ['setNavbarTitle']),
    
    getProfile() {
      getProfileAPI().then(data => {
        this.isLoading = false;
        this.affiliateId = data.affiliate_id;

        this.affiliateLink = 'https://www.freelancedevelopercoach.com/?a=' + this.affiliateId
        this.affiliateShortLink = 'http://frdvc.com/?a=' + this.affiliateId
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
.el-table .last-row td {
  border-bottom: none;
}

.el-table .td-actions {
  button.btn {
    margin-right: 5px;
  }
}

.vdp-datepicker__calendar-button {
  position: absolute;
  display: block;
  padding: 5px;
  float: right;
  right: 32px;
}

.card1 {
  background-color: #ffffff;
}
</style>
