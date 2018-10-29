<template>
  <div class="row">
    <p>
      Your Public Profile, is designed to be the best-looking resume you’ve ever had.  The problem with profiles in
      the freelance marketplaces is that they are boring and generic.  This one is engineered to highlight what hiring
      managers are looking for in a developer and unlike a LinkedIn profile, this one is 100% about you - a way
      for you to sell you, not a way for someone else to sell ads.
    </p>
    <p>
      We're offering a Public Profile as part of the Act account level and it will look great.
    </p>
    <p>
      At the Grow level, we enhance your profile to make it an even more powerful personal sales tool.  With additional
      sections, video, and more you’ll skip the line to be at the top of the list when a hiring manager is looking to
      fill a position.
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
      this.setNavbarTitle('Profile Editor');
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
