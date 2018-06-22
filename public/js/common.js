import $ from "jquery";
import imageCropper from "./components/imageCropper";
import initCkeditors from "./components/ckeditor";
import publish from "./methods/publish";

initCkeditors();

$(".confirm").click(function(e) {
  if (!confirm("Удалить новость?")) e.preventDefault();
});

$(".image_pick").change(function() {
  imageCropper(this);
});

$(".publish_checkbox").click(function() {
  let { model, id } = this.dataset;
  let value = this.checked;
  publish({ model, id, value });
});
