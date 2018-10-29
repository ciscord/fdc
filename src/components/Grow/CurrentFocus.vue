<template>
  <div class="row">
    <p>
      After your strength analysis is complete, it’s time for you to choose the direction for your personal growth
      journey.  We’ll give you the guidance for your focused improvement, but you’re in the driver’s seat.  This screen
      will track your progress, provide the next steps, and help you reach one new level after another.
    </p>
    <p>
      This feature will be available as part of the Grow release in January.
    </p>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
 
  export default {
    created() {
      this.setNavbarTitle('Current Focus');
    },
    methods: {
      ...mapActions('UI', ['setNavbarTitle']),
    },
    components: {
      
    }
  }

</script>
<style>

</style>
