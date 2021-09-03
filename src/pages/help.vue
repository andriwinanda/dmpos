<template>
  <div>
    <f7-page :hide-navbar-on-scroll="true">
      <f7-navbar back-link no-hairline no-shadow :title="$t('help.label')">
        <f7-nav-right>
          <f7-icon f7="question_circle"/>
        </f7-nav-right>
      </f7-navbar>
      <iframe class="html-view" src="https://dswip.com/"></iframe>
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
    };
  },
  methods: {
   
  },
};
</script>
<style scoped>
.page {
  background: none !important;
  background-color: white !important;
}
.html-view{
  width: 99.5%;
  height: 93.5vh;
  border: none !important;
}
</style>