import $ from "jquery";
import { imageCropper, multipleInit } from "./components/imageCropper";
import initCkeditors from "./components/ckeditor";
import setState from "./methods/state";
import getVideo from "./methods/video";

import React from "react";
import ReactDOM from "react-dom";
import ReactPhoneInput from "react-phone-input-2";

if (document.getElementById("phone")) {
  ReactDOM.render(
    React.createElement(ReactPhoneInput, {
      defaultCountry: "ua",
      name: "phone",
      value: document.getElementById("phone").dataset.phone
    }),
    document.getElementById("phone")
  );
}

initCkeditors({
  items: "ckeditor_item",
  callback: () => ""
});

require("./components/floatContent");
require("./components/popups");
require("./components/autocomplete");
require("./components/corporations");

$(".confirm").click(function(e) {
  if (!confirm("Удалить новость?")) e.preventDefault();
});

$(".image_pick").change(function() {
  imageCropper(this);
});

$(document).on("change", ".image_pick_multiple", function() {
  multipleInit(this);
});

$(document).on("keyup change paste", ".video_link", function() {
  getVideo(this);
});

$("body").on("click", ".state_checkbox", function() {
  let { model, id, state } = this.dataset;
  let value = this.checked;
  $(`input[data-id="${id}"]`)
    .not(this)
    .prop("checked", value);
  setState({ model, id, value, state });
});

$(".ajax_form").submit(function(e) {
  e.preventDefault();
  $(this)
    .find('[type="submit"]')
    .hide();
  const method = $(this).attr("method"),
    url = $(this).attr("action"),
    data = $(this).serialize();
  $.ajax({
    method,
    url,
    data,
    success: data => {
      $.magnificPopup.close();
      $("body").append(`
        <div class="success_fixed">
          ${data.text}
        </div>
      `);
      setTimeout(() => {
        $(".success_fixed").remove();
      }, 2000);
    }
  });
});

$("form").on("change keypress", function() {
  $(this)
    .find('[type="submit"]')
    .show();
});

$(function() {
  $('input[type="submit"]').addClass("active");
});

$(".clear_input").click(function() {
  $(this)
    .siblings("input")
    .val("");
  $(".search_results").hide();
  $(".list_item_wrap").show();
});

$(".static_menu a").click(function(e) {
  e.preventDefault();

  const items = this.getAttribute("data-items");

  $(`a[data-items="${items}"]`).removeClass("active");
  $(this).addClass("active");

  $(items).hide();
  $(this.getAttribute("href")).show();
});
