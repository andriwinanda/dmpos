<template>
  <f7-page :page-content="false">
    <f7-navbar class="text-color-primary capitalized" transparent>
      <p class="capitalized text-color-white" slot="title">{{$t('product.label')+' Detail'}}</p>
      <f7-link slot="right" popup-close>
        <f7-chip slot="left" class="no-padding-right">
          <f7-icon slot="media" f7="multiply"></f7-icon>
        </f7-chip>
      </f7-link>
    </f7-navbar>

    <f7-page-content class="no-padding-top">
      <StreamBarcodeReader @decode="onDecode"></StreamBarcodeReader>
      <ul>
        <li v-for="item in data" :key="item">{{item}}</li>
      </ul>
    </f7-page-content>
  </f7-page>
</template>
<script>
import { StreamBarcodeReader } from "vue-barcode-reader";

export default {
  components: {
    StreamBarcodeReader
  },
  data() {
    return {
      isLoading: false,
      data: [],
      sound: new Audio("https://www.soundjay.com/button/sounds/beep-06.mp3")
    };
  },
  methods: {
    onDecode(result) {
      this.sound.play();
      this.$emit("barcode", result);
      this.$f7.popup.close();

      //   console.log(result);
    }
  }
};
</script>
<style>
.scanner-container video {
  position: relative;
  top: 50%;
  right: 50%;
  margin: 0 auto !important;
  max-width: none !important;
  max-height: 100vh !important;
  min-height: 100vh !important;
}
</style>