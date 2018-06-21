import $ from "jquery";

const loader = {
  show: () => {
    $("body").append(`<div id="fixed_preloader" class="fixed-preloader">
		<div class="preloader-wrapper small active">
			<div class="spinner-layer spinner-green-only">
			<div class="circle-clipper left">
				<div class="circle"></div>
			</div><div class="gap-patch">
				<div class="circle"></div>
			</div><div class="circle-clipper right">
				<div class="circle"></div>
			</div>
			</div>
		</div>
	 </div>`);
  },
  hide: () => {
    $("#fixed_preloader").remove();
  }
};

export default loader;
