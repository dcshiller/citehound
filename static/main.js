var searchForm;
var displayPanel;
var boundMove;


function addSample (sampleNum, e) {
  e.preventDefault();
  firstSample = ["Alan Gibbard", "Terry Horgan", "Jack Woods", "Derek Parfit", "Richard Joyce", "Sharon Street", "Mark Schroeder", "Michael Ridge"  ]
  secondSample = ["Peter Carruthers", "Daniel Dennett", "Patricia Churchland", "Susan Schneider", "Jerry Fodor", "David Papineau", "Ruth Millikan", "Murat Aydede" ]
  clear = ["", "", "", "", "", "", "", "" ]

  let fields = document.getElementsByClassName('authorField');
  let sample;
  switch (sampleNum) {
      case 1 :
        sample = firstSample
        break;
      case 2 :
        sample = secondSample
        break;
      default :
        sample = clear
        break;
    }

    for (let i = 0; i <= 8; i++) {
      fields[i].value = sample[i]
    }
}

function beginMove (DOMelement, e) {
  var coords = {}
  coords.clickOriginX = e.screenX;
  coords.clickOriginY = e.screenY;
  var rect = DOMelement.getBoundingClientRect();
  coords.DOMOriginX = rect.left;
  coords.DOMOriginY = rect.top;
  boundMove =  move.bind(this, coords, DOMelement)
  document.addEventListener("mousemove", boundMove)
}

function endMove () {
  document.removeEventListener("mousemove", boundMove)
}

function move (coords, DOMelement, e) {
  DOMelement.style.left = coords.DOMOriginX + e.screenX - coords.clickOriginX + "px";
  DOMelement.style.top = coords.DOMOriginY + e.screenY - coords.clickOriginY + "px";
}

function queryRequest (e) {
  e.preventDefault();
  document.getElementById("searchButton").disabled = true;
  // setTimeout(function(){
  // }, 10000)
  document.getElementById("intro").style.display = 'none';
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
    const pubList = document.getElementById("pubList")
    pubList.innerHTML = ""
    let message = JSON.parse(this.responseText)
    for (let i = 0; i < message.length; i++) {
      if (message[i].Count > 0) {
        var newEl = document.createElement("li")
        newEl.innerText = message[i].Title + " " + message[i].Count
        pubList.appendChild(newEl)
      }
    }
    document.getElementById("searchButton").disabled = false;
 }
  }
  xhttp.open("POST","/json/", true)
  let fields = document.getElementsByClassName('authorField')
  params = ""
  for (let i = 0; i < fields.length ; i++) {
    if (fields[i].value != ""){
     params += (fields[i].value) + "|";
  }}
  params = params.slice(0, -1);
  xhttp.send(params);
}

function showAbout(e) {
  e.preventDefault();
  document.getElementById("intro").style.display = 'block';
}

function onLoad() {
  var searchButton = document.getElementById("searchButton")
  var aboutButton = document.getElementById("aboutButton")
  var body = document.getElementsByTagName("body")[0];
  document.getElementById('sample1').addEventListener("click", addSample.bind(this,1))
  document.getElementById('sample2').addEventListener("click", addSample.bind(this,2))
  document.getElementById('clearButton').addEventListener("click", addSample.bind(this,3))
  searchForm = document.getElementById("searchForm");
  displayPanel = document.getElementById("displayPanel");
  searchForm.addEventListener("mousedown", beginMove.bind(this, searchForm))
  displayPanel.addEventListener("mousedown", beginMove.bind(this, displayPanel))
  document.addEventListener("mouseup", endMove)
  searchButton.addEventListener("click", queryRequest)
  aboutButton.addEventListener("click", showAbout)
}


document.addEventListener("DOMContentLoaded", onLoad, false)
