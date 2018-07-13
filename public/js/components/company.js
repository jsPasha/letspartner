import Vue from "vue/dist/vue.js";
import $ from "jquery";
import axios from "axios";

import { imageCropper, multipleInit } from "../components/imageCropper";

if (document.getElementById("company_form")) {
  let description_lang = [];

  $('input[v-model="description_lang"]').each(function() {
    if (this.checked) description_lang.push(this.value);
  });

  let userInTeam = +$('input[v-model="userInTeam"]').val();

  let activePart = location.hash.substr(1);

  new Vue({
    el: "#company_form",
    data: {
      description_lang,
      addMe: true,
      userInTeam,
      activePart: activePart || "info"
    },
    methods: {
      imageCropper: event => {
        imageCropper(event.target);
      },
      submit: event => {
        event.target.form.submit();
      },
      deleteMember: (companyId, memberId) => {
        axios.post("/action/deleteMember", {
          params: {
            companyId,
            memberId
          }
        });
      }
    },
    created: () => {
      $("#company_form").css("opacity", 1);
    }
  });
}
