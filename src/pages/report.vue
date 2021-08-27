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

    <!-- Invoice Popup -->
    <f7-popup
      class="demo-popup"
      :tablet-fullscreen="true"
      :opened="popupOpened"
      @popup:closed="popupOpened = false"
      push
    >
      <f7-page :page-content="false" class="bg-color-white">
        <f7-navbar class="capitalized">
          <p class="capitalized text-color-white" slot="title">Invoice</p>
          <f7-link slot="right" popup-close>
            <f7-chip slot="left" class="no-padding-right">
              <f7-icon slot="media" f7="multiply"></f7-icon>
            </f7-chip>
          </f7-link>
        </f7-navbar>

        <f7-page-content class="no-padding-top">
          <f7-block strong id="invoice" class="invoice">
            <div class="text-align-center" id="print" v-if="invoice" v-html="invoice"></div>
          </f7-block>
          <f7-block>
            <f7-button large icon-f7="printer_fill" fill @click="print()">
              Print
            </f7-button>
          </f7-block>

          <f7-block>
            <f7-button
              large
              fill
              sheet-open=".demo-sheet-swipe-to-close"
              @click="edit()"
              popup-close
            >
              Edit</f7-button
            >
          </f7-block>
        </f7-page-content>
      </f7-page>
    </f7-popup>
  </div>
</template>
<script>
import { capitalizeLetter } from "../js/function-helper";
const limit = 10;

export default {
  data() {
    return {
      popupOpened: false,
      showPreloader: true,
      paymentList: [],
      filter: {
        type: 0,
        start: "",
        end: "",
        payment: "",
      },
      reportType: "summary",
      invoice: '',
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
        .then((response) => {
          this.popupOpened = true;
          this.showPreloader = false;
          let res = response.data.content;
          var items = "";
          if (res.result) {
            res.result.map((el) => {
              items += `<tr>
              <td> #${el.id} </td>
              <td class="qty">${el.date}</td>
              <td class="price">${el.payment}</td>
                  <td class="price">${this.numeric(el.amount)}</td>
            </tr>  `;
            });
          }
          let invoice = `
          <div class="sometxt">
           
          <div class="sometxt">
            <p>
              Order ID : #${res.orderid}
            </p>
            <br/>
          </div>

          <table>
            <tr>
              <th>ID</th>
              <th class="qty">Date</th>
              <th>Payment</th>
              <th>Total</th>
            </tr>
          <!---------------------------------->
          <!--
            <tr>
              <td>Eskulin Mist Col 12</td>
              <td class="qty">5</td>
              <td class="price">10.300</td>
              <td class="price">51.500</td>
            </tr>
          -->
              ${res.result? items : ''}

                    
          <!-------------TOTAL-------------->
            <tr>
              <td colspan="3"><b>Total </b></td>
              <td class="price"><b> ${this.numeric(res.total_amount)}</b></td>
            </tr>
              
            
          <!--------------------------------->
          </table>
          `;
          this.invoice = invoice;
          
          console.log(items)
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    
    numeric(val) {
      var formatter = new Intl.NumberFormat("ID", {
        style: "decimal",

        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(val);
    },
  },
  created() {
    this.loadPayment();
  },
};
</script>