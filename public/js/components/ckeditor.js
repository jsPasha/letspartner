import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function initCkeditors() {
  var cke = document.getElementsByClassName("ckeditor_item");
  [].forEach.call(cke, function(el) {
    ClassicEditor.create(el, {
		removePlugins: ["Heading", "italic"],
		toolbar: ['bold', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
    });
  });
}
