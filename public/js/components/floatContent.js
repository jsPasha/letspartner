import $ from "jquery";

const constrBody = ".constructor_body";

$(".add_item").click(function() {
  const index = $(".constructor_item").length;
  const type = $(this).attr("data-type");
  $(constrBody).append(`<div class="constructor_item">
		<input type="hidden" name="floatContent[${index}][contentType]" value="${type}" />
		${galleryTemplate(index)}
	</div>`);
});

let galleryTemplate = (index) => {
  return `<div class="form-group form-group-image-pick">
	<label>Gallery_image</label>
	<input class="image_pick_multiple" data-id="${index}" type="file" accept="image/" multiple>
	<div class="images_box"></div>
	</div>`;
};
