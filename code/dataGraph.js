var dataArray = [];

var defaultZoomTime = 3*60*1000; // 3 dakika
var minZoom = -15; //
var maxZoom = 8; // ~ 8.4 ay

var zoomLevel = 0;
var viewportEndTime = new Date();
var viewportStartTime = new Date();
var che = 0;


function setAuto()
{
    setInterval(uppdate, 3000);
}
function uppdate() 
{
    loadCSV();
    viewportEndTime = new Date(viewportEndTime.getTime() + getViewportWidthTime()/20); 
    updateViewport();
}

function loadCSV() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            dataArray = parseCSV(this.responseText);
            google.charts.load('current', { 'packages': ['line', 'corechart'] });
            google.charts.setOnLoadCallback(updateViewport);
        }
    };
    xmlhttp.open("GET", "/data.csv", true);
    xmlhttp.send();
    var loadingdiv = document.getElementById("loading");
    loadingdiv.style.visibility = "visible";
}

function parseCSV(string) {
    var array = [];
    var lines = string.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var data = lines[i].split(",", 2);
        data[0] = new Date(parseInt(data[0]) * 1000);
        data[1] = parseFloat(data[1]);
        array.push(data);
    }
    return array;
}

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'UNIX');
    data.addColumn('number', 'Data');

    data.addRows(dataArray);

    var options = {
        curveType: 'function',

        height: 360,

        legend: { position: 'none' },

        hAxis: {
            viewWindow: {
                min: viewportStartTime,
                max: viewportEndTime
            },
            gridlines: {
                count: -1,
                units: {
                    days: { format: ['MMM dd'] },
                    hours: { format: ['HH:mm', 'ha'] },
                }
            },
            minorGridlines: {
                units: {
                    hours: { format: ['hh:mm:ss a', 'ha'] },
                    minutes: { format: ['HH:mm a Z', ':mm'] }
                }
            }
        },
        vAxis: {
            title: "Data"
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);

    var dateselectdiv = document.getElementById("dateselect");
    dateselectdiv.style.visibility = "visible";

    var loadingdiv = document.getElementById("loading");
    loadingdiv.style.visibility = "hidden";
}

function displayDate() { // Display the start and end date on the page
    var dateDiv = document.getElementById("date");

    var endDay = viewportEndTime.getDate();
    var endMonth = viewportEndTime.getMonth();
    var startDay = viewportStartTime.getDate();
    var startMonth = viewportStartTime.getMonth()
    if (endDay == startDay && endMonth == startMonth) {
        dateDiv.textContent = (endDay).toString() + "/" + (endMonth + 1).toString();
    } else {
        dateDiv.textContent = (startDay).toString() + "/" + (startMonth + 1).toString() + " - " + (endDay).toString() + "/" + (endMonth + 1).toString();
    }
}

function prev() {
    viewportEndTime = new Date(viewportEndTime.getTime() - getViewportWidthTime()/3);
    updateViewport();
}
function next() {
    viewportEndTime = new Date(viewportEndTime.getTime() + getViewportWidthTime()/3);
    updateViewport();
}

function zoomout() {
    zoomLevel += 1;
    if(zoomLevel > maxZoom) zoomLevel = maxZoom;
    else updateViewport();
}
function zoomin() {
    zoomLevel -= 1;
    if(zoomLevel < minZoom) zoomLevel = minZoom;
    else updateViewport();
}

function reset() {
    viewportEndTime = new Date();
    updateViewport();
}
function refresh() {
    viewportEndTime = new Date();
    loadCSV();
}

function updateViewport() {
    viewportStartTime = new Date(viewportEndTime.getTime() - getViewportWidthTime());
    displayDate();
    drawChart();
}
function getViewportWidthTime() {
    return defaultZoomTime*(2**zoomLevel);
}

