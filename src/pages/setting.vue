<template>
  <div>
    <f7-page :hide-navbar-on-scroll="true">
      <f7-navbar back-link no-hairline no-shadow :title="$t('setting.label')">
        <!-- <f7-subnavbar :inner="false">
        </f7-subnavbar>-->
      </f7-navbar>
      <f7-toolbar v-if="update" bottom style="--f7-toolbar-height: 60px;">
        <f7-block style="width:100%" padding>
          <f7-button fill large @click="updateConfig()">Update</f7-button>
        </f7-block>
      </f7-toolbar>
      <f7-list no-hairlines floating-label>
        <!-- <h1 class="text-color-white">
          <b>{{$t('setting.label')}}</b>
        </h1>-->
        <f7-list-input
          label="Name"
          placeholder="Name"
          @input="update.tname = $event.target.value"
          :value="update.tname"
          type="text"
          large
        ></f7-list-input>
        <f7-list-input
          label="Address"
          placeholder="Address"
          @input="update.taddress = $event.target.value"
          :value="update.taddress"
          type="textarea"
          large
        ></f7-list-input>
        <f7-list-input
          label="Phone"
          placeholder="Phone"
          @input="update.tphone = $event.target.value"
          :value="update.tphone"
          type="text"
          large
        ></f7-list-input>
        <f7-list-input
          label="Email"
          placeholder="Email"
          @input="update.tmail = $event.target.value"
          :value="update.tmail"
          type="email"
          large
        ></f7-list-input>
      </f7-list>
    </f7-page>
  </div>
</template>
<script>
import { urlEncoded } from "../js/function-helper";
export default {
  components: {},
  data() {
    return {
      isLoading: false,
      update: {
        tname: "",
        taddress: "",
        tphone: "",
        tmail: ""
      }
    };
  },
  methods: {
    loadData() {
      this.$f7.preloader.show();
      this.axios.get("/configuration").then(res => {
        this.isLoading = false;
        let data = res.data.content;
        let company = {
          tname: data.name,
          taddress: data.address,
          tphone: data.phone1,
          tmail: data.email
        };
        this.update = company;
        this.$f7.preloader.hide();
      });
    },
    updateConfig() {
      this.$f7.preloader.show();
      this.axios
        .post("/configuration/update_pos", urlEncoded(this.update))
        .then(res => {
          this.$f7.toast
            .create({
              text: res.data.content,
              position: "center",
              closeTimeout: 2000,
              destroyOnClose: true
            })
            .open();
          this.$f7router.navigate("/");
          this.$f7.preloader.hide();
        })
        .catch(err => {
          let message = err.response.data.error.replace(/<[^>]*>/g, '')
          this.$f7.toast
            .create({
              text: message.toString(),
              position: "center",
              closeTimeout: 2000,
              destroyOnClose: true
            })
            .open();
          this.$f7.preloader.hide();
        });
    }
  },
  created() {
    this.loadData();
  }
};
</script>
<style scoped>
.page {
  background: none !important;
  background-color: white !important;
}
</style>