var TESTER = document.getElementById('tester');

var yValue = [153.48, 155.50, 157.15, 160, 165, 168, 175];

var trace1 = {
  x: [1, 2, 3, 4, 5, 6, 7],
  y: yValue,
  name: 'Coles',
  type: 'bar',
  text: yValue,
  textposition: 'auto',
  textfont: {
      color: '#ffcccc',
  },
  hoverinfo: 'none',
  marker: {
     color: '#e01a22'
  }
};

var yValueW =  [141.94, 141.94, 139.94, 138, 135, 130, 120];
var trace2 = {
  x: [1, 2, 3, 4, 5, 6, 7],
  y: yValueW,
  name: 'Woolies',
  type: 'bar',
  text: yValueW,
  textposition: 'auto',
  textfont: {
      color: '#ccffcc',
  },
  hoverinfo: 'none',
  marker: {
      color: '#1c6917'
  }
};


var data = [trace1, trace2];

var layout = {
    title: "Grocery Price Comparison: wk on wk starting 01/07/17",
    barmode: 'group',
    height: 500,
    width: 75 * yValue.length,
    xaxis: {
        title: "Week #",
    },
    yaxis: {
        title: 'Total Basket Price ($)',
    },
    legend: {
        x: 0,
        y: -0.25,
    },
};

Plotly.newPlot(TESTER, data, layout, {displayModeBar: false});
