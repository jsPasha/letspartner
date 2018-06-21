import $ from "jquery";
import imageCropper from "./components/imageCropper";
import initCkeditors from "./components/ckeditor";

initCkeditors();

$(".confirm").click(function(e) {
  if (!confirm("Удалить новость?")) e.preventDefault();
});

$(".image_pick").change(function() {
  imageCropper(this);
});