<template>
  
  <div class="vld-parent">
    <div class="row ">
      <div class="fdc-right col-md-6">
      </div>
      <div class=" col-md-6">
      <label :for="cbId" class="form-check-label fdc-right"> Show dollar amounts bellow  </label>
      <input :id="cbId" type="checkbox" class="form-check-input fdc-right" checked v-model="showDollarAmount" @change="checkShowDollar()">
      
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-6" v-for="stats in statsCards" :key="stats.id">
        <stats-card :type="stats.type"
                    :icon="stats.icon"
                    :small-title="stats.title"
                    :title="stats.value">
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i>
            {{stats.footerText}}
          </div>
        </stats-card>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
  import { Auth, Analytics } from "aws-amplify";
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard';
  export default {
    async beforeCreate() {
      try {
        let account = await Auth.currentAuthenticatedUser();
        this.$store.commit('saveUser', account)
      } catch (err) {
      }
    },
    created() {
      this.setNavbarTitle('Dashboard');
    },
    methods: {
      ...mapActions('UI', ['setNavbarTitle']),

      checkShowDollar: function() {
      }
    },
    components: {
      StatsCard,
    },
    data () {
      return {
        showDollarAmount:false,
        statsCards: [
          {
            type: 'warning',
            icon: 'nc-icon nc-globe',
            title: 'Capacity',
            value: '105GB',
            footerText: 'Updated now',
            footerIcon: 'nc-icon nc-refresh-69'
          },
          {
            type: 'success',
            icon: 'nc-icon nc-money-coins',
            title: 'Revenue',
            value: '$1,345',
            footerText: 'Last day',
            footerIcon: 'nc-icon nc-calendar-60'
          },
          {
            type: 'danger',
            icon: 'nc-icon nc-vector',
            title: 'Errors',
            value: '23',
            footerText: 'In the last hour',
            footerIcon: 'nc-icon nc-bell-55'
          },
          {
            type: 'info',
            icon: 'nc-icon nc-favourite-28',
            title: 'Followers',
            value: '+45',
            footerText: 'Updated now',
            footerIcon: 'nc-icon nc-refresh-69'
          }
        ],
      }
    }
  }

</script>
<style>
.fdc-right {
  float: right;
  position: relative;
  margin-bottom: 5px;
}
</style>
