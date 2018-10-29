
<template>
  <div class="row">
    <p>
      To grow you need to know your strengths and your opportunities for improvement.  We’ll provide you with an
      easy-to-answer series of questions to uncover your current strengths along with the areas on which you
      should focus.  This is like sitting down with a personal coach to take your career to the next level -
      but without paying hundreds of dollars for the hour!
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
      this.setNavbarTitle('Strengths & Opportunities');
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
