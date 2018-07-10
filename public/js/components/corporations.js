import Vue from "vue/dist/vue.js";
import $ from "jquery";

if (document.getElementById("corporation_form")) {
  let description_lang = [];
  
  $('input[v-model="description_lang"]').each(function() {
    if (this.checked) description_lang.push(this.value);
  });

  new Vue({
    el: "#corporation_form",
    data: {
      description_lang
    },
    methods: {
      setRequred: (event) => {
        console.log(event.target.value)
      }
    }
  });

}
