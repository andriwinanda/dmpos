<template>
  <f7-page :page-content="false" >
    <f7-navbar class="text-color-primary capitalized" transparent>
      <p class="capitalized text-color-white" slot="title">{{$t('product.label')+' Detail'}}</p>
      <f7-link slot="right" popup-close>
        <f7-chip slot="left" class="no-padding-right">
          <f7-icon slot="media" f7="multiply"></f7-icon>
        </f7-chip>
      </f7-link>
    </f7-navbar>
    <f7-toolbar v-if="produkDetail && !isEditFormActive" bottom>
      <f7-block style="width:100%">
        <f7-row>
          <f7-col>
            <f7-button
              fill
              :color="publish == 0? 'green': 'gray'"
              @click="publishProduct()"
            >{{publish == 0? 'Publish': 'Unpublish'}}</f7-button>
          </f7-col>
          <f7-col>
            <f7-button fill color="red" @click="deleteProduct()">Delete</f7-button>
          </f7-col>
        </f7-row>
      </f7-block>
    </f7-toolbar>
    <f7-page-content class="no-padding-top" >
      <div v-if="produkDetail">
        <img
          style="margin: 0 auto; display: block; width: 100%;"
          :src="produkDetail.image? produkDetail.image: 'https://wtwp.com/wp-content/uploads/2015/06/placeholder-image.png'"
          alt
        />
        <f7-block v-if="!isEditFormActive">
          <h2 class="capitalized">{{produkDetail.name || '-'}}</h2>
          <h2 class="text-color-primary">{{produkDetail.currency}} {{produkDetail.price}}</h2>
          <br />
          <h4>{{$t('general.description')}}</h4>
          <table width="100%">
            <tr>
              <td>Model</td>
              <td>: {{produkDetail.model || ''}}</td>
            </tr>
            <tr>
              <td>{{$t('general.category')}}</td>
              <td class="capitalized">: {{produkDetail.category || ''}}</td>
            </tr>
            <tr>
              <td>Brand</td>
              <td class="capitalized">: {{produkDetail.brand || ''}}</td>
            </tr>
            <tr>
              <td>Sku</td>
              <td>: {{produkDetail.sku || ''}}</td>
            </tr>
            <tr>
              <td>Qty</td>
              <td>: {{produkDetail.qty || 0}}</td>
            </tr>
            <tr>
              <td>{{$t('product.weight')}}</td>
              <td class="capitalized">: {{produkDetail.weight || '-'}}</td>
            </tr>
            <tr>
              <td>{{$t('product.size')}}</td>
              <td class="capitalized">: {{produkDetail.size || '-'}}</td>
            </tr>
            <tr>
              <td>{{$t('product.dimension')}}</td>
              <td class="capitalized">: {{produkDetail.dimension || '-'}}</td>
            </tr>
            <tr>
              <td>{{$t('general.description')}}</td>
              <td>
                :
                <small>
                  <i>{{produkDetail.description || '-'}}</i>
                </small>
              </td>
            </tr>
          </table>
          <br />

          <f7-button fill color="primary" @click="editProduct()">Edit</f7-button>
        </f7-block>
        <f7-block v-else>
          <f7-list no-hairlines>
            <f7-list-input
              label="Name"
              type="text"
              :value="edit1.tname"
              @input="edit1.tname = $event.target.value"
            ></f7-list-input>
            <f7-list-input
              label="SKU"
              type="text"
              :value="edit1.tsku"
              @input="edit1.tsku = $event.target.value"
            ></f7-list-input>
            <f7-list-input
              label="Model"
              type="text"
              :value="edit1.tmodel"
              @input="edit1.tmodel = $event.target.value"
            ></f7-list-input>
            <f7-list-input
              v-model="edit1.ccurrency"
              @input="edit1.ccurrency= $event.target.value"
              label="Currency"
              type="select"
            >
              <option
                v-for="currency in currencyList"
                :key="currency.id"
                :value="currency.code"
              >{{currency.code}}</option>
            </f7-list-input>
            <f7-list-input
              v-model="edit1.ccategory"
              @input="edit1.ccategory= $event.target.value"
              label="Category"
              type="select"
            >
              <option
                v-for="category in categoryList"
                :key="category.id"
                :value="category.id"
              >{{category.name.toUpperCase()}}</option>
            </f7-list-input>
            <f7-list-input
              v-model="edit1.cmanufacture"
              @input="edit1.cmanufacture= $event.target.value"
              label="Brand"
              type="select"
            >
              <option
                v-for="manfacture in manufactureList"
                :key="manfacture.id"
                :value="manfacture.id.toLowerCase()"
              >{{manfacture.name.toUpperCase()}}</option>
            </f7-list-input>

            <f7-list-input
              label="Qty"
              type="number"
              :value="edit3.tmin"
              :min="0"
              @input="edit3.tmin = $event.target.value"
            ></f7-list-input>
            <f7-list-input
              label="Lower Price"
              type="number"
              :value="edit3.tlowprice"
              :max="edit3.tprice"
              @input="edit3.tlowprice = $event.target.value"
            ></f7-list-input>
            <f7-list-input
              label="Net Price"
              type="number"
              :min="edit3.tlowprice"
              :value="edit3.tprice"
              @input="edit3.tprice = $event.target.value"
            ></f7-list-input>
            <f7-list-input
              type="textarea"
              :value="edit1.tdesc"
              @input="edit1.tdesc = $event.target.value"
              label="Description"
              placeholder="Description"
            ></f7-list-input>
          </f7-list>
          <br />
          <f7-row>
            <f7-col>
              <f7-button fill color="orange" @click="isEditFormActive = false">Cancel</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill @click="updateProduct()">Save</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
      </div>

      <div v-else>
        <f7-skeleton-block class="skeleton-effect-blink" style="width: 100%; height: 250px;" slot="media"></f7-skeleton-block>
        <div class="padding">
          <f7-skeleton-text class="skeleton-effect-blink" tag="h4">Lorem ipsum, dolor sit amet consectetur </f7-skeleton-text>
          <f7-skeleton-text class="skeleton-effect-blink" tag="h4">Lorem ipsum, dolor sit amet  </f7-skeleton-text>
          <br>
          <f7-skeleton-text class="skeleton-effect-blink" tag="h4">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque ad doloribus, excepturi maxime molestias assumenda esse molestiae repudiandae aliquam debitis nihil libero sequi fugiat laborum ipsa nemo, sint vel corrupti?</f7-skeleton-text>
        </div>
      </div>
    </f7-page-content>
  </f7-page>
</template>
<script>
import { urlEncoded } from "../js/function-helper";
export default {
  props: ["id", "publish"],
  data() {
    return {
      isLoading: false,
      produkDetail: null,
      currencyList: [],
      manufactureList: [],
      categoryList: [],
      edit1: {
        tname: "",
        tsku: "",
        tmodel: "",
        ccur: "",
        ccategory: 0,
        cmanufacture: "",
        tdesc: "",
        tshortdesc: ""
      },
      edit3: {
        tprice: 0,
        tlowprice: 0,
        tmin: 1
      },
      isEditFormActive: false
    };
  },
  methods: {
    publishProduct(event) {
      this.$f7.dialog.preloader();

      this.axios
        .get(`/product/publish/${this.id}`)
        .then(res => {
          this.$f7.dialog.close();
          this.$f7.dialog.alert("Success", "Success!");
          this.$emit("reload", this.type);
          this.$f7.popup.close();
        })
        .catch(err => {
          this.$f7.dialog.close();
          this.$f7.dialog.alert(err.response.data.error, "Error!");
        });
    },
    deleteProduct() {
      this.$f7.dialog.confirm(
        `Are you sure to delete ?`,
        () => {
          this.$f7.dialog.preloader();
          this.axios
            .get(`/product/delete/${this.id}`)
            .then(res => {
              this.$f7.dialog.close();
              this.$f7.dialog.alert("Delete success", "Success!");
              this.$emit("reload", this.type);
              this.$f7.popup.close();
            })
            .catch(err => {
              this.$f7.dialog.close();
              this.$f7.dialog.alert(err.response.data.error, "Error!");
            });
        },
        this.$f7.dialog.close()
      );
    },

    editProduct() {
      this.isEditFormActive = true;
      this.loadCategory();
      this.loadCurrency();
      this.loadManufacture();
      this.edit1 = {
        tname: this.produkDetail.name,
        tsku: this.produkDetail.sku,
        tmodel: this.produkDetail.brand,
        ccur: this.produkDetail.currency,
        ccategory: this.produkDetail.category_id,
        cmanufacture: this.produkDetail.brand_id,
        tdesc: this.produkDetail.description,
        tshortdesc: this.produkDetail.sdesc
      };
      let priceSplit = this.produkDetail.price.replace(/\s/g, "").split("-");
      this.edit3 = {
        tlowprice: priceSplit[0].replace(/\./g, ""),
        tprice: priceSplit[1].replace(/\./g, ""),
        tmin: this.produkDetail.qty,
        tdisc_p: this.produkDetail.disc_p,
        tdiscount: this.produkDetail.discount
      };
    },
    // Load Category
    loadCategory() {
      this.axios.get("/category").then(res => {
        this.categoryList = [];
        let category = res.data.content.result;
        category.map(el => {
          let elCateogory = {};
          elCateogory.code = el.code;
          elCateogory.name = el.name;
          elCateogory.id = el.id;
          this.categoryList.push(elCateogory);
        });
      });
    },
    // Load Currency
    loadCurrency() {
      this.axios.get("/currency").then(res => {
        this.currencyList = [];
        let currency = res.data.content.result;
        currency.map(el => {
          this.currencyList.push(el);
        });
      });
    },
    // Load manufacture
    loadManufacture() {
      this.manufactureList = [];
      this.axios.get("/manufacture").then(res => {
        this.manufactureList = [];
        let manufacture = res.data.content.result;
        manufacture.map(el => {
          let manufactureElement = {};
          manufactureElement.id = el.id;
          manufactureElement.name = el.name;
          this.manufactureList.push(manufactureElement);
        });
      });
    },
    loadData() {
      this.isLoading = true;
      this.axios
        .get(`/product/details/${this.id}`)
        .then(res => {
          this.produkDetail = res.data.content;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    updateProduct() {
      this.$f7.dialog.preloader();
      this.axios
        .post(`/product/update/${this.id}/1`, urlEncoded(this.edit1), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        .then(res => {
          this.axios
            .post(`/product/update/${this.id}/3`, urlEncoded(this.edit3), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              this.$f7.dialog.close();
              this.$f7.dialog.alert("Update success", "Success!");
              this.isEditFormActive = false;
              this.loadData();
            });
        })
        .catch(err => {
          this.$f7.dialog.close();
          this.$f7.dialog.alert(err.response.data.error, "Error!");
        });
    }
  },

  created() {
    this.loadData();
  }
};
</script>
<style scoped>
.overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
}
.page {
  background: none !important;
  background-color: #ffffff !important;
}
</style>