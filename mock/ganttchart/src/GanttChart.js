import React, { useLayoutEffect } from 'react';
import './App.css';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import jsonData from './data.json';
import { useNavigate } from "react-router-dom";


const  GanttChart = () => {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    
  let root = am5.Root.new("chartdiv");
  root.dateFormatter.setAll({
    dateFormat: "yyyy-MM-dd HH:mm",
    dateFields: ["valueX", "openValueX"]
  });


  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);


  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  let chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout
  }));

  let colors = chart.get("colors");

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  let yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "description",
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    })
  );

  const descriptionList = jsonData.cards.map(obj => obj.description); 
  const descriptionArray =[];

  for(let member of descriptionList){
   descriptionArray.push({ description: member });
  };

  yAxis.data.setAll(descriptionArray);

  let xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: "minute", count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {})
    })
  );

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    openValueXField:  "start",
    valueXField: "end",
    categoryYField: "description",
    sequencedInterpolation: true
  }));

  series.columns.template.setAll({
    strokeOpacity: 0,
    tooltipText: "{task}:\n[bold]{openValueX}[/] - [bold]{valueX}[/]"
  });
 

  series.data.processor = am5.DataProcessor.new(root, {
    dateFields: [ "start", "end"],
    dateFormat: "yyyy-MM-dd HH:mm"
  });

  series.data.setAll(jsonData.cards);
  series.columns.template.adapters.add("fill", function(fill, target) {
    return colors.getIndex(series.columns.indexOf(target));
  });
  // Add scrollbars
  chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear();
  chart.appear(1000, 100);

  return () => {
      root.dispose();
  };
  }, []);

  return (
    <div className="ganttchart"> 
      <h1>ガントチャート</h1>
      <button
        className="Task_btn"
        onClick={() => navigate('/Task')}
      >
        タスク画面
      </button>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
}
export default GanttChart;