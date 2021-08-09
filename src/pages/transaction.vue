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
          data-popup=".popup-detail"
          v-for="item in transactionList"
          :key="item.id"
          @click="detailTransaction(item.id)"
        >
          <div class="card-content card-content-padding">
            <p class="no-margin">
              <small>{{ moment(item.date).format('dddd, D MMM YYYY')}}</small> 
              <small>{{item.time.replace((/-/g), ":")}}</small>
            </p>
            <!-- <hr class="dotted" /> -->
            <table>
              <tr>
                <td></td>
              </tr>
            </table>
            <p class="no-margin">
              <span>#{{ item.orderid }}</span>
              <strong class="float-right">
                Rp<numeric :value="item.total" />
              </strong>
            </p>
          </div>
        </div>
      </template>
    </f7-page>
    <!-- Popup -->
    <f7-popup
      :tablet-fullscreen="true"
      class="demo-popup"
      :opened="popupOpened"
      @popup:closed="popupOpened = false"
    >
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
      paymentList : [],
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
              let data = {}
              data = el
              data.date = new Date(el.date)
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
      //   this.showPreloader = true;
      //   this.axios
      //     .post(`pos/get_trans/${id}`)
      //     .then((res) => {
      //       console.log(res);
      //       this.showPreloader = false;
      //     })
      //     .catch((err) => {
      //       this.showPreloader = false;
      //     });
    },
    loadPayment() {
      this.isLoading = true;
        this.axios
        .get("payment").then(res => {
         this.paymentList = res.data.content.result
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
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
      this.transactionFilter.payment = e
      this.loadTransaction()
      this.transactionPaymentSheet = false
    },
    resetFilter() {
      this.transactionList = [];
      this.transactionRecord = 0;
      this.transactionOffset = 0;
      this.transactionFilter.date = "";
      this.transactionFilter.payment = "";
      this.loadTransaction();
    },
  },
  created() {
    this.transactionList = [];
    this.loadTransaction();
    this.loadPayment();
  },
};
</script>