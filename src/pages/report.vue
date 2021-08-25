<template>
  <f7-page name="report" :page-content="false" ptr>
    <f7-navbar
      back-link
      transparent
      no-hairline
      no-shadow
      :title="$t('report.label')"
    ></f7-navbar>
    <f7-toolbar bottom tabbar no-hairline class="bottom-bar">
      <f7-link tab-link="#tab-1" tab-link-active>Sales</f7-link>
      <f7-link tab-link="#tab-2">Product Sales</f7-link>
    </f7-toolbar>

    <f7-tabs animated>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <f7-page
          infinite
          :infinite-distance="50"
          :infinite-preloader="showPreloader"
          @infinite="loadMoreCustomer"
          :hide-bars-on-scroll="true"
        >
          <f7-block>
            <h1 class="text-color-white">
              <b>Sales</b>
            </h1>
          </f7-block>
          <template v-if="!customerList.length && !showPreloader">
            <f7-block>
              <p class="text-align-center" color="gray">No item</p>
            </f7-block>
          </template>
          <template v-else>
            <f7-card v-for="item in customerList" :key="item.id">
              <div class="card-content card-content-padding">
                <p class="no-margin">
                  <small>{{ item.date }}</small>

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
                  <span>#{{ item.id }} </span>
                  <span class="float-right">
                    Rp
                    <strong> <numeric :value="item.amount" /> </strong>
                  </span>
                </p>
              </div>
            </f7-card>
          </template>
        </f7-page>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <f7-page
          infinite
          :infinite-distance="50"
          :infinite-preloader="showPreloader"
          @infinite="loadMoreVendor"
          :hide-bars-on-scroll="true"
        >
          <f7-block>
            <h1 class="text-color-white">
              <b>Product Sales</b>
            </h1>
          </f7-block>
          <f7-card v-for="item in vendorList" :key="item.id">
            <f7-card-content padding>
              <p class="no-margin">
                <strong class="capitalized">{{ item.product }}</strong>
                <small class="float-right text-color-gray">
                  x {{ item.qty }}
                </small>
              </p>
              <f7-row>
                <f7-col width="auto">
                  <small>
                    Sku:
                    <i>{{ item.sku }}</i>
                  </small>
                </f7-col>
                <f7-col class="text-align-right">
                  <small class="text-color-gray">Rp</small>
                  <b>
                    <numeric :value="item.amount" />
                  </b>
                </f7-col>
              </f7-row>
            </f7-card-content>
          </f7-card>
        </f7-page>
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>
<script>
import { capitalizeLetter } from "../js/function-helper";
const limit = 10;

export default {
  data() {
    return {
      showPreloader: true,
      customerOffset: 0,
      customerRecord: 0,
      customerList: [],
      customerFilter: {
        city: "",
      },
      vendorOffset: 0,
      vendorRecord: 0,
      vendorList: [],
      vendorFilter: {
        city: "",
      },
    };
  },
  methods: {
    capitalize(str) {
      return capitalizeLetter(str);
    },
    loadCustomer() {
      this.showPreloader = true;
      let data = {
        type: "1",
        payment: "5",
        start: "2021-08-12",
        end: "2021-08-12",
        user: "",
        limit: 10,
        offset: 0,
      };
      this.axios
        .post("/pos/summary", data)
        .then((res) => {
          let data = res.data.content;
          if (data.result) {
            data.result.map((el) => {
              this.customerList.push(el);
            });
          } else this.customerList = [];
          this.customerRecord = data.record;
          this.showPreloader = false;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    loadMoreCustomer() {
      if (
        !this.showPreloader &&
        this.customerList.length < this.customerRecord
      ) {
        this.customerOffset += limit;
        this.loadCustomer();
      }
    },
    loadVendor() {
      this.showPreloader = true;
      let data = {
        type: "1",
        payment: "5",
        start: "2021-08-12",
        end: "2021-08-12",
        user: "",
        limit: 10,
        offset: 0,
      };
      this.axios
        .post("/pos/summary_product", data)
        .then((res) => {
          let data = res.data.content;
          if (data.result) {
            data.result.map((el) => {
              this.vendorList.push(el);
            });
          } else this.vendorList = [];
          this.vendorRecord = data.record;
          this.showPreloader = false;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    loadMoreVendor() {
      if (!this.showPreloader && this.vendorList.length < this.vendorRecord) {
        this.vendorOffset += limit;
        this.loadVendor();
      }
    },
  },
  created() {
    this.vendorList = [];
    this.customerList = [];
    this.loadVendor();
    this.loadCustomer();
  },
};
</script>