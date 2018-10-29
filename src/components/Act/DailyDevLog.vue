<template>
  <div class="row">
    <p>This is the feature that started it all!  Each member of my team currently gets a weekly review based on 3
    different habits which are then combined into an overall score.  It’s simple and incredibly effective.
    By telling them how things are going on such a short time frame, there’s always an opportunity to course-correct
    and become better.  It occurred to me that if developers simply practiced these good habits each day then their
    value would skyrocket.  BOOM - Freelance Developer Coach was born!  This screen only requires a few quick clicks
    each day to keep you on track - minimum effort and maximum value.
    </p>
    <p>
      This feature will be available as part of the Act release in December.
    </p>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
 
  export default {
    created() {
      this.setNavbarTitle('Daily Dev Log');
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
