<template>
  <div>
    <v-card class="mb-8">
      <v-card-text>
        <v-col cols="12" sm="6" md="8" class="py-0">
          <v-text-field
            clearable
            @change="tryEnableTranslateButton"
            class="py-0"
            :placeholder="localeWords['TxtToTranslate']"
            filled
            v-model="textToTranslate"
          />
        </v-col>
      </v-card-text>

      <v-card-text class="py-0">
        <v-row>
          <v-col cols="12" sm="3" md="4" class="py-0">
            <v-select
              @change="tryEnableTranslateButton"
              class="ml-4"
              v-model="fromLanguageCode"
              :label="localeWords['FromLanguage']"
              :items="languages"
              item-text="name"
              item-value="code"
            />
          </v-col>
          <v-spacer />
          <v-col cols="12" sm="3" md="4">
            <v-select
              @change="tryEnableTranslateButton"
              class="px-4"
              :label="localeWords['ToLanguage']"
              v-model="toLanguageCode"
              :items="languages"
              item-text="name"
              item-value="code"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="disableTranslateBtn"
          class="ml-5 mb-5"
          :loading="saving"
          @click="translateClick"
          color="light-green"
          >{{ localeWords["btnTranslate"] }}</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-text>
        <v-col cols="12" sm="8" md="12">
          <v-text-field
            readonly
            :label="localeWords['txtTranslationDisplayed']"
            large
            outlined
            color="black"
            v-model="translation"
          ></v-text-field>
        </v-col>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { call, get } from "vuex-pathify";

export default {
  data() {
    return {
      toLanguageCode: "",
      fromLanguageCode: "xx",
      textToTranslate: "",
      saving: false,
      translatedText: "Translated text here",
      ready2Translate: false,
      disableTranslateBtn: true,
    };
  },
  async created() {
    this.toLanguageCode = this.localeCode;
    //await this.loadLanguages();
  },
  methods: {
    loadLanguages: call("languageStore/loadLanguages"),
    async oldtranslateClick() {
      const ToLanguage = "detect";
      const FromLanguage = "detect";
      const ToLanguageCode = this.toLanguageCode;
      const FromLanguageCode = this.fromLanguageCode;
      const TextToTranslate = this.textToTranslate;

      const data = {
        ToLanguage,
        FromLanguage,
        ToLanguageCode,
        FromLanguageCode,
        TextToTranslate,
      };
      console.log(data);
    },
    ...call("languageStore", ["loadLanguages", "testTranslation"]),
    async translateClick() {
      this.saving = true;
      const ToLanguage = "detect";
      const FromLanguage = "detect";
      const ToLanguageCode = this.toLanguageCode;
      const FromLanguageCode = this.fromLanguageCode;
      const TextToTranslate = this.textToTranslate;
      const data = {
        ToLanguage,
        FromLanguage,
        ToLanguageCode,
        FromLanguageCode,
        TextToTranslate,
      };
      try {
        this.translatedText = await this.testTranslation(data);
      } finally {
        this.saving = false;
      }
    },
    // tryEnableTranslateButton() {
    //   this.ready2Translate =
    //     this.textToTranslate != null &&
    //     this.toLanguageCode != null &&
    //     this.fromLanguageCode != null &&
    //     this.textToTranslate != "" &&
    //     this.toLanguageCode != "" &&
    //     this.fromLanguageCode != "";
    //   console.log(this.TextToTranslate);
    // },
    tryEnableTranslateButton() {
      this.disableTranslateBtn =
        this.textToTranslate === null ||
        this.textToTranslate === "" ||
        this.toLanguageCode === null ||
        this.toLanguageCode === "" ||
        this.fromLanguageCode === null ||
        this.fromLanguageCode === "";
    },
  },
  computed: {
    localeCode: get("languageStore/selectedLocaleCode"),
    localeWords: get("languageStore/localeWordDict"),
    languages: get("languageStore/languages"),
    ...get("languageStore"),
    translation: get("languageStore/Translation"),
  },
};
</script>