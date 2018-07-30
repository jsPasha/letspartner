import Vue from "vue/dist/vue.js";
import $ from "jquery";
import axios from "axios";
import submitAjaxForm from "../methods/ajaxForm";
import { imageCropper, multipleInit } from "../components/imageCropper";
import deleteAjax from "../methods/deleteAjax";

if (document.getElementById("company_form")) {
  let map;
  var marker;
  var geocoder = new google.maps.Geocoder();

  var placeSearch, autocomplete;
  var componentForm = {
    street_number: "short_name",
    route: "long_name",
    locality: "long_name",
    administrative_area_level_1: "short_name",
    country: "long_name"
  };

  function initAutocomplete() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });

    marker = new google.maps.Marker({
      map: map,
      draggable: true
    });

    marker.addListener("dragend", function(event) {
      var latlng = this.getPosition();

      geocoder.geocode({ location: latlng }, function(results, status) {
        if (status === "OK") {
          if (results[0]) {
            $("#autocomplete").val("");
            fillInAddress(results[0]);
          }
        }
      });
    });

    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", function() {
      fillInAddress(this.getPlace());
    });
    autocomplete.bindTo("bounds", map);
  }

  var address;

  function fillInAddress(place) {
    marker.setVisible(false);
    address = {};
    if (!place.geometry) {
      alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17); // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    for (var component in componentForm) {
      document.getElementById(component).value = "";
      document.getElementById(component).disabled = false;
    }

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType).value = val;
        address[addressType] = val;
        if (addressType === 'country') address.countryCode = place.address_components[i]['short_name'];
      }
    }
  }

  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        var bounds = circle.getBounds();
        autocomplete.setBounds(bounds);

        map.setCenter(geolocation);
      });
    }
  }
  geolocate();

  let description_lang = [];

  $('input[v-model="description_lang"]').each(function() {
    if (this.checked) description_lang.push(this.value);
  });

  let userInTeam = +$('input[v-model="userInTeam"]').val();

  let activePart = location.hash.substr(1);

  let companyForm = new Vue({
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
      ajaxSubmit: event => {
        submitAjaxForm(event.target.form);
      },
      deleteMember: (companyId, memberId) => {
        let $block = $(event.target).closest(".item");
        deleteAjax(
          `/action/deleteMember?companyId=${companyId}&memberId=${memberId}`
        ).then(() => {
          $block.remove();
        });
      },
      addLocation: () => {
        console.log(address);
      }
    },
    mounted: () => {
      initAutocomplete();
      $(".choosen_select").chosen();
      $(".selectized").selectize({
        options: [],
        create: true,
        delimiter: ",",
        valueField: "name",
        labelField: "name",
        searchField: "name",
        load: function(query, callback) {
          $.ajax({
            method: "get",
            url: `/api/tags/?q=${query}`,
            success: res => {
              callback(res);
            }
          });
        }
      });
    },
    created: () => {
      $("#company_form").css("opacity", 1);
    }
  });

  $(window).on("hashchange", function(e) {
    companyForm.activePart = location.hash.substr(1) || "info";
  });
}
