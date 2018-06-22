import $ from "jquery";

const publish = ({ model, id, value }) => {
  let url = "/api/publish/";
  $.ajax({
    type: "POST",
    url,
    data: {
      model,
      id,
      value
    },
    success: () => console.log("ok"),
    error: error => console.log(value)
  });
};

export default publish;
