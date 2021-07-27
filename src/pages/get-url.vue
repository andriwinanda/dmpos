<template>
  <f7-page login-screen>
    <f7-login-screen-title>
      <img src="https://dswip.com/img/logo2.png" alt width="200" />
    </f7-login-screen-title>
    <f7-list form>
      <f7-list-input
        type="text"
        name="token"
        placeholder="Token"
        :value="token"
        :autofocus="true"
        @keypress.native.enter.prevent="getUrl()"
        @input="token = $event.target.value"
      ></f7-list-input>
    </f7-list>
    <f7-list>
      <f7-list-button fill raised title="Get url" @click.prevent="getUrl()"></f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script>
import { getBaseUrl, getToken } from "../js/localstorage-helper";

export default {
  data() {
    return {
      token: ""
    };
  },
  methods: {
    
    getUrl() {
      this.$f7.dialog.preloader();
      this.axios
        .get("https://crmsaas.dswip.com/sales/get_url/" + this.token)
        .then(res => {
          this.$f7.dialog.close();
          let url = res.data.response;
          this.$store.dispatch("login/getUrl", url).then(res => {
            this.$f7router.navigate("/login");
          });
        })
        .catch(error => {
          this.$f7.dialog.close();
          if (!error.response || error.response.status === 500) {
            this.$f7.dialog.alert(
              "Please check your network connection!",
              "Connection Lost!"
            );
          } else if (error.response.status === 401) {
            this.$f7.dialog.alert("Token incorrect", "Incorrect");
          }
        });

      // AuthService.login(this.username, this.password).then(auth => {
      // }).catch(error => {
      //   console.log('error', error);
      // })
    }
  },
  created() {
    console.log(getBaseUrl())
    if (getToken()) this.$store.dispatch("login/logout");
    else if (getBaseUrl()) window.location.replace("/login");
  }
};
</script>