window.onload = function() {
  SetJSON();
  loadData();
}

//---------- Set JSON in localstorage if not yet defined-------------
function SetJSON() {
  //Set in array the different pages for initializing the different json objects.
  var PageArray = ["lights.html", "screens.html", "blinds.html", "temperature.html", "settings.html"];
  //Loop through and set undefined pages in localstorage.
  for (var i = 0; i < PageArray.length; i++) {
    if (window.localStorage.getItem(PageArray[i]) == null) {
      window.localStorage.setItem(PageArray[i], "");
    }
  }
}

//---------- Drag en drop functies op de "screens" pagina----------------
function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var htmlPreview =
        '<p>' + input.files[0].name + '</p>'; //de file naam wordt in de html gezet
        var wrapperZone = $(input).parent();
        var previewZone = $(input).parent().parent().find('.preview-zone');
        var boxZone = $(input).parent().parent().find('.preview-zone').find('.box-body');

        wrapperZone.removeClass('dragover');
        previewZone.removeClass('hidden');
        boxZone.empty();
        boxZone.append(htmlPreview);
      };
      reader.readAsDataURL(input.files[0]);
    }


  }

  $(".dropzone").change(function() {
    readFile(this);
  });

  $('.dropzone-wrapper').on('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('dragover');
  });

  $('.dropzone-wrapper').on('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass('dragover');
  });
//--------einde drag en drop functies op de "screens" pagina----------------


//------------------------- toggle button functie----------------------------
let aantalItems = document.getElementsByClassName("grid_item").length;
function toggleFunction(click_id){
  for(number = 0; number < aantalItems; number ++){
    let id = "toggleSwitch" + number;
    let checkBox = document.getElementById("toggleSwitch"+number);

    if((id == click_id) && (checkBox.checked == true)){ //als toggleSwitch+number gelijk is aan de ID van de geklikte switch button. 
      document.getElementsByClassName("grid_item")[number].classList.add("turnedOn");
    } 
    else if((id == click_id) && (checkBox.checked == false)){
      document.getElementsByClassName("grid_item")[number].classList.remove("turnedOn");
    } 
  }
  //Save changed data.
  var pagevalue = (window.location.href.split("/")).slice(-1)[0];
  saveData(pagevalue, click_id);
}
//---------------einde toggle button functie-----------------------


 //----------------------color slider functies--------------------------

 let hue = 130;
 let sat = 60;
 let light = 55;

 const hslToRGB = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);          
        r = r.toFixed(3);
        g = g.toFixed(3);
        b = b.toFixed(3);
      }   
      return `<${(r)},${(g)},${(b)}>`;
    }

    const hslToHex = (h, s, l) => {
      h /= 360;
      s /= 100;
      l /= 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);        
      }
      const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    const colorChange = () => {  
      const swatch = document.querySelector('.swatch');
      swatch.style.backgroundColor = getHSL();
      swatch.value = getHEX();
    //console.log(`${getHSL()} hex: ${getHEX()}`);  
   //alert(getRGB());  
   document.getElementById('floatVal').innerText = getRGB();

 };

 const getHEX = () => {
  return hslToHex(hue, sat, light);
};
const getRGB = () => {
  return hslToRGB(hue, sat, light);
};
const getHSL = () => {
  return `hsl(${hue}, ${sat}%, ${light}%)`;
};

const main = () => {
  const hueInput = document.querySelector('input[name=hue]');
  hueInput.addEventListener('input', () => {
    hue = hueInput.value;
    colorChange();
  });

  const satInput = document.querySelector('input[name=sat]');
  satInput.addEventListener('input', () => {
    sat = satInput.value;
    colorChange();
  });



  colorChange();
};

document.addEventListener('DOMContentLoaded', main);

//---------------einde color slider functie-----------------------


//------------------------- ophalen data functie-------------------------
function loadData() {
  //Load saved data on pageload.
  //Get the current page.
  var pagevalue = (window.location.href.split("/")).slice(-1)[0];
  //If the value is empty, nothing has been saved yet.
  if ((window.localStorage.getItem(pagevalue)) !== "") {
    var pageItems = JSON.parse(window.localStorage.getItem(pagevalue));
    //The settings page requires different data to be loaded, instead of toggles.
    if (pagevalue == "settings.html") {
      dozument.getElementById("presetname").value = pageItems[0].name;
      document.getElementById("editorname").value = pageItems[0].editor;
      document.getElementById("language").value = pageItems[0].language;
    }
    //Turn on all switched if the saved value is true.
    else {
      for (var i = 0; i < pageItems.length; i++) {
        if (pageItems[i].value == true) {
         document.getElementsByClassName("grid_item")[i].classList.add("turnedOn");
         document.getElementById(pageItems[i].id).checked = true;
       }
     }
   }
 }
}
 //---------------einde ophalen data functie-----------------------


//------------------------- opslaan data functie-------------------------
function saveData(page, elementid) {
  //The settings page requires different data to be saved.
  if (page == "settings.html") {
    var settingsjson = [];
    settingsjson.push({
      name: document.getElementById("presetname").value,
      editor: document.getElementById("editorname").value,
      language: document.getElementById("language").value
    });
    window.localStorage.setItem(page,  JSON.stringify(settingsjson));
  }
  //For every other page:
  else {
    //In case there is no data saved yet, this makes a new json array.
    if ((window.localStorage.getItem(page)) == "") {
      var gridelement = document.getElementsByClassName("grid_item");
      var pagejson = [];
      //Push data to an array and set to localstorage.
      for (var i = 0; i < gridelement.length; i++) {
        pagejson.push({
          id: document.getElementById("toggleSwitch"+i).id,
          value: document.getElementById("toggleSwitch"+i).checked
        });
      }
      window.localStorage.setItem(page,  JSON.stringify(pagejson));
    }
    //If there is data defined, this will change the value corresponding to the changed item.
    else {
      var ParsedData = JSON.parse(window.localStorage.getItem(page));
      for (var x = 0; x < ParsedData.length; x++) {
        if (ParsedData[x].id == elementid) {
          ParsedData[x].value = document.getElementById("toggleSwitch"+x).checked;
        }
      }
      window.localStorage.setItem(page,  JSON.stringify(ParsedData));
    }
  }
}
//---------------einde opslaan functie-----------------------