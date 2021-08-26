<template>
  <div>
    <f7-navbar
      transparent
      back-link
      no-hairline
      no-shadow
      :title="$t('report.label')"
    >
    </f7-navbar>
    <f7-page :hide-navbar-on-scroll="true">
      <f7-block>
        <h1 class="text-color-white">
          <b>{{ $t("report.label") }}</b>
        </h1>
      </f7-block>
      <f7-card>
        <f7-card-content padding>
          <p>Type</p>
          <f7-input
            class="text-color-primary"
            label="Filter"
            type="select"
            v-model="filter.type"
            @input="filter.type = $event.target.value"
            defaultValue="0"
            placeholder="Please choose..."
          >
            <f7-icon icon="demo-list-icon" slot="media"></f7-icon>
            <option value="0">Today</option>
            <option value="1">This month</option>
            <option value="3">Custom</option>
          </f7-input>
          <br />

          <div v-if="filter.type == 3">
            <p>Start</p>
            <f7-input
              type="datepicker"
              placeholder="Select date"
              @calendar:change="filter.start = $event"
              readonly
              :calendar-params="{
                url: '/laporan',
                dateFormat: 'yyyy-mm-dd',
                closeOnSelect: true,
                sheetSwipeToClose: true,
              }"
            ></f7-input>
            <br />

            <p>End</p>
            <f7-input
              type="datepicker"
              placeholder="Select date"
              @calendar:change="filter.end = $event"
              readonly
              :calendar-params="{
                url: '/laporan',
                dateFormat: 'yyyy-mm-dd',
                closeOnSelect: true,
                sheetSwipeToClose: true,
              }"
            ></f7-input>
            <br />
          </div>

          <p>{{ $t("general.payment") }}</p>
          <!-- <f7-input
            type="select"
            defaultValue="IDR"
            class="text-color-primary"
            placeholder="Please choose..."
          > -->
          <f7-input
            type="select"
            defaultValue="IDR"
            class="text-color-primary"
            placeholder="Please choose..."
            v-model="filter.payment"
            @input="filter.payment = $event.target.value"
          >
            <f7-icon icon="demo-list-icon" slot="media"></f7-icon>
            <option v-for="item in paymentList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </f7-input>
          <br />
          <p>{{ $t("report.label") }}</p>
          <f7-input
            class="text-color-primary"
            label="Filter"
            type="select"
            v-model="reportType"
            @input="reportType = $event.target.value"
            defaultValue="0"
            placeholder="Please choose..."
          >
            <f7-icon icon="demo-list-icon" slot="media"></f7-icon>
            <option value="summary">Summary</option>
            <option value="product_summary">Product Summary</option>
          </f7-input>
          <br />
        </f7-card-content>
      </f7-card>
      <f7-block class="margin-top">
        <f7-button large fill @click="generateReport()">{{
          $t("general.generateReport")
        }}</f7-button>
      </f7-block>
    </f7-page>
  </div>
</template>
<script>
import { capitalizeLetter } from "../js/function-helper";
const limit = 10;

export default {
  data() {
    return {
      showPreloader: true,
      paymentList: [],
      filter: {
        type: 0,
        start: "",
        end: "",
        payment: "",
      },
      reportType: "summary",
    };
  },
  methods: {
    // Load Payment
    loadPayment() {
      this.axios.get("/payment").then((res) => {
        this.paymentList = res.data.content.result;
      });
    },
    dateFormat(value) {
      return this.moment(value).format("YYYY-MM-DD");
    },
    generateReport() {
      this.showPreloader = true;
      let data = this.filter;
      data.start = this.dateFormat(this.filter.start[0]);
      data.end = this.dateFormat(this.filter.end[0]);
      data.limit = 1000;
      data.offset = 0;
      data.user = "";
      this.axios
        .post(`/pos/${this.reportType}`, data)
        .then((res) => {
          let data = res.data.content;
          console.log(data);
          this.showPreloader = false;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
  },
  created() {
    this.loadPayment();
  },
};
</script>