<template>
  <div v-bind:class="amplifyUI.formSection">
    <div v-bind:class="amplifyUI.sectionHeader">{{options.header}}</div>
    <div v-bind:class="amplifyUI.sectionBody">
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">Code *</div>
        <input v-bind:class="amplifyUI.input" v-model="code" placeholder="Code" />
        <div v-bind:class="amplifyUI.hint">
          Lost your code?
          <a v-bind:class="amplifyUI.a" v-on:click="send">Resend Code</a>
        </div>
      </div>
    </div>
    <div v-bind:class="amplifyUI.sectionFooter">
      <span v-bind:class="amplifyUI.sectionFooterPrimaryContent">
        <button v-bind:class="amplifyUI.button" v-on:click="submit" :disabled="!code">Submit</button>
      </span>
      <span v-bind:class="amplifyUI.sectionFooterSecondaryContent">
        <a v-bind:class="amplifyUI.a" v-on:click="signIn">Back to Sign In</a>      
      </span>
    </div>
    <div class="error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>


<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import * as AmplifyUI from "@aws-amplify/ui";
import { paymentStripeAPI } from "./../../api/api";
export default {
  name: "ConfirmSignIn",
  props: ["confirmSignInConfig"],
  data() {
    return {
      verifyAttr: "",
      code: "",
      error: "",
      logger: {},
      amplifyUI: AmplifyUI
    };
  },
  computed: {
    options() {
      const defaults = {
        header: "Confirm Sign In",
        user: {}
      };
      return Object.assign(defaults, this.confirmSignInConfig || {});
    }
  },
  mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    if (Object.keys(this.options.user).length === 0) {
      this.setError("Valid user not received.");
    }
  },
  methods: {
    send: function() {
      this.$Amplify.Auth.verifyCurrentUserAttribute(this.verifyAttr)
        .then(data => {
          this.logger.info("verifyCurrentUserAttribute successs");
        })
        .catch(e => this.setError(e));
    },
    submit: function() {
      this.$Amplify.Auth.confirmSignIn(
        this.options.user,
        this.code,
        this.options.user.challengeName
      )
        .then(() => {
          this.logger.info("confirmSignIn successs");
          let params = {}

          params.amount = "2.0"
          params.currency = "usd"
          params.source = this.$cookie.get("stripe_token")
          params.plan_level = "Plan"
          params.affiliate_id = this.$cookie.get("affiliate_id")

          console.log('stripe api params'+JSON.stringify(params))
          paymentStripeAPI(params).then(data => {
            console.log('stripe api'+JSON.stringify(data))
          });

          AmplifyEventBus.$emit("authState", "signedIn");
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
