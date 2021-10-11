<template>
  <div>
    <f7-navbar
      back-link
      no-hairline
      padding
      no-shadow
      :title="$t('sales.label')"
    >
      <f7-searchbar
        no-hairline
        search-container=".search-list"
        @input="
          search = $event.target.value;
          searchProduct();
        "
        @keypress.native.enter.prevent="searchProduct()"
        :disable-button="false"
      ></f7-searchbar>
      <f7-link
        icon-only
        @click="bagSheet = true"
        color="white"
        class="display-flex margin-left-half"
      >
        <f7-icon f7="bag_fill">
          <f7-badge v-if="bagCount" color="red">{{
            bagCount >= 100 ? "99+" : bagCount
          }}</f7-badge>
        </f7-icon>
      </f7-link>

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
          <b>{{ $t("sales.label") }}</b>
        </h1>
      </f7-block>

      <div
        class="bg-color-white hairline-bottom"
        v-for="item in productList"
        :key="item.id"
      >
        <f7-link
          style="display: block"
          color="black"
          @click="beforeAdd(item.id)"
        >
          <f7-card-content padding>
            <p class="no-margin">
              <strong class="capitalized">{{ item.name }}</strong>
              <br />
              <small class="capitalized">{{ item.brand }}</small>
            </p>
            <f7-row>
              <f7-col width="auto">
                <small>
                  Sku:
                  <i>{{ item.sku }}</i>
                  Category:
                  <i class="capitalized">{{ item.category }}</i>
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
    <f7-fab
      position="center-bottom"
      @click="popupScan = true"
      slot="fixed"
      text="Scan"
    >
      <f7-icon f7="barcode_viewfinder"></f7-icon>
    </f7-fab>
    <!-- Popup -->
    <f7-popup
      :tablet-fullscreen="true"
      class="demo-popup"
      :opened="popupScan"
      @popup:closed="popupScan = false"
    >
      <scanproduct
        @barcode="barcodeScanned($event)"
        v-if="popupScan"
      ></scanproduct>
    </f7-popup>

    <!-- Payment -->
    <f7-popup
      tablet-fullscreen
      :opened="popupPayment"
      push
      @popup:closed="closePaymentPage()"
    >
      <f7-page class="no-bg">
        <f7-navbar title="Payment">
          <f7-nav-right>
            <f7-link popup-close icon-f7="xmark"></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-toolbar class="padding" bottom>
          <f7-block style="width: 100%">
            <f7-button fill color="primary" @click="pay()">
              Pay IDR
              <numeric
                :value="
                  manualDiscount.selected
                    ? manualDiscount.selected == 'Rp'
                      ? subTotal - manualDiscount.directDisc
                      : subTotal - subTotal * dataToPay.discount
                    : subTotal - subTotal * dataToPay.discount
                "
              />
            </f7-button>
          </f7-block>
        </f7-toolbar>
        <f7-block-header class="no-margin-bottom"
          >Order Summary</f7-block-header
        >
        <f7-list no-hairlines accordion-list class="no-margin-bottom">
          <f7-list-item
            class="no-padding-bottom"
            accordion-item
            :title="`Order Item${dataToPay.items.length > 1 ? 's' : ''}`"
          >
            <f7-block>
              <f7-accordion-content>
                <div
                  v-for="item in dataToPay.items"
                  :key="item.sku"
                  class="
                    display-flex
                    justify-content-space-between
                    align-items-center
                    padding-vertical
                    hairline-bottom
                  "
                >
                  <div>
                    <b style="font-size: 16px" class="capitalized">{{
                      item.name || ""
                    }}</b>
                    x{{ item.qty }}
                    <p>Rp <numeric :value="item.price" /></p>
                  </div>
                  <div>
                    <p>Rp <numeric :value="item.price * item.qty" /></p>
                    <!-- <f7-stepper
                :min="(item.stock>=item.min)?item.min:item.stock"
                :max="item.stock"
                :value="(item.stock>=item.qty)?item.qty:item.stock"
                @stepper:change="updateBag(item.sku, $event, item.stock)"
                raised
                large
              ></f7-stepper> -->
                  </div>
                </div>
              </f7-accordion-content>
            </f7-block>
          </f7-list-item>
        </f7-list>
        <f7-block class="margin-top">
          <div class="display-flex justify-content-space-between">
            <div>
              <span>Sub Total</span>
            </div>
            <div>
              <p>Rp <numeric :value="subTotal" /></p>
            </div>
          </div>
          <div class="display-flex justify-content-space-between">
            <div>
              <span> Discount </span>
            </div>
            <div>
              <p>
                Rp
                <numeric
                  :value="
                    manualDiscount.selected
                      ? manualDiscount.selected == 'Rp'
                        ? manualDiscount.directDisc
                        : subTotal * dataToPay.discount
                      : subTotal * dataToPay.discount
                  "
                />
              </p>
            </div>
          </div>
          <div class="display-flex justify-content-space-between">
            <div>
              <span><b>Total</b></span>
            </div>
            <div>
              <p>
                Rp
                <b
                  ><numeric
                    :value="
                      manualDiscount.selected
                        ? manualDiscount.selected == 'Rp'
                          ? subTotal - manualDiscount.directDisc
                          : subTotal - subTotal * dataToPay.discount
                        : subTotal - subTotal * dataToPay.discount
                    "
                /></b>
              </p>
            </div>
          </div>
        </f7-block>

        <!-- Payment -->
        <f7-block-header>Payment Method</f7-block-header>
        <f7-card>
          <f7-card-content>
            <f7-list>
              <f7-list-item link @click="selectPayment()"
                >{{ selectedPayment.name || "Select Payment Method" }}
              </f7-list-item>
            </f7-list>
          </f7-card-content>
        </f7-card>

        <!-- Discount -->
        <f7-block-header>Discount Voucher</f7-block-header>
        <f7-card>
          <f7-card-content>
            <f7-list>
              <f7-list-item link @click="selectVoucher()"
                >{{
                  dataToPay.discount
                    ? `${dataToPay.discount_desc}`
                    : "Select Voucher"
                }}
              </f7-list-item>
            </f7-list>
          </f7-card-content>
        </f7-card>

        <f7-block class="no-margin-bottom">
          <f7-block-header>Create Custom Discount</f7-block-header>
          <f7-segmented strong>
            <f7-button
              v-for="i in manualDiscount.type"
              :key="i"
              @click="selectDiscType(i)"
              :active="i == manualDiscount.selected"
            >
              {{ i }}
            </f7-button>
          </f7-segmented>
        </f7-block>
        <f7-list no-hairlines class="no-margin">
          <f7-list-input
            outline
            type="number"
            placeholder="Value"
            class="no-padding"
            @input="customDiscount($event.target.value)"
          >
          </f7-list-input>
        </f7-list>
      </f7-page>
    </f7-popup>

    <!-- Add To Bag -->
    <f7-sheet
      :opened="beforeAddSheet"
      @sheet:closed="
        beforeAddSheet = false;
        bagTemp.item = null;
        bagTemp.qty = 0;
      "
      class="demo-sheet-swipe-to-step"
      style="height: auto; --f7-sheet-bg-color: #fff"
      swipe-to-close
      backdrop
    >
      <!-- Initial swipe step sheet content -->
      <div v-if="bagTemp.item" class="sheet-modal-swipe-step">
        <div
          class="
            display-flex
            padding
            justify-content-space-between
            align-items-center
          "
        >
          <div>
            <b style="font-size: 16px" class="capitalized">{{
              bagTemp.item.name || ""
            }}</b>
            <p>
              {{ bagTemp.item.currency }}
              <numeric :value="bagTemp.item.price" />
            </p>
          </div>
          <div>
            <!-- <f7-stepper
              :min="(bagTemp.item.qty>=bagTemp.item.min)?parseInt(bagTemp.item.min):parseInt(bagTemp.item.qty)"
              :max="bagTemp.item.qty"
              :value="(bagTemp.item.qty>=bagTemp.qty)?bagTemp.qty:bagTemp.item.qty"
              @stepper:change="bagTemp.qty = $event"
              raised
              large
            ></f7-stepper> -->
            <f7-stepper
              :value="parseInt(bagTemp.qty) || 1"
              :min="1"
              @stepper:change="bagTemp.qty = parseInt($event)"
              raised
              large
            ></f7-stepper>
          </div>
        </div>
        <div
          class="
            display-flex
            padding
            justify-content-space-between
            align-items-center
          "
        >
          <div style="font-size: 18px">
            <b class="capitalized">Total:</b>
          </div>
          <div>
            <b style="font-size: 22px" class="text-color-primary">
              <numeric :value="bagTemp.item.price * parseInt(bagTemp.qty)" />
            </b>
          </div>
        </div>
        <div class="padding-horizontal padding-bottom">
          <f7-row>
            <f7-col>
              <!-- <f7-button large outline :disabled="!bagTemp.item.qty">Checkout</f7-button> -->
              <f7-button large outline @click="paymentPage('now')"
                >Checkout</f7-button
              >
            </f7-col>
            <f7-col>
              <!-- <f7-button large fill :disabled="!bagTemp.item.qty" @click="addToBag()">Add To Bag</f7-button> -->
              <f7-button large fill @click="addToBag()">Add To Bag</f7-button>
            </f7-col>
          </f7-row>
        </div>
      </div>
    </f7-sheet>

    <!-- Bag -->

    <f7-sheet
      :opened="bagSheet"
      @sheet:closed="bagSheet = false"
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
              {{ bag[0] ? bag[0].currency : "" }}
              <b style="font-size: 22px">
                <numeric :value="totalPrice" />
              </b>
            </div>
          </div>
          <div class="padding-horizontal padding-bottom">
            <f7-button large fill @click="paymentPage('bag')"
              >Make Payment</f7-button
            >
            <div class="margin-top text-align-center">
              Swipe up for more details
            </div>
          </div>
        </div>
        <!-- Rest of the sheet content that will opened with swipe -->
        <f7-block-header medium class="margin-top">Your order:</f7-block-header>

        <div
          v-for="item in bag"
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
              item.name || ""
            }}</b>
            <p>
              {{ item.currency }}
              <numeric :value="item.price" />
            </p>
          </div>
          <div>
            <!-- <f7-stepper
                :min="(item.stock>=item.min)?item.min:item.stock"
                :max="item.stock"
                :value="(item.stock>=item.qty)?item.qty:item.stock"
                @stepper:change="updateBag(item.sku, $event, item.stock)"
                raised
                large
              ></f7-stepper> -->
            <f7-stepper
              :min="1"
              :value="item.qty"
              @stepper:change="updateBag(item.sku, $event, item.stock)"
              raised
              large
            ></f7-stepper>
          </div>
        </div>
        <!-- <f7-stepper
              :min="(bagTemp.item.qty>=bagTemp.item.min)?parseInt(bagTemp.item.min):parseInt(bagTemp.item.qty)"
              :max="bagTemp.item.qty"
              :value="(bagTemp.item.qty>=bagTemp.qty)?bagTemp.qty:bagTemp.item.qty"
              @stepper:change="bagTemp.qty = $event"
              raised
              large
            ></f7-stepper> -->
      </div>
    </f7-sheet>
  </div>
</template>
<script>
import scanproduct from "./scan.vue";
import { capitalizeLetter } from "../js/function-helper";
import { mapState } from "vuex";
import debounce from "debounce";
import { StreamBarcodeReader } from "vue-barcode-reader";

const limit = 10;

export default {
  components: {
    scanproduct,
    StreamBarcodeReader,
  },
  data() {
    return {
      showPreloader: true,
      productOffset: 0,
      productRecord: 0,
      popupPayment: false,
      beforeAddSheet: false,
      bagSheet: false,
      paymentList: [],
      discountList: [],
      productList: [],
      productFilter: {
        city: "",
      },
      edit: {},
      bagTemp: {
        item: null,
        qty: 0,
      },
      popupScan: false,
      payNow: "",
      selectedPayment: {},
      dataToPay: {
        items: [],
        orderid: "",
        log: "",
        payment: "",
        discount_desc: "",
        discount: 0,
      },
      manualDiscount: {
        type: ["%", "Rp"],
        selected: "%",
        directDisc: 0,
      },
    };
  },
  methods: {
    // Load Payment
    loadPayment() {
      this.axios.get("/payment").then((res) => {
        this.paymentList = res.data.content.result;
      });
    },
    // Load Discount
    loadDiscount() {
      this.axios.get("/discount_type").then((res) => {
        this.discountList = res.data.content.result;
      });
    },
    loadProduct() {
      this.showPreloader = true;
      let data = {
        limit: limit,
        offset: this.productOffset,
      };
      let ajax;
      if (this.search) {
        data.filter = this.search;
        ajax = this.axios.post("/product/search", data);
      } else {
        ajax = this.axios.post("/product", data);
      }
      ajax
        .then((res) => {
          let data = res.data.content;
          if (data.result) {
            data.result.map((el) => {
              this.productList.push(el);
            });
          } else this.productList = [];
          this.productRecord = data.record;
          this.showPreloader = false;
          data;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    loadMoreProduct() {
      if (!this.showPreloader && this.productList.length < this.productRecord) {
        this.productOffset += limit;
        this.loadProduct();
      }
    },
    searchProduct: debounce(function (event) {
      this.productList = [];
      this.productOffset = 0;
      this.productRecord = 0;
      this.loadProduct();
    }, 500),
    reloading() {
      this.productList = [];
      this.loadProduct();
    },
    beforeAdd(id) {
      this.isLoading = true;
      this.$f7.preloader.show();

      this.axios
        .get(`/product/details/${id}`)
        .then((res) => {
          let product = res.data.content;

          let index = this.bag.findIndex((el) => el.sku === product.sku);
          if (index >= 0) {
            this.bagTemp.item = {
              id: this.bag[index].id,
              sku: this.bag[index].sku,
              name: this.bag[index].name,
              tax: this.bag[index].tax,
              stock: product.qty,
              currency: this.bag[index].currency,
              min: this.bag[index].min,
              qty: product.qty,
              price: this.bag[index].price,
              totalPrice: this.bag[index].price * this.bag[index].qty,
            };
            this.bagTemp.qty = this.bag[index].qty;
            padding;
          } else {
            this.bagTemp.item = product;
            let priceSplit = product.price.replace(/\s/g, "").split("-");
            this.bagTemp.item.price = parseInt(
              priceSplit[1].replace(/\./g, "")
            );
            let min = parseInt(product.min);
            this.bagTemp.item.min = product.min > 0 ? product.min : 1;
            this.bagTemp.qty = this.bagTemp.item.min;
          }
          this.beforeAddSheet = true;
          this.isLoading = false;
          this.$f7.preloader.hide();
        })
        .catch((err) => {
          this.isLoading = false;
          this.$f7.preloader.hide();
        });
    },
    addToBag() {
      let data = {
        id: this.bagTemp.item.id,
        sku: this.bagTemp.item.sku,
        name: this.bagTemp.item.name,
        tax: this.bagTemp.item.tax || 0,
        currency: this.bagTemp.item.currency,
        min: this.bagTemp.item.min ? this.bagTemp.item.min : 1,
        // stock: (this.bagTemp.item.qty),
        qty: parseInt(this.bagTemp.qty),
        price: this.bagTemp.item.price,
        totalPrice: this.bagTemp.item.price * this.bagTemp.qty,
      };
      this.$store.commit("login/addtobag", data);
      this.beforeAddSheet = false;
      this.bagTemp = {
        item: null,
        qty: 0,
      };
    },
    updateBag(sku, qty, stock) {
      let data = {
        sku: sku,
        qty: qty,
        stock: stock,
      };
      this.$store.commit("login/addtobag", data);
    },
    checkStock() {
      this.bag.map((el) => {
        this.axios.get(`/product/details/${el.id}`).then((res) => {
          let product = res.data.content;
          this.updateBag(
            product.sku,
            product.qty >= el.qty ? el.qty : product.qty,
            product.qty
          );
        });
      });
    },

    barcodeScanned(event) {
      this.$f7.preloader.show();
      let data = {
        sku: event,
        limit: "1",
        offset: "0",
      };
      this.axios
        .post("/product", data)
        .then((res) => {
          let product = res.data.content.result;
          if (product.length) {
            this.beforeAdd(product[0].id);
          } else {
            this.$f7.toast
              .create({
                text: "Product not found",
                position: "center",
                closeTimeout: 2000,
                destroyOnClose: true,
              })
              .open();
            this.$f7.preloader.hide();
          }
        })
        .catch((err) => {
          this.$f7.toast
            .create({
              text: "Product not found",
              position: "center",
              closeTimeout: 2000,
              destroyOnClose: true,
            })
            .open();
          this.$f7.preloader.hide();
        });
    },
    onDecode(result) {
      this.$f7.dialog.alert(result);
      //   console.log(result);
    },
    paymentPage(nowOrBag) {
      this.payNow = nowOrBag;
      if (nowOrBag == "now") {
        this.dataToPay.items = [
          {
            id: this.bagTemp.item.id,
            sku: this.bagTemp.item.sku,
            name: this.bagTemp.item.name,
            tax: this.bagTemp.item.tax || 0,
            currency: this.bagTemp.item.currency,
            min: this.bagTemp.item.min ? this.bagTemp.item.min : 1,
            log: this.log,
            qty: parseInt(this.bagTemp.qty),
            price: this.bagTemp.item.price,
            totalPrice: this.bagTemp.item.price * this.bagTemp.qty,
          },
        ];
      } else {
        this.dataToPay.items = this.bag;
      }

      // Close Sheet
      this.beforeAddSheet = false;
      this.bagSheet = false;

      // Open Pop Up
      this.popupPayment = true;
    },
    selectPayment() {
      let action = [
        {
          text: "Payment Method",
          label: true,
        },
      ];
      this.paymentList.map((el) => {
        let buttonItem = {};
        buttonItem.text = el.name;
        buttonItem.onClick = () => {
          this.selectedPayment = el;
          this.dataToPay.payment = el.id;
        };
        action.push(buttonItem);
      });
      let cancelButton = {
        text: "Cancel",
        color: "red",
      };
      action.push(cancelButton);

      let payment = this.$f7.actions.create({
        buttons: action,
      });
      payment.open();
    },

    selectVoucher() {
      let disc_action = [
        {
          text: "Available Discount",
          label: true,
        },
      ];
      this.discountList.map((el) => {
        let buttonItem = {};
        buttonItem.text = el.code;
        buttonItem.onClick = () => {
          this.dataToPay.discount_desc = el.code;
          this.dataToPay.discount = el.value;
        };
        disc_action.push(buttonItem);
      });
      let cancelButton = {
        text: "Cancel",
        color: "red",
      };
      disc_action.push(cancelButton);

      let discount = this.$f7.actions.create({
        buttons: disc_action,
      });
      // Open Discount
      discount.open();
    },
    selectDiscType(val) {
      this.dataToPay.discount = 0;
      this.manualDiscount.directDisc;
      this.manualDiscount.selected = val;
    },
    customDiscount(val) {
      this.dataToPay.discount_desc = "";
      this.dataToPay.discount = 0;
      this.manualDiscount.directDisc = 0;
      if (this.manualDiscount.selected == "%")
        this.dataToPay.discount = val / 100;
      else this.manualDiscount.directDisc = val;
    },
    pay() {
      if (this.dataToPay.payment) {
        if (this.manualDiscount.selected == "Rp")
          this.dataToPay.discount = this.manualDiscount.directDisc;
        this.dataToPay.log = this.log;
        console.log(this.dataToPay)
        this.$f7.dialog.preloader();
        this.axios
          .post("/pos/add_multiple", this.dataToPay)
          .then((res) => {
            if (this.payNow != "now") this.$store.commit("login/resetbag");
            this.$f7.dialog.close();
            this.$f7.dialog.alert("Payment success", "Success");
            this.beforeAddSheet = false;
            this.bagSheet = false;
            this.closePaymentPage();
          })
          .catch((err) => {
            this.$f7.dialog.close();
            this.$f7.dialog.alert(err.response.data.error, "Error");
          });
      } else {
        this.$f7.dialog.alert("Select payment method", "Error");
      }
    },
    closePaymentPage() {
      this.popupPayment = false;
      this.payNow = "";
      this.selectedPayment = {};
      this.dataToPay = {
        items: [],
        orderid: "",
        log: "",
        payment: "",
        discount_desc: "",
        discount: 0,
      };
      this.manualDiscount = {
        type: ["%", "Rp"],
        selected: "",
        directDisc: 0,
      };
    },
  },
  computed: {
    ...mapState({
      bag: (state) => state.login.bag,
      log: (state) => state.login.dataUser.log,
    }),
    bagCount() {
      let total = 0;
      if (this.bag) {
        this.bag.map((el) => {
          total += parseInt(el.qty);
        });
      }
      return total;
    },
    totalPrice() {
      let total = 0;
      if (this.bag) {
        this.bag.map((el) => {
          total += el.totalPrice;
        });
      }
      return total;
    },
    subTotal() {
      let total = 0;
      if (this.dataToPay.items) {
        this.dataToPay.items.map((el) => {
          total += el.totalPrice;
        });
      }
      return total;
    },
  },
  created() {
    this.productList = [];
    this.loadProduct();
    this.loadPayment();
    this.loadDiscount();
  },
};
</script>