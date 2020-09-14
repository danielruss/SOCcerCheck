// catch the form submit

function unparse(results, filename) {
  console.log("unparsing results...", results, "to file ", filename);
  let csv = Papa.unparse(results);

  var element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function check() {
  let file = document.getElementById("inputFile");
  if (file.files.length == 0) return;
  let error_list = document.getElementById("error_list");
  error_list.innerText = "";
  let myResults = [];
  //let reader = new FileReader();
  let filename = file.files[0].name;
  filename = filename.substring(0, filename.indexOf(".csv")) + "-auto_cleaned.csv";
  console.log(file.files[0], "==>", filename);
  Papa.parse(file.files[0], {
    header: true,
    step: (result) => {
      if (result.errors.length == 0) {
        let keys = Object.getOwnPropertyNames(result.data);
        keys.forEach((key) => {
          // replace the newline character with a space..
          result.data[key] = result.data[key].replace(/\n/g, " ");
        });
        console.log("saving to ", filename);
        myResults.push(result.data);
      } else {
        let error_list = document.getElementById("error_list");

        result.errors.forEach((error) => {
          let error_item = document.createElement("li");
          if (!result.data.id || result.data.id.length == 0) {
            error_item.innerText = error.row + ": Possible empty row  it will be removed";
          } else {
            error_item.innerText = error.row + ": " + error.message + " id:" + result.data.id + "  you need to fix this line";
          }
          error_list.appendChild(error_item);
        });
      }
    },
    complete: () => {
      console.log("all done..");
      unparse(myResults, filename);
    },
  });
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("SOCcerFileCheck").addEventListener("submit", (event) => {
    event.preventDefault();
    check();
  });
});
