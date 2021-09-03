<template>
  <f7-page name="home" :page-content="false">
    <f7-block>
      <h3 class="text-color-white" style="font-weight: normal">
        Hello
        <b class="capitalized">{{ name ? name : "" }}</b
        >,
      </h3>
    </f7-block>
    <f7-block>
      <f7-row>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/product"
            icon-f7="cube_box_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Product</small>
        </f7-col>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/sales"
            icon-f7="doc_chart_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Sales</small>
        </f7-col>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/transaction"
            icon-f7="arrow_right_arrow_left_square_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Transaction</small>
        </f7-col>
      </f7-row>
      <br />
      <f7-row>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/report"
            icon-f7="chart_bar_alt_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Report</small>
        </f7-col>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/help"
            icon-f7="question_diamond_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Help</small>
        </f7-col>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
         <f7-link
            @click="logout()"
            icon-f7="square_arrow_left"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Logout</small>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-card v-if="company" class="bg-color-white">
      <f7-card-content>

      <p class="text-color-gray">
        <b>{{ company.company }}</b>
        <br />
        <small>
          {{ company.address }}
          <br />
          {{ company.phone ? "Phone: " + company.phone : "" }},
          {{ company.email ? "Email: " + company.email : "" }}
        </small>
      </p>
      </f7-card-content>
    </f7-card>
  </f7-page>
</template>
<script>
// import LineChart from "@/components/Chart/LineChart.js";
import { getBaseUrl, getToken } from "../js/localstorage-helper";
import { mapState } from "vuex";
export default {
  components: {
    // LineChart
  },
  data() {
    return {
      isLoading: false,
      info: {},
      company: {},
    };
  },
  methods: {
    logout() {
      this.$f7.dialog.preloader();
      this.$store.dispatch("login/logout").then(() => {
        this.$f7.views.main.router.navigate("/login");
        this.$f7.dialog.close();
      });
    },

    loadCompany() {
      this.isLoading = true;
      this.axios.get("/configuration").then((res) => {
        this.isLoading = false;
        let data = res.data.content;
        let company = {
          company: data.name,
          address: data.address,
          phone: data.phone1,
          email: data.email,
          zip: data.zip,
        };
        this.company = company;
      });
    },
  },

  computed: {
    ...mapState({
      dark: (state) => state.login.darkMode,
      name: (state) =>
        state.login.dataUser ? state.login.dataUser.username : "",
    }),
  },
  mounted() {
    if (!getBaseUrl() && !getToken()) window.location.replace("/get-url");
    else if (!getToken()) window.location.replace("/login");
    this.loadCompany();
  },
};
</script>