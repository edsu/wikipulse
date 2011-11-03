$(document).ready(init);

function x() {
  alert("hi4");
}

function init() {
  alert('hi1');
  google.load('visualization', '1', {packages: ['gauge']});
  alert('hi2');
  google.setOnLoadCallback(drawChart);
  x();
  alert('hi3');
}

function drawChart() {
  alert('hi5');
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Label");
  data.addColumn("number", "Value");
  data.addRows(1);
  data.setValue(0, 0, 'Memory');

  var chart = new google.visualization.Gauge(document.getElementById("#chart"));
  var options = {width: 400, height: 120, 
                 redFrom: 90, redTo: 100, 
                 yellowFrom: 75, yellowTo: 90, 
                 minorTicks: 5};
  chart.draw(data, options);
  alert('hi6');
}
