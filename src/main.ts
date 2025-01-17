import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

// Import the Auth0 configuration
// import { domain, clientId } from "../auth_config.json";
const domain = "e-invoicing.eu.auth0.com";
const clientId = "zPRkAeHajk21GRUpIcbQNzgdzdLyWiXA";
const audience = "https://reporting-tool.nebule.software";
// Import the plugin here
import { Auth0Plugin } from "./auth";

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  },
});

Vue.config.productionTip = false;
// change
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
