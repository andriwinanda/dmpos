<template>
  <f7-page name="contact"  :page-content="false" ptr>
    <f7-navbar back-link transparent no-hairline no-shadow :title="$t('contact.label')"></f7-navbar>
    <f7-toolbar  bottom tabbar no-hairline class="bottom-bar">
      <f7-link tab-link="#tab-1" tab-link-active>Customer</f7-link>
      <f7-link tab-link="#tab-2" >Vendor</f7-link>
    </f7-toolbar>

    <f7-tabs animated>
      <f7-tab id="tab-1" class="page-content"  tab-active>
        <f7-page
          infinite
          :infinite-distance="50"
          :infinite-preloader="showPreloader"
          @infinite="loadMoreCustomer"
          :hide-bars-on-scroll="true"
        >
          <f7-block>
            <h1 class="text-color-white">
              <b>Customer</b>
            </h1>
          </f7-block>
          <f7-card v-for="item in customerList" :key="item.id">
            <f7-card-content padding>
              <p>
                <strong>{{capitalize(item.name)}}</strong>
                <br />
                <small>{{item.address}}{{item.city? ', '+item.city : ""}}</small>
                <br />
                <small>{{item.email}} {{item.phone1}}</small>
              </p>
            </f7-card-content>
          </f7-card>
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
              <b>Vendor</b>
            </h1>
          </f7-block>
          <f7-card v-for="item in vendorList" :key="item.id">
            <f7-card-content padding>
              <p>
                <strong>{{capitalize(item.name)}}</strong>
                <br />
                <small>{{item.address}}{{item.city? ', '+item.city : ""}}</small>
                <br />
                <small>{{item.email}} {{item.phone1}}</small>
              </p>
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
        city: ""
      },
      vendorOffset: 0,
      vendorRecord: 0,
      vendorList: [],
      vendorFilter: {
        city: ""
      }
    };
  },
  methods: {
    capitalize(str) {
      return capitalizeLetter(str);
    },
    loadCustomer() {
      this.showPreloader = true;
      let data = {
        limit: limit,
        offset: this.customerOffset,
        city: this.customerFilter.city
      };
      this.axios
        .post("/customer", data)
        .then(res => {
          let data = res.data.content;
          if (data.result) {
            data.result.map(el => {
              this.customerList.push(el);
            });
          } else this.customerList = [];
          this.customerRecord = data.record;
          this.showPreloader = false;
        })
        .catch(err => {
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
        limit: limit,
        offset: this.vendorOffset,
        city: this.vendorFilter.city
      };
      this.axios
        .post("/vendor", data)
        .then(res => {
          let data = res.data.content;
          if (data.result) {
            data.result.map(el => {
              this.vendorList.push(el);
            });
          } else this.vendorList = [];
          this.vendorRecord = data.record;
          this.showPreloader = false;
        })
        .catch(err => {
          this.showPreloader = false;
        });
    },
    loadMoreVendor() {
      if (!this.showPreloader && this.vendorList.length < this.vendorRecord) {
        this.vendorOffset += limit;
        this.loadVendor();
      }
    }
  },
  created() {
    this.vendorList = [];
    this.customerList = [];
    this.loadVendor();
    this.loadCustomer();
  }
};
</script>