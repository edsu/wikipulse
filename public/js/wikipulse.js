var charts = {};

function addCharts() {
} 

function drawChart(wikipedia, range, max, height, width) {
  var url = "/stats/" + wikipedia + "/" + range + ".json";
  $.getJSON(url, function(edits) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Label');
    data.addColumn('number', 'Value');
    data.addRows(1);
    data.setValue(0, 0, shortName(wikipedia));
    data.setValue(0, 1, edits);

    var options = {width: width, height: height, minorTicks: 10, max: max};
    var chart = null;
    if (charts[wikipedia]) {
      chart = charts[wikipedia];
    } else {
      chart = new google.visualization.Gauge($("#" + wikipedia)[0]);
      charts[wikipedia] = chart;
    }
    chart.draw(data, options);
    var draw = 'drawChart("' + wikipedia + '",' + range + "," + max + "," + height + "," + width + ")";
    setTimeout(draw, 1000);
  });
}

function shortName(wikipedia) {
  return wikipedia.split("-")[0];
}
