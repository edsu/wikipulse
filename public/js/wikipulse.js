var charts = {};

function drawChart(wikipedia, range, combined) {
  var url = "/stats/" + wikipedia + "/" + range + ".json";
  $.getJSON(url, function(edits) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Label');
    data.addColumn('number', 'Value');
    data.addRows(1);
    data.setValue(0, 0, shortName(wikipedia));
    data.setValue(0, 1, edits);

    var size = (combined ? 500 : 120),
        max = (combined ? 1000 : 300),
        endGreen = (combined ? 600 : 180),  // green = <10 edits/second (global gauge), <3 ed/s (single gauges)
        endYellow = (combined ? 900 : 240); // yellow = 10-15 ed/s (global gauge), 3-5 ed/s (single gauges)
                                            // red = >15 ed/s (global gauge), >5 ed/s (single gauges)
    var options = {
        width: size,
        height: size,
        max: max,
        minorTicks: (combined ? 2 : 5),
        majorTicks: (combined ? ["0","200","","","",max] : ["0","50","","","","",max]),
        greenColor: "GreenYellow",
        greenFrom: 0, greenTo: endGreen,
        yellowColor: "Gold",
        yellowFrom: endGreen, yellowTo: endYellow,
        redColor: "Tomato",
        redFrom: endYellow, redTo: max
    };

    var chart = null;
    if (charts[wikipedia]) {
      chart = charts[wikipedia];
    } else {
      chart = new google.visualization.Gauge($("#" + wikipedia)[0]);
      charts[wikipedia] = chart;
    }
    chart.draw(data, options);
    var draw = 'drawChart("' + wikipedia + '",' + range + "," + combined + ")";
    setTimeout(draw, 1000);
  });
}

function shortName(wikipedia) {
  return wikipedia.split("-")[0];
}
