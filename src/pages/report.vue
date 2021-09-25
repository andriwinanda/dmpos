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
            <option value="2">Custom</option>
          </f7-input>
          <br />

          <div v-if="filter.type == 2">
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
            defaultValue="summary"
            placeholder="Please choose..."
          >
            <f7-icon icon="demo-list-icon" slot="media"></f7-icon>
            <option value="summary">Summary</option>
            <option value="summary_product">Product Summary</option>
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
          <p class="capitalized text-color-white" slot="title">Report</p>
          <f7-link slot="right" popup-close>
            <f7-chip slot="left" class="no-padding-right">
              <f7-icon slot="media" f7="multiply"></f7-icon>
            </f7-chip>
          </f7-link>
        </f7-navbar>

        <f7-page-content class="no-padding-top">
          <f7-block strong id="report" class="report">
            <div
              class="text-align-center"
              id="print"
              v-if="report"
              v-html="report"
            ></div>
          </f7-block>
          <f7-block>
            <f7-button large icon-f7="printer_fill" fill @click="print()">
              Print
            </f7-button>
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
      report: "",
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
          let qtyTotal = 0;
          let res = response.data.content;
          var items;
          if (this.reportType == "summary") {
            items = ` <tr>
                <th>Date</th>
                <th class="qty">Payment</th>
                <th class="price">Total</th>
              </tr>`;
            if (res.result) {
              res.result.map((el) => {
                items += `<tr>
                <td>${this.moment(new Date(el.date)).format(
                  "DD MMM YYYY HH:mm"
                )}</td>
                <td class="qty">${el.payment}</td>
                    <td class="price">${this.numeric(el.amount)}</td>
                </tr>  `;
              });
            }
            items += ` <tr>
            <td colspan="2"><b>Total </b></td>
            <td class="price">Rp <b> ${this.numeric(res.total_amount)}</b></td>
            </tr>`;
          } else {
            items = ` <tr>
            <th>Nama</th>
            <th class="qty">Qty</th>
            <th class="price">Total</th>
            </tr>`;
            if (res.result) {
              res.result.map((el) => {
                qtyTotal += Number(el.qty)
                items += `<tr>
                <td> ${el.product} </td>
                <td class="qty">${el.qty}</td>
                <td class="price">${this.numeric(el.amount)}</td>
              </tr>  `;
              });
            }
            items += ` <tr>
            <td ><b>Total </b></td>
            <td >${qtyTotal} items</td>
            <td class="price">Rp <b> ${this.numeric(res.total_amount)}</b></td>
            </tr>`;
          }
          let report = `
           
          <div class="sometxt">
            <p>
              ${res.b_name} <br>
              ${res.b_address} <br>
              Telp. ${res.b_phone1} Kota ${res.b_city} Indonesia
            </p>
            <p>
              <strong>
                Total : Rp ${this.numeric(res.total_amount)}
              </strong>
            </p>
            <br/>
          </div>

          <table>
           
          <!---------------------------------->
          <!--
            <tr>
              <td>Eskulin Mist Col 12</td>
              <td class="qty">5</td>
              <td class="price">10.300</td>
              <td class="price">51.500</td>
            </tr>
          -->
              ${res.result ? items : ""}

                    
          <!-------------TOTAL-------------->
           
              
            
          <!--------------------------------->
          </table>
          `;
          this.report = report;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    print() {
      let myReport = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8">
        <title> POS - 14199 </title>
        
        <style>
         body {
            margin: 0;
          }
        
          table {
            margin: 0 auto;
            border-bottom: 1px dotted black;
            font-family: 'verdana', sans-serif;
            font-size: 10pt;
            line-height: 9px;
            border-collapse: collapse;
          }
          td,
          th {
            text-align: left;
            padding: 5px 2px;
          }
          tr {
            border-bottom: 1px dotted black;
          }
          th {
            border-top: 1px dotted black;
            border-bottom: 1px dotted black;
          }
          p {
            text-align: center;
            margin: 0;
          }
          .qty {
            text-align: center;
          }
          .sometxt {
            margin: 0;
            font-family: 'verdana', sans-serif;
          }
          .sometxt p { @stepper:change="updateBag(item.sku, $event, item.stock)"
            text-align: center;
            font-size: 10pt;
          }
        .price{ text-align: right;}
        </style>
      </head>
      <body > ${this.report} 
      </body>
      </html>`;

      printJS({
        printable: myReport,
        type: "raw-html",
        header: null,
        targetStyles: ["*"],
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
<style lang="less">
#print {
  margin: 0 auto;
}
.report {
  width: 100% !important;
}
.report table {
  margin: 0 auto;
  min-height: 200px;
  width: 100%;
  border-bottom: 1px dotted black;
  font-family: "verdana", sans-serif;
  line-height: 9px;
  border-collapse: collapse;
}
.report td,
.report th {
  text-align: left;
  padding: 5px 2px;
}
.report tr {
  border-bottom: 1px dotted black;
}
.report th {
  border-top: 1px dotted black;
  border-bottom: 1px dotted black;
}
.report p {
  text-align: center;
  margin: 0;
}
.report .qty {
  text-align: center;
}
.report.sometxt {
  margin: 0;
  font-family: "verdana", sans-serif;
}
.report.sometxt p {
  text-align: center;
  font-size: 10pt;
}
.report .price {
  text-align: right;
}
</style>