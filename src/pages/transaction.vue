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
          class="bg-color-white hairline-bottom popup-open"
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
              Edit
            </f7-button>
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

    <!-- EDIT TRANSACTION -->

    <f7-sheet
      :opened="editSheet"
      @sheet:closed="closeEditSheet()"
      class="demo-sheet-swipe-to-step"
      style="height: auto; --f7-sheet-bg-color: #fff"
      swipe-to-close
      swipe-to-step
      backdrop
    >
      <div>
        <!-- Initial swipe step sheet content -->
        <div class="sheet-modal-swipe-step">
          <div
            class="
              display-flex
              padding
              justify-content-space-between
              align-items-center
            "
          >
            <div style="font-size: 18px">
              <b>Total:</b>
            </div>
            <div>
              Rp
              <b style="font-size: 22px">
                <numeric :value="bag.tot_amt" />
              </b>
            </div>
          </div>
          <div class="padding-horizontal padding-bottom">
            <f7-button large fill @click="choosePayment('bag')"
              >Make Payment</f7-button
            >
            <div class="margin-top text-align-center">
              Swipe up for more details
            </div>
          </div>
        </div>
        <!-- Rest of the sheet content that will opened with swipe -->
        <f7-block-title medium class="margin-top">Your order:</f7-block-title>
        <template>
          <div
            v-for="item in bag.items"
            :key="item.sku"
            class="
              display-flex
              padding
              justify-content-space-between
              align-items-center
            "
          >
            <div>
              <b style="font-size: 16px" class="capitalized">{{
                item.product || ""
              }}</b>
              <p>
                {{ item.currency }}
                <numeric :value="item.price" />
              </p>
            </div>
            <div>
              <f7-stepper
                :min="1"
                :value="Number(item.qty)"
                @stepper:change="updateQty(item.id, $event)"
                raised
                large
              ></f7-stepper>
            </div>
            <div>
              <f7-button
                large
                icon-f7="trash"
                outline
                @click="deleteTrans(item.id)"
              >
              </f7-button>
            </div>
          </div>
        </template>
      </div>
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
      isLoading: false,
      editSheet: false,
      transactionPaymentSheet: false,
      transactionOffset: 0,
      transactionRecord: 0,
      transactionList: [],
      transactionFilter: {
        date: "",
        payment: "",
        user: "",
      },
      id: "",
      search: "",
      paymentList: [],
      bag: {},
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
          this.id = id;
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
              <td colspan="3"> Subtotal </td>
              <td class="price"> ${this.numeric(data.tot_amt)}</td>
            </tr>
              
              <tr>
              <td colspan="3"> Voucher ${data.discount_desc} </td>
              <td class="price">  -${this.numeric(data.discount)}</td>
            </tr>
              
              <tr>
              <td colspan="3"> Tax / Ppn </td>
              <td class="price">  ${this.numeric(data.tax_total)}</td>
            </tr>
              
              <tr>
              <td colspan="3"><b> Total </b></td>
              <td class="price"> <b> ${this.numeric(data.total)} </b> </td>
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
      let myInvoice = `<!DOCTYPE html>
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
          }
          td, th {
            text-align: left;
            padding: 5px 5px;
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
      <body > ${this.invoice} 
      </body>
      </html>`;

      printJS({
        printable: myInvoice,
        type: "raw-html",
        header: null,
        targetStyles: ["*"],
      });
    },
    edit() {
      this.$f7.preloader.show();
      this.axios
        .post(`pos/get_trans/${this.id}`)
        .then((res) => {
          this.bag = res.data.content;
          this.editSheet = true;
          this.$f7.preloader.hide();
        })
        .catch((err) => {
          this.$f7.preloader.hide();
        });
    },
    deleteTrans(id) {
      this.$f7.preloader.show();
      this.axios
        .get(`pos/delete/${id}`)
        .then((res) => {
          this.$f7.toast
            .create({
              text: res.data.content,
              position: "bottom",
              closeTimeout: 2000,
              destroyOnClose: true,
            })
            .open();
          this.editSheet = false;
          this.$f7.preloader.hide();
        })
        .catch((err) => {
          this.$f7.preloader.hide();
        });
    },
    closeEditSheet() {
      this.editSheet = false;
      this.bag = {};
      this.id = "";
      this.transactionList = [];
      this.transactionOffset = 0;
      this.transactionRecord = 0;
      this.loadTransaction();
    },
    updateQty(id, val) {
      this.$f7.preloader.show();
      this.axios
        .get(`pos/update/${id}/${val}`)
        .then((res) => {
          this.$f7.preloader.hide();
          this.edit();
          this.$f7.toast
            .create({
              text: res.data.content,
              position: "bottom",
              closeTimeout: 2000,
              destroyOnClose: true,
            })
            .open();
        })
        .catch((err) => {
          this.$f7.preloader.hide();
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
}
.invoice {
  width: 100% !important;
}
.invoice table {
  margin: 0 auto;
  border-bottom: 1px dotted black;
  font-family: "verdana", sans-serif;
  line-height: 9px;
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