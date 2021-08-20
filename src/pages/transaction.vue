<template>
  <div>
    <f7-navbar
      back-link
      transparent
      no-hairline
      no-shadow
      :title="$t('transaction.label')"
    >
    </f7-navbar>

    <f7-page
      infinite
      :infinite-distance="50"
      :infinite-preloader="showPreloader"
      @infinite="loadMoreTransaction"
      :hide-navbar-on-scroll="true"
    >
      <f7-block>
        <h1 class="text-color-white">
          <b>Transaction</b>
        </h1>
      </f7-block>

      <template v-if="!transactionList.length && !showPreloader">
        <f7-block>
          <p class="text-align-center" color="gray">No item</p>
        </f7-block>
      </template>
      <template v-else>
        <div
          class="card popup-open"
          data-popup=".demo-popup"
          v-for="item in transactionList"
          :key="item.id"
          @click="detailTransaction(item.orderid)"
        >
          <div class="card-content card-content-padding">
            <p class="no-margin">
              <small>{{ moment(item.date).format("dddd, D MMM YYYY") }}</small>
              <small>{{ item.time.replace(/-/g, ":") }}</small>
              <small class="float-right text-color-gray">{{
                item.payment
              }}</small>
            </p>
            <!-- <hr class="dotted" /> -->
            <table>
              <tr>
                <td></td>
              </tr>
            </table>
            <p class="no-margin">
              <span>#{{ item.orderid }} </span>
              <span class="float-right">
                Rp
                <strong> <numeric :value="item.total" /> </strong>
              </span>
            </p>
          </div>
        </div>
      </template>
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
            <div class="text-align-center" id="print" v-html="invoice"></div>

            <!-- <f7-fab-backdrop slot="fixed"></f7-fab-backdrop>
            <f7-fab
              position="right-bottom"
              @click="print()"
              slot="fixed"
              color="primary"
            >
              <f7-icon f7="printer_fill"></f7-icon>
            </f7-fab> -->
          </f7-block>
          <f7-block>
            <f7-button large icon-f7="printer_fill" fill @click="print()">
              Print</f7-button
            >
          </f7-block>
        </f7-page-content>
      </f7-page>
    </f7-popup>

    <!-- Filter -->
    <f7-fab-backdrop slot="fixed"></f7-fab-backdrop>
    <f7-fab position="right-bottom" slot="fixed" color="primary">
      <f7-icon f7="search"></f7-icon>
      <f7-icon f7="multiply"></f7-icon>
      <f7-fab-buttons position="top">
        <f7-fab-button
          :label="$t('general.payment')"
          fab-close
          @click="transactionPaymentSheet = true"
        >
          <f7-icon f7="creditcard"></f7-icon>
        </f7-fab-button>

        <f7-fab-button label="Date" @click="filterCalendar.open()">
          <f7-icon f7="calendar"></f7-icon>
        </f7-fab-button>
        <f7-fab-button
          label="Reset"
          v-if="transactionFilter.date || transactionFilter.payment"
          @click="resetFilter()"
        >
          <f7-icon f7="multiply"></f7-icon>
        </f7-fab-button>
      </f7-fab-buttons>
    </f7-fab>

    <!-- Filter Payment -->
    <f7-sheet
      :opened="transactionPaymentSheet"
      @sheet:closed="transactionPaymentSheet = false"
    >
      <f7-toolbar>
        <div class="left"></div>
        <div class="right">
          <f7-link sheet-close>{{ $t("general.close") }}</f7-link>
        </div>
      </f7-toolbar>
      <!-- Scrollable sheet content -->
      <f7-page-content>
        <f7-list>
          <f7-list-item
            v-for="(item, i) in paymentList"
            :key="i"
            radio
            radio-icon="end"
            :title="item.name"
            name="demo-radio-end"
            v-model="transactionFilter.payment"
            @change="
              (e) => {
                if (e.target.checked) filterPayment(item.id);
              }
            "
          ></f7-list-item>
        </f7-list>
      </f7-page-content>
    </f7-sheet>
  </div>
</template>
<script>
import { capitalizeLetter } from "../js/function-helper";

import debounce from "debounce";
import moment from "moment";
import print from "print-js";

const limit = 10;

export default {
  data() {
    return {
      showPreloader: true,
      transactionPaymentSheet: false,
      transactionOffset: 0,
      transactionRecord: 0,
      transactionList: [],
      transactionFilter: {
        date: "",
        payment: "",
        user: "",
      },
      search: "",
      paymentList: [],
      edit: {},
      popupOpened: false,
      dataBind: {},
      filterCalendar: this.$f7.calendar.create({
        closeOnSelect: true,
        url: "/transaction",
        dateFormat: "yyyy-mm-dd",
        on: {
          change: (calendar) => {
            this.filterDate(calendar);
          },
        },
      }),
      invoice: "",
    };
  },
  methods: {
    loadTransaction() {
      this.showPreloader = true;
      let data = {
        limit: limit,
        offset: this.transactionOffset,
        date: this.transactionFilter.date,
        payment: this.transactionFilter.payment,
        user: this.$store.state.login.dataUser.userid,
      };
      this.axios
        .post("pos", data)
        .then((res) => {
          let data = res.data.content;
          if (data.result) {
            data.result.map((el) => {
              let data = {};
              data = el;
              data.date = new Date(el.date);
              this.transactionList.push(data);
            });
          } else this.transactionList = [];
          this.transactionRecord = data.record;
          this.showPreloader = false;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    loadMoreTransaction() {
      if (
        !this.showPreloader &&
        this.transactionList.length < this.transactionRecord
      ) {
        this.transactionOffset += limit;
        this.loadTransaction();
      }
    },
    searchTransaction: debounce(function (event) {
      this.transactionList = [];
      this.transactionOffset = 0;
      this.transactionRecord = 0;
      this.loadTransaction();
    }, 500),
    reloading() {
      this.transactionList = [];
      this.loadTransaction();
    },
    detailTransaction(id) {
      this.showPreloader = true;
      this.axios
        .post(`pos/get_trans/${id}`)
        .then((res) => {
          let data = res.data.content;

          this.showPreloader = false;
          var items = "";
          if (data.items) {
            data.items.map((el) => {
              items += `<tr>
              <td> ${el.product} </td>
              <td class="qty">${el.qty}</td>
              <td class="price">${this.numeric(el.price)}</td>
                  <td class="price">${this.numeric(el.amount)}</td>
            </tr>  `;
            });
          }
          let invoice = `
          <div class="sometxt">
            <p>
              ${data.branch.b_name} <br>
              ${data.branch.b_address} <br>
              Telp. ${data.branch.b_phone1} Kota ${data.branch.b_city} Indonesia
            </p>
          </div>
          <table>
            <tr>
              <th>Nama</th>
              <th class="qty">Qty</th>
              <th>Harga</th>
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
              ${items}

                    
          <!-------------TOTAL-------------->
            <tr>
              <td colspan="3"> Harga Jual --1--Item(s) </td>
              <td class="price"> ${this.numeric(data.total)}</td>
            </tr>
              
              <tr>
              <td colspan="3"> Discount </td>
              <td class="price">  ${this.numeric(data.discount)}</td>
            </tr>
              
              <tr>
              <td colspan="3"> Tax / Ppn </td>
              <td class="price">  ${this.numeric(data.tax_total)}</td>
            </tr>
              
              <tr>
              <td colspan="3"><b> Total </b></td>
              <td class="price"> <b> ${this.numeric(data.tot_amt)} </b> </td>
            </tr>
          <!--------------------------------->
          </table>
          <div class="sometxt">
            <p>
              #${data.orderid} <br>
              ${data.dates} <br>
              Terima Kasih Atas Kunjungan Anda <br>
              Periksa Barang sebelum dibeli <br>
              Barang yang sudah dibeli tidak bisa ditukar atau dikembalikan
            </p>
          </div>
          `;
          this.invoice = invoice;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    print() {
      let attachment = document.getElementById("invoice");

      printJS({
        printable: "print",
        type: "html",
        header: null,
        targetStyles: ["*"],
      });
    },
    loadPayment() {
      this.isLoading = true;
      this.axios
        .get("payment")
        .then((res) => {
          this.paymentList = res.data.content.result;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
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

    dateFormat(value) {
      return moment(value).format("YYYY-MM-DD");
    },

    filterDate(e) {
      this.transactionList = [];
      this.transactionRecord = 0;
      this.transactionOffset = 0;
      this.transactionFilter.date = "";
      this.transactionFilter.date = this.dateFormat(e.value[0]);
      this.loadTransaction();
    },
    filterPayment(e) {
      this.transactionList = [];
      this.transactionRecord = 0;
      this.transactionOffset = 0;
      this.transactionFilter.payment = e;
      this.loadTransaction();
      this.transactionPaymentSheet = false;
    },
    resetFilter() {
      this.transactionList = [];
      this.transactionRecord = 0;
      this.transactionOffset = 0;
      this.transactionFilter.date = "";
      this.transactionFilter.payment = "";
      this.loadTransaction();
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
    this.transactionList = [];
    this.loadTransaction();
    this.loadPayment();
  },
};
</script>
<style lang="less">
#print {
  margin: 0 auto;
  width: 7cm !important;
  font-size: 9pt !important;
}
.invoice {
  width: 100% !important;
}
.invoice table {
  margin: 0 auto;
  border-bottom: 1px dotted black;
  font-family: "verdana", sans-serif;
  line-height: 11px;
  width: 7cm !important;
  max-width: 7cm !important;
}
.invoice td,
.invoice th {
  text-align: left;
  padding: 5px 2px;
}
.invoice th {
  border-top: 1px dotted black;
  border-bottom: 1px dotted black;
}
.invoice p {
  text-align: center;
  margin: 0;
}
.invoice .qty {
  text-align: center;
}
.invoice.sometxt {
  margin: 0;
  font-family: "verdana", sans-serif;
}
.invoice.sometxt p {
  text-align: center;
  font-size: 10pt;
}
.invoice .price {
  text-align: right;
}
</style>