function pager(parurl) 
{
  var xhr = new XMLHttpRequest();
  var url = parurl;

  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content_baslik").innerHTML =
      this.responseText;
    }
  };

  xhr.open("GET", url, true);
  xhr.send();

  w3_close();

}


function debug(elm, urlPar)
{
	var xhr = new XMLHttpRequest();
	var url = urlPar;
  var el = document.getElementById(elm);

  xhr.onreadystatechange = function() 
  {
    if (this.readyState == 4 && this.status == 200) 
    {
      //el.innerHTML =this.responseText;
      if(this.responseText == 'false')
      {
        el.innerHTML = 'failed!';
        el.className = "w3-red";       
      }
      else
      {

        el.innerHTML = 'OK!';
        el.className = "w3-green";
      }
      el.style.visibility = 'visible';
      setTimeout( function() {
        el.style.visibility = 'hidden';
      }, 700);
    }
  };

	xhr.open("GET", url, true);
 	xhr.send();
}


function writeData(elm)
{
  var xhr = new XMLHttpRequest();
  var el = document.getElementById(elm);
  var addr = document.getElementById("writeAddr").value;
  var data = document.getElementById("writeData").value;
  var url = "/memWrite?addr="+addr+"&data="+data;

  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      el.innerHTML =
      this.responseText;
      el.className = "w3-green";
      el.style.visibility = 'visible';
      setTimeout( function() {
        el.style.visibility = 'hidden';
      }, 700);
    }
  };

  xhr.open("GET", url, true);
  xhr.send();

}

function readData(elm)
{

  var xhttp = new XMLHttpRequest();
  var el = document.getElementById(elm);
  var addr = document.getElementById("readAddr").value;
  var url = "/memRead?addr="+addr;

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("readData").innerHTML =
      this.responseText;
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();

}

function flash(filename) 
{
  var file = filename;
  var url = "api/flash?file=" + file;
  document.getElementById("statusFlash").innerHTML = "Flashing";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() 
  {
      if (this.readyState == 4 && this.status == 200)
      {
        document.getElementById("statusFlash").innerHTML =
        this.responseText;
      }
  };

  xhr.open("GET", url, true);
  xhr.send();
}

function erase() 
{
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/erase", true);
  xhr.send();
}

function writeDp()
{
  var xhr = new XMLHttpRequest();

  var addr = document.getElementById("writeDpAddr").value;
  var data = document.getElementById("writeDpData").value;
  var url = "/apWrite?addr="+addr+"&data="+data;

  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("statusDp").innerHTML =
      this.responseText;
    }
  };

  xhr.open("GET", url, true);
  xhr.send();

  document.getElementById("postDpUrl").innerHTML = url;

}

function writeAp()
{
  var xhr = new XMLHttpRequest();

  var addr = document.getElementById("writeApAddr").value;
  var data = document.getElementById("writeApData").value;
  var url = "/apWrite?addr="+addr+"&data="+data;

  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("statusAp").innerHTML =
      this.responseText;
    }
  };

  xhr.open("GET", url, true);
  xhr.send();

  document.getElementById("postApUrl").innerHTML = url;

}

function w3_open() {
  document.getElementById("main").style.marginLeft = "50%";
  document.getElementById("mySidebar").style.width = "50%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}

function doSubmit()
{
// Form Data
  var formData = new FormData();

  var fileSelect = document.getElementById("fileSelect");
  if(fileSelect.files && fileSelect.files.length == 1){
    var file = fileSelect.files[0]
    formData.set("file", file , file.name);
  }

  // Http Request  
  var request = new XMLHttpRequest();
  document.getElementById("fileStat").innerHTML = "Uploading...";
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("fileStat").className = "w3-text-green w3-xlarge w3-animate-opacity";
      document.getElementById("fileStat").innerHTML = "File upload succesful &#10004";
      reloadfs();
      listFs();
      setTimeout( function() 
      {
        document.getElementById("fileStat").className = "w3-text-blue w3-xlarge w3-animate-opacity";
        document.getElementById("fileStat").innerHTML = "Select a file...";
      }, 2000);
    }
  };
  request.open('POST', "/upload", true);
  request.send(formData);
}

function reloadfs()
{
  document.getElementById("ref_i").className = "material-icons w3-spin";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() 
  {
      if (this.readyState == 4 && this.status == 200)
      {
        var ret = this.responseText;
        var obj = JSON.parse(ret);
        document.getElementById("per_usage").innerHTML =obj.per;
        document.getElementById("used_fs").innerHTML =obj.used;
        document.getElementById("total_fs").innerHTML =obj.total;
        var elem = document.getElementById("myBar");
        elem.style.width = obj.per + '%';
        document.getElementById("ref_i").className = "material-icons";
      }
  };

  xhr.open("GET", "/api/fs", true);
  xhr.send();
}

function listFs(arg) 
{
  var xhttp = new XMLHttpRequest();
  var el = document.getElementById("fileSelect_pr");

  var fileNameEnd = arg;
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      var len = el.length;
    for(var i = 0; i < len; i++)
    {
      el.remove(el.length-1);
    }

    var files = this.responseText.split(",");

    if(fileNameEnd == 'all')
    {
      for(var i = 0; i < files.length; i++)
      {
        var option = document.createElement("option");
        option.text = files[i];
        el.add(option);
      }
    }
    else
    {
      for(var i = 0; i < files.length; i++)
      {
          var option = document.createElement("option");
          if (files[i].endsWith(fileNameEnd)) 
          {
            option.text = files[i];
            el.add(option);
          }
        }
    }
  }
  };

  xhttp.open("GET", "/api/list", true);
  xhttp.send();
}


  function removeFile() 
{
  var xhttp = new XMLHttpRequest();
  var el = document.getElementById("fileSelect_pr");
  var url = "/api/removeFile?file="+el.value;
  document.getElementById('rusure').style.display='none'

  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("removeFile_stat").innerHTML = this.responseText;
    reloadfs();
    listFs('all');
  }
  };

  xhttp.open("GET", url, true);
  xhttp.send();
}
