<template>
<div class="vld-parent">
  <div>
    <div v-bind:class="amplifyUI.sectionHeader">{{options.header}}</div>
    <div v-bind:class="amplifyUI.sectionBody">
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">Email *</div>
        <input v-bind:class="amplifyUI.input" v-model="username" placeholder="Email" autofocus />
      </div>
      <div v-bind:class="amplifyUI.formField" v-if="sent">
        <div v-bind:class="amplifyUI.inputLabel">Verification Code *</div>
        <input v-bind:class="amplifyUI.input" v-model="code" placeholder="Verification Code" autofocus />
      </div>
      <div v-bind:class="amplifyUI.formField" v-if="sent">
        <div v-bind:class="amplifyUI.inputLabel">New Password *</div>
        <input v-bind:class="amplifyUI.input" v-model="password" type="password" placeholder="New Password" autofocus />
      </div>
    </div>

  <div>
      <span v-bind:class="amplifyUI.sectionFooterPrimaryContent">
        <button v-if="!sent" class="btn btn-primary" v-on:click="submit" :disabled="!username">Submit</button>
        <button v-if="sent" v-bind:class="amplifyUI.button" v-on:click="verify" :disabled="!username">Verify</button>
      </span>
      <span v-bind:class="amplifyUI.sectionFooterSecondaryContent">
        
        <a v-if="sent" v-bind:class="amplifyUI.a" v-on:click="submit">Resend Code</a>
      </span>
    </div>
    <div class="error" v-if="error">
      {{ error }}
    </div>
  </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import * as amplifyUI from "@aws-amplify/ui";
import { mapActions } from 'vuex';

export default {
  name: "PasswordReset",
  props: ["forgotPasswordConfig"],
  data() {
    return {
      username: '',
      code: "",
      password: "",
      error: "",
      sent: false,
      logger: {},
      amplifyUI
    };
  },
  computed: {
    options() {
      const defaults = {
        header: "Reset Password"
      };
      return Object.assign(defaults, this.forgotPasswordConfig || {});
    }
  },
  created() {
    this.setNavbarTitle('Reset Password');
  },
  mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    // this.username = this.$store.getters.user.attributes.email;
    this.username = this.$store.getters.user.attributes.email

    if (this.username != undefined && this.username != '') {
      this.submit()
    }
  },
  methods: {
    ...mapActions('UI', ['setNavbarTitle']),

    submit: function() {
      this.$Amplify.Auth.forgotPassword(this.username)
        .then(() => {
          this.sent = true;
          this.logger.info("forgotPassword success");
        })
        .catch(e => this.setError(e));
    },
    verify: function() {
      this.$Amplify.Auth.forgotPasswordSubmit(
        this.username,
        this.code,
        this.password
      )
        .then(() => {
          this.error = "Your password updated successfully!"
          alert("Your password updated successfully!");
          
        })
        .catch(e => this.setError(e));
    },
    signIn: function() {
      AmplifyEventBus.$emit("authState", "signedOut");
    },
    setError: function(e) {
      this.error = e.message || e;
      this.logger.error(this.error);
    }
  }
};
</script>
