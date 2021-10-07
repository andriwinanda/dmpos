<template>
  <f7-app :params="f7params">
    <!-- Left panel with cover effect when hidden -->
    <!-- <f7-panel class="light" left cover :visible-breakpoint="960" :swipe="false">
      <f7-view>
        <f7-page>
          <f7-block
            v-if="$store.state.login.dataUser"
            class="row no-gap display-flex justify-content-center"
          >
         
            <div class="col-70">
              <div class="item-content">
                <div class="item-title">
                  <b>{{capitalize(name)}}</b>
                </div>
                <div class="item-after">
                  <small v-if="company">{{company}}</small>
                </div>
              </div>
            </div>
          </f7-block>
    <f7-list no-hairlines no-hairlines-between>-->
    <!-- <f7-list-item link="/" view=".view-main" panel-close :title="$t ('dashboard.label')"></f7-list-item>
            <f7-list-item link="/laporan" view=".view-main" panel-close :title="$t ('report.statement')"></f7-list-item>
            <f7-list-item link="/kasbank" view=".view-main" panel-close :title="$t ('cashbank.label')"></f7-list-item>
            <f7-list-item link="/penjualan" view=".view-main" panel-close :title="$t ('sales.label')"></f7-list-item>
            <f7-list-item link="/pembelian" view=".view-main" panel-close :title="$t ('purchase.label') "></f7-list-item>
            <f7-list-item link="/biaya" view=".view-main" panel-close :title="$t ('cost.label')"></f7-list-item>
            <f7-list-item link="/kontak" view=".view-main" panel-close :title="$t ('contact.label')"></f7-list-item>
            <f7-list-item link="/produk" view=".view-main" panel-close :title="$t ('product.label')"></f7-list-item>
            <f7-list-item link="/scan" view=".view-main" panel-close title="Scan QR"></f7-list-item>
    <f7-list-item link="/setting" view=".view-main" panel-close :title="$t ('setting.label')"></f7-list-item>-->
    <!-- <f7-list-item>
              <span>{{$t('general.theme')}}</span>
              <f7-toggle :checked="dark" @change="darkMode()"></f7-toggle>
            </f7-list-item>
            <f7-list-item class="pointer" @click="logout()" view=".view-main" panel-close :title="$t ('general.logout')"></f7-list-item>
            <f7-list-item class="pointer" @click="reset()" view=".view-main" panel-close title="Reset"></f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>-->

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" :push-state="true" :reloadCurrent="true" push-state-separator></f7-view>
  </f7-app>
</template>
<script>
import routes from "../js/routes.js";
import { getBaseUrl, getToken, getCompany } from "../js/localstorage-helper";
import { mapState } from "vuex";
import { capitalizeLetter } from "../js/function-helper";
export default {
  data() {
    return {
      // Framework7 Parameters
      f7params: {
        name: "POS Mobile", // App name
        theme: "ios", // Automatic theme detection

        // App routes
        routes: routes,
        // Register service worker
        serviceWorker: {
          path: "/service-worker.js"
        }
      }
    };
  },
  methods: {
    capitalize(str) {
      return capitalizeLetter(str);
    },
    darkMode() {
      this.$store.commit("login/darkMode");
    },
    logout() {
      this.$f7.panel.close();
      this.$f7.dialog.preloader();
      this.$store.dispatch("login/logout").then(() => {
        this.$f7.views.main.router.navigate("/login");
        this.$f7.dialog.close();
      });
    },
    reset() {
      this.$f7.panel.close();
      this.$f7.dialog.preloader();
      this.$store.dispatch("login/reset").then(() => {
        this.$f7.views.main.router.navigate("/get-url");
        this.$f7.dialog.close();
      });
    }
  },
  mounted() {
    this.$f7ready(f7 => {
      // Call F7 APIs here
    });
    // this.company = getCompany();
    // this.role = this.$store.state.login.dataUser.role
  },
  computed: {
    ...mapState({
      // dark: state => state.login.darkMode,
      // name: state => state.login.dataUser.username,
      // company: state => state.login.company,
      // login: state => state.login.isLoggedIn
    })
  },
  beforeMount() {
    // if (
    //   window.location.pathname !== "/login" ||
    //   window.location.pathname !== "/get-url"
    // )   console.log(window.location.pathname)
    // this.axios
    //   .get("/login/decode_token", {
    //     headers: {
    //       "X-Auth-Token": getToken()
    //     }
    //   })
    //   .then(res => {})
    //   .catch(err => {
    //     console.log(err);
    //   });
  }
};
</script>
<style >
html {
  background-color: #000000;
}
body {
  max-width: 30rem !important;
  margin: 0 auto !important;
}
.page {
  background-image: url(../assets/bg-2.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: contain;
}
.no-bg{
  background: none;
}
.login-screen-content {
  background: none !important;
}
.circle {
  border-radius: 50%;
}
.light {
  background-color: white;
}
.pointer {
  cursor: pointer;
}
.capitalized {
  text-transform: capitalize;
}
.no-margin {
  margin: 0 !important;
}
.bottom-bar {
  border-radius: 50px;
  width: 90%;
  margin: 0 5% 15px 5%;
  --f7-tabbar-link-active-bg-color: var(--f7-theme-color);
  --f7-toolbar-bg-color-rgb: rgb(255, 255, 255);
  --f7-tabbar-link-inactive-bg-color: #ffffff;
  --f7-tabbar-link-active-color: #ffffff;
  --f7-toolbar-inner-padding-left: 0px;
  --f7-toolbar-inner-padding-right: 0px;
  box-shadow: 0 4px 4px 0 rgba(165, 169, 172, 0.651);
}
.tabbar .tab-link-active {
  border-radius: 50px;
}
.toolbar-inner {
  border-radius: 50px;
  background-color: #ffffff;
}
.toolbar-bottom.toolbar-hidden,
.ios .toolbar-bottom-ios.toolbar-hidden,
.md .toolbar-bottom-md.toolbar-hidden,
.aurora .toolbar-bottom-aurora.toolbar-hidden {
  transform: translate3d(0, 150%, 0);
}
</style>