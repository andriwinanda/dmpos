<template>
  <div>
    <f7-navbar back-link no-hairline no-shadow :title="$t('product.label')">
      <f7-searchbar
        no-hairline
        search-container=".search-list"
        @input="search= $event.target.value 
            searchProduct()"
        @keypress.native.enter.prevent="searchProduct()"
        :disable-button="!$theme.aurora"
      ></f7-searchbar>
      <!-- <f7-subnavbar :inner="false">
      </f7-subnavbar>-->
    </f7-navbar>

    <f7-page
      infinite
      :infinite-distance="50"
      :infinite-preloader="showPreloader"
      @infinite="loadMoreProduct"
      :hide-navbar-on-scroll="true"
    >
      <f7-block>
        <h1 class="text-color-white">
          <b>Product</b>
        </h1>
      </f7-block>

      <div class="bg-color-white hairline-bottom " v-for="(item) in productList" :key="item.id">
        <f7-link style="display:block" color="black" @click="detailProduct(item.id,item.publish)">
          <f7-card-content padding>
            <p class="no-margin">
              <strong class="capitalized">{{item.name}}</strong>
              <br />
              <small class="capitalized">{{item.brand}}</small>
            </p>
            <f7-row>
              <f7-col width="auto">
                <small>
                  Sku:
                  <i>{{item.sku}}</i>
                  Category:
                  <i class="capitalized">{{item.category}}</i>
                </small>
              </f7-col>
              <f7-col class="text-align-right">
                <small class="text-color-gray">Rp</small>
                <b>
                  <numeric :value="item.price" />
                </b>
              </f7-col>
            </f7-row>
          </f7-card-content>
        </f7-link>
      </div>
    </f7-page>
    <!-- Popup -->
    <f7-popup
      :tablet-fullscreen="true"
      class="demo-popup"
      :opened="popupOpened"
      @popup:closed="popupOpened = false"
    >
      <detailproduk v-if="popupOpened" @reload="reloading" v-bind="dataBind"></detailproduk>
    </f7-popup>
  </div>
</template>
<script>
import detailproduk from "./product-detail.vue";
import { capitalizeLetter } from "../js/function-helper";
import debounce from "debounce";

const limit = 10;

export default {
  components: {
    detailproduk
  },
  data() {
    return {
      showPreloader: true,
      productOffset: 0,
      productRecord: 0,
      productList: [],
      productFilter: {
        city: ""
      },
      search:'',
      edit: {},
      popupOpened: false,
      dataBind: {}
    };
  },
  methods: {
    loadProduct() {
      this.showPreloader = true;
      let data = {
        limit: limit,
        offset: this.productOffset
      };
      let ajax;
      if (this.search) {
        data.filter = this.search;
        ajax = this.axios.post("/product/search", data);
      } else {
        ajax = this.axios.post("/product", data);
      }
      ajax
        .then(res => {
          let data = res.data.content;
          if (data.result) {
            data.result.map(el => {
              this.productList.push(el);
            });
          } else this.productList = [];
          this.productRecord = data.record;
          this.showPreloader = false;
        })
        .catch(err => {
          this.showPreloader = false;
        });
    },
    loadMoreProduct() {
      if (!this.showPreloader && this.productList.length < this.productRecord) {
        this.productOffset += limit;
        this.loadProduct();
      }
    },
    searchProduct: debounce(function(event) {
      this.productList = [];
      this.productOffset = 0;
      this.productRecord = 0;
      this.loadProduct();
    }, 500),
    reloading() {
      this.productList = [];
      this.loadProduct();
    },
    detailProduct(id, publish) {
      // this.$f7router.navigate(`/product-detail`, {
      //   props: {
      //     id: id
      //   }
      // });
      (this.popupOpened = true), (this.dataBind.id = id);
      this.dataBind.publish = publish;
    }
  },
  created() {
    this.productList = [];
    this.loadProduct();
  }
};
</script>