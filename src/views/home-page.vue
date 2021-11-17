<template>
  <div>
    <v-form
      ref="form"
      target="_blank"
      method="post"
      enctype="multipart/form-data"
      action="https://einvoicetranslatorweb.azurewebsites.net/api/translate/convertxml2htmlv3"
    >
      <v-text-field
        hidden
        name="userAppIdentification"
        v-model="applicationIdentifier"
      />
      <v-card class="mb-3">
        <v-card-title class="ml-4">{{
          localeWords["CreateInvoiceTitle"]
        }}</v-card-title>

        <v-card-text class="py-0">
          <v-row>
            <v-col cols="11" sm="3" md="5" class="ml-6">
              <v-file-input
                @change="tryEnableSubmitButton"
                class="ma-0"
                v-model="XMLFile"
                name="attachment"
                accept="text/xml"
                prepend-icon
                :placeholder="localeWords['inptUpload']"
              ></v-file-input>
            </v-col>
            <v-col cols="11" sm="3" md="5" class="ml-6">
              <v-text-field
                class="invoice-number-textbox ma-0"
                name="attachment"
                label="Invoice Number"
                type="text"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="py-0">
          <v-row>
            <v-col hidden cols="11" sm="3" md="5">
              <v-select
                class="ml-3"
                name="FromLanguageCode"
                v-model="fromSelectedItem"
                :label="localeWords['FromLanguage']"
                :items="languages"
                item-text="name"
                item-value="code"
              />
            </v-col>
            <v-col cols="11" sm="3" md="5">
              <v-select
                class="ml-6"
                name="ToLanguageCode"
                v-model="toSelectedItem"
                :label="localeWords['ToLanguage']"
                :items="languages"
                item-text="name"
                item-value="code"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-container class="ml-3">
            <v-row>
              <v-btn
                :disabled="!fileSelected"
                :loading="saving"
                @click="submit"
                color="light-green"
                >{{ localeWords["btnConvert"] }}</v-btn
              >
              <v-spacer />
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>

      <v-card v-show="HTMLdownloaded">
        <v-card-title class="ml-6">
          {{ localeWords["DownloadTitle"] }}
          <v-spacer />
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" class="ml-8" @click="getXML">
            <v-icon left>mdi-download</v-icon>
            {{ localeWords["btnGetXML"] }}
          </v-btn>
          <v-btn class="ml-8" color="primary" @click="getPDF">
            <v-icon left>mdi-download</v-icon>
            {{ localeWords["btnGetPDF"] }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { call, get } from "vuex-pathify";
export default {
  data() {
    return {
      fromSelectedItem: "xx",
      toSelectedItem: "",
      saving: false,
      XMLFile: null,
      HTMLdownloaded: false,
      applicationIdentifier: 0,
      fileSelected: false,
    };
  },
  async created() {
    this.toSelectedItem = this.localeCode;
    if (localStorage.appIdentifier) {
      console.log(
        "App Identifier found in storage " + localStorage.appIdentifier
      );
    } else {
      localStorage.appIdentifier = Math.floor(Math.random() * 100000000 + 1);
      console.log(
        "App Identifier set in home page " + localStorage.appIdentifier
      );
    }
    this.applicationIdentifier = localStorage.appIdentifier;
  },
  methods: {
    ...call("languageStore", ["Getpdf", "Getxml"]),
    async getPDF() {
      this.saving = true;
      try {
        console.log("this.applicationIdentifier " + this.applicationIdentifier);
        await this.Getpdf(this.applicationIdentifier);
      } finally {
        this.saving = false;
      }
    },
    async getXML() {
      this.saving = true;
      try {
        await this.Getxml(this.applicationIdentifier);
      } finally {
        this.saving = false;
      }
    },
    submit: function () {
      this.saving = true;
      try {
        this.$refs.form.$el.submit();
        console.log("The form Data ", this.XMLFile.name);
        console.log("File for upload", this.$refs.form.$el.fileForUpload);
        this.HTMLdownloaded = true;
      } finally {
        this.saving = false;
      }
    },
    tryEnableSubmitButton() {
      this.fileSelected =
        event.target.files != null && event.target.files.length > 0;
      console.log(event.target.files);
    },
    loadLanguages: call("languageStore/loadLanguages"),
  },
  computed: {
    localeWords: get("languageStore/localeWordDict"),
    localeCode: get("languageStore/selectedLocaleCode"),
    languages: get("languageStore/languages"),
    ...get("languageStore"),
  },
};
</script>

<style scoped>
.invoice-number-textbox {
  width: 175px;
}
</style>
