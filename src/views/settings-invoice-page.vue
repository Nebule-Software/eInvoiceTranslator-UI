<template>
  <div>
    <v-card class="mb-8">
      <v-card-title class="ml-4">{{
        localeWords["InvoiceTitle"]
      }}</v-card-title>
      <v-card-text class="pa-0">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-select
              class="ml-8"
              v-model="selectedWord"
              :label="localeWords['Cmb4ReTranslate']"
              :items="invoicewords"
              @change="tryEnableSaveButton"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col cols="12" sm="6" md="8">
            <br />
            <v-text-field
              clearable
              class="ml-4"
              v-model="replacementWord"
              :placeholder="localeWords['TxtReplace']"
              @change="tryEnableSaveButton"
              filled
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-actions>

      <v-card-actions>
        <v-row>
          <v-btn
            :disabled="!ready2Save"
            class="ml-8"
            @click="updateTranslation()"
            color="light-green"
            >{{ localeWords["btnSave"] }}</v-btn
          >
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { call, get } from "vuex-pathify";
export default {
  data() {
    return {
      selectedWord: "",
      replacementWord: "",
      saving: false,
      ready2Save: false,
    };
  },
  methods: {
    ...call("languageStore", ["UpdateInvoiceTranslation", "fillInvoiceWords"]),
    async updateTranslation() {
      this.saving = true;
      const translateObject = {
        SelectedWord: this.selectedWord,
        ReplacementWord: this.replacementWord,
      };
      try {
        await this.UpdateInvoiceTranslation(translateObject);
        await this.fillInvoiceWords();
        this.replacementWord = "";
      } finally {
        this.saving = false;
      }
    },
    tryEnableSaveButton() {
      this.ready2Save =
        this.selectedWord != null &&
        this.replacementWord != null &&
        this.selectedWord != "" &&
        this.replacementWord != "";
    },
  },
  computed: {
    localeWords: get("languageStore/localeWordDict"),
    invoicewords: get("languageStore/invoiceWords"),
  },
};
</script>