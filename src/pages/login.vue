<template>
  <f7-page login-screen>
    <f7-login-screen-title>
      <img src="https://dswip.com/img/logo2.png" alt width="200" />
    </f7-login-screen-title>
    <f7-list form>
      <f7-list-input
        type="text"
        name="username"
        placeholder="Username"
        :autofocus="true"
        :value="username"
        @input="username = $event.target.value"
      ></f7-list-input>
      <f7-list-input
        type="password"
        name="password"
        placeholder="Password"
        :value="password"
        @keypress.native.enter.prevent="login()"
        @input="password = $event.target.value"
      ></f7-list-input>
    </f7-list>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button fill color="orange" @click.prevent="reset()"
            >Reset</f7-button
          >
        </f7-col>
        <f7-col>
          <f7-button fill color="primary" @click.prevent="login()">{{
            $t("login.label")
          }}</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <!-- Language -->
    <f7-block>{{ $t("setting.langLabel") }}</f7-block>
    <f7-block>
      <f7-row>
        <f7-col v-for="entry in languages" :key="entry.title">
          <f7-button
            fill
            :color="lang === entry.language ? 'primary' : 'gray'"
            @click="changeLocale(entry.language)"
          >
            <span :iso="entry.flag" v-bind:squared="false" />
            {{ entry.title }}
          </f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
import { getBaseUrl, getToken } from "../js/localstorage-helper";
import myaxios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
      languages: [
        { flag: "us", language: "en", title: "English" },
        { flag: "id", language: "id", title: "Bahasa Indonesia" },
      ],
    };
  },
  methods: {
    login() {
      let userLogin = {
        user: this.username,
        pass: this.password,
      };
      this.$f7.dialog.preloader();
      myaxios
        .post(getBaseUrl() + "/login", userLogin)
        .then((res) => {
          this.$f7.dialog.close();
          let token = res.data.token;
          let log = res.data.log;
          this.axios
            .get(getBaseUrl() + "/login/decode_token", {
              headers: {
                "X-Auth-Token": token,
              },
            })
            .then((res) => {
              let dataLogin = {
                token: token,
                dataUser: res.data.content,
              };
              this.$store.dispatch("login/login", dataLogin);
              this.$f7.toast
                .create({
                  text: "Login Success",
                  position: "bottom",
                  closeTimeout: 2000,
                  destroyOnClose: true,
                })
                .open();
              this.$f7router.navigate("/");
              this.axios.defaults.headers.common["X-Auth-Token"] = token;
              this.axios.defaults.baseURL = getBaseUrl();
            });
        })
        .catch((error) => {
          this.$f7.dialog.close();
          if (!error.response || error.response.status === 500) {
            this.$f7.dialog.alert(
              "Please check your network connection!",
              "Connection Lost!"
            );
          } else if (error.response.status === 401) {
            this.$f7.dialog.alert("Username/password incorrect", "Incorrect");
          }
        });
    },
    changeLocale(locale) {
      this.$store.commit("login/changeLang", locale);
      window.location.reload().then(() => {
        this.$i18n.locale = locale;
      });
    },
    reset() {
      this.$f7.panel.close();
      this.$f7.dialog.preloader();
      this.$store.dispatch("login/reset").then(() => {
        this.$f7.views.main.router.navigate("/get-url");
        this.$f7.dialog.close();
      });
    },
  },
  mounted() {
    if (!getBaseUrl()) window.location.replace("/get-url");
    if (this.isLoggedIn) window.location.replace("/");
  },
  computed: {
    ...mapState({
      lang: (state) => state.login.lang,
      hasBaseUrl: (state) => state.login.hasBaseUrl,
      isLoggedIn: (state) => state.login.isLoggedIn,
    }),
  },
};
</script>
</style>