
var values = [];
var timeStamp = [];
var startStop = 0;
var intFunc;
function showGraph()
{
    for (i = 0; i < arguments.length; i++) {
    	values.push(arguments[i]);    
    }
 
    var ctx = document.getElementById("Chart").getContext('2d');
    var Chart2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeStamp,
            datasets: [{
                label: "Value",
                fill: false,
                backgroundColor: 'rgba( 243, 156, 18 , 1)',
                borderColor: 'rgba( 243, 156, 18 , 1)',
                data: values,
            }],
        },
        options: {
            title: {
                    display: true,
                    text: "Readed Value"
                },
            maintainAspectRatio: false,
            elements: {
            line: {
                    tension: 0.5
                }
            },
            scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
            }
        }
    });
 
}

function startStoping() 
{
  if (startStop == 0) 
  {
    var intvar = parseInt(document.getElementById("intvar").value);
    console.log(intvar);
    showGraph(5,10,4,58);
    intFunc = setInterval(function(){getData();},intvar);
    startStop = 1;
    document.getElementById("st_btn").innerHTML = "Stop";
  }
  else
  {
    clearInterval(intFunc);
    document.getElementById("st_btn").innerHTML = "Begin";
    startStop = 0;
  }
  
}

function getData() {
  var url = "/memRead?addr=" + document.getElementById("addr").value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     var str = this.responseText;
     var res = str.split(" ");
	var time = new Date().toTimeString().split(" ")[0];
	var data = parseInt(res[2]);
  console.log(this.responseText);
  console.log(data); 
      values.push(data);
      timeStamp.push(time);
      showGraph();
	  var table = document.getElementById("dataTable");
	  var row = table.insertRow(1);
	  var cell1 = row.insertCell(0);
	  var cell2 = row.insertCell(1);
	  cell1.innerHTML = time;
	  cell2.innerHTML = data;
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}