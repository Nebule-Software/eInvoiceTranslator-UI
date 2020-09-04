import axios from 'axios';
import { make } from "vuex-pathify";

interface LanguageByCode {
  name: string;
  code: string;
}

interface LanguageState {
  languages: LanguageByCode[];
  nativeLanguages: LanguageByCode[];
  selectedLocaleCode: string;
  fromLanguageComboBox: string;

}

const state: LanguageState = {
  languages: [],
  nativeLanguages:[],
  selectedLocaleCode: "en",
  fromLanguageComboBox: "From:"
}

const mutations = make.mutations(state);

const actions = {
  async loadLanguages({ commit, state} ) {  
    //const res = await axios.get('https://httpbin.org/get', { params: { answer: 42 } });
    const url = 
    `https://einvoicetranslatorweb.azurewebsites.net/api/locale/getLanguageNamesByCodev2?LanguageCode=${state.selectedLocaleCode}`
    const { data } = await axios.get(url);
    commit("SET_LANGUAGES", data)
  },

  async loadNativeLanguages({ commit }) {
    const { data } = await axios.get("https://einvoicetranslatorweb.azurewebsites.net/api/locale/getNativeLanguageNamesFilev2/");
    commit("SET_NATIVE_LANGUAGES", data)
  },
  selectLocaleCode({ commit }, code) {
    commit("SET_SELECTED_LOCALE_CODE", code);
  },
  saveSomething({ commit }, { something }) {
    //axios.post('url', data, {
    //  headers: {
   //     'Content-Type': 'application/json',
   // }
    //}
    return axios.post("https://localhost:44390/api/fileapi/savesomething/", something, {
      headers: {
        'Content-Type': 'application/json'
      }});
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}