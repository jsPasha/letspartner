import $ from "jquery";
import loader from "./loader";

require("magnific-popup");
require("cropper");

const popupId = "cropperPopup";
const imgId = "cropperImage";
let $img;
let currendPicker;

/* When user is updating images the old images need to be deleted from server.
Array of images which will be deleted */
let previousImages = [];
let previousImage = null;

const imageCropper = input => {
  if (input.files && input.files[0]) {
    let reader = new FileReader();

    loader.show();

    reader.onload = e => {
      initCropperPopup(e.target.result);
    };

    reader.readAsDataURL(input.files[0]);

    currendPicker = input;
  }
};

const initCropperPopup = imageSrc => {
  let imageTemplate = `<img id="${imgId}" src="${imageSrc}" />`;
  console.log("addddddddddddddddddddddddsdasd");
  if (!document.getElementById(`${popupId}`)) {
    let popupTemplate = `<div id="${popupId}" class="mfp-hide">${imageTemplate}<button class="save_cropped">Обрезать</button></div>`;
    let $popup = $(popupTemplate);
    $popup.appendTo("body");
  } else {
    console.log("asdasd");
    $(`#${popupId}`).prepend(imageTemplate);
  }

  $.magnificPopup.open({
    items: {
      src: `#${popupId}`
    },
    callbacks: {
      open: () => {
        loader.hide();
        $img = $(`#${imgId}`);
        initCropper();
      },
      close: () => {
        destroyCropper();
      }
    }
  });
};

const initCropper = () => {
  $img.cropper({
    aspectRatio: 16 / 9,
    viewMode: 2
  });
};

$("body").on("click", ".save_cropped", () => {
  previousImages.push(previousImage);
  getImage();
});

$(".update_form").submit(function(e) {
  previousImages.forEach(el => {
    $(this).append(
      `<input type="hidden" name="fileForDelete[]" value="${el}" />`
    );
  });
  return true;
});

const getImage = () => {
  $img.cropper("getCroppedCanvas").toBlob(function(blob) {
    var formData = new FormData();

    formData.append("croppedImage", blob);

    loader.hide();

    $.magnificPopup.close();

    $.ajax("/api/upload/cropped-image", {
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
        insertCroppedImage(data.fileName);
      },
      error: function(error) {
        console.log("Upload error");
      }
    });
  });
};

const destroyCropper = () => {
  $img.cropper("destroy");
  $(`#${imgId}`).remove();
  $(".image_pick").val("");
};

const insertCroppedImage = path => {
  let $input = $(currendPicker);
  let img = $input.siblings("img");

  $input.closest(".image_pick_area").addClass("active");
  $input.siblings(".delete_image").attr("data-url", path);
  $input.siblings(".hidden_image_url").val(path);
  $input.siblings(".upload_new_image").attr("data-del-url", path);
  if (!img.length) {
    $(`<img src="/uploads${path}">`).insertAfter(currendPicker);
  } else {
    img.attr("src", `/uploads${path}`);
  }
};

$(".delete_image").click(function(e) {
  e.preventDefault();
  let $this = $(this);
  let url = $this.attr("data-url");

  $this.closest(".image_pick_area").removeClass("active");
  $this.siblings(".hidden_image_url").val("");
  $this.siblings("img").remove();

  if ($this.closest("form").hasClass("update_form")) {
    previousImages.push(url);
  } else {
    deleteImage(url);
  }
});

$(".upload_new_image").click(function(e) {
  e.preventDefault();
  previousImage = $(this).attr("data-del-url");
  $(this)
    .siblings(".image_pick")
    .click();
});

/*Удалить ранее загруженную картинку*/
const deleteImage = url => {
  $.ajax("/api/file/delete/", {
    method: "POST",
    data: {
      url
    },
    success: data => {
      console.log(data);
    },
    error: error => {
      console.log(error);
    }
  });
};

export default imageCropper;
