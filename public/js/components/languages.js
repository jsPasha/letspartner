import Vue from "vue/dist/vue.js";
import axios from "axios";

if (document.getElementById("languages_page")) {
  new Vue({
    el: "#languages_page",
    data: {
      constants: []
    },
    methods: {
      submit() {
        const data = this.constants;
        axios.post("/api/languages", {
          params: {
            data
          }
        });
      }
    },
    beforeMount: async function() {
      let langs = await axios.get("/api/languages");
      this.constants = langs.data;
    },
    created() {
      console.log("created");
    },
    mounted() {
      console.log("mounted");
    }
  });
}
