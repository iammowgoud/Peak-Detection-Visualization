import React from 'react';
import ReactDOM from 'react-dom';

import socketIOClient from "socket.io-client";
import D3TsChart from '../d3-helpers/d3-ts-chart';

const MAX_POINTS_TO_STORE = 50
const DEFAULT_MAX_POINTS_TO_SHOW = 20
export class Chart extends React.Component {

  tsChart;
  socket;
  state = {
    data: [],
    lastTimestamp: null,
    connected: false,
    error: ""
  }

  componentDidMount() {
    const parentRef = ReactDOM.findDOMNode(this);

    this.tsChart = new D3TsChart({
      elRef: parentRef.getElementsByClassName("chart-container")[0],
      classList: {
        svg: "z-chart"
      }
    });

    this.tsChart.addSeries({
      name: "sensor-data",
      type: "LINE",
      id: "sensor",
      stroke: "steelblue",
    });

    this.tsChart.addSeries({
      name: "z-score",
      type: "AREA",
      id: "zline",
      fill: "rgba(255, 50, 50, 0.25)",
      stroke: "transparent",
      strokeWidth: 0,
    });

    this.connect();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }
  connect = () => {
    this.socket = socketIOClient(`http://localhost:4001?sensor=${this.props.sensor}`);
    this.socket.on("reading", this.storeReading)


    this.socket.on('reconnect_error', this.setError);
    this.socket.on('connect_timeout',this.setError);
    this.socket.on('connect_failed',  this.setError);
    this.socket.on('error', this.setError);
  }

  setError = (e) => {
    this.setState({ data: [], connected: false, error: e.toString() });
  }

  storeReading = (response) => {
    const reading = JSON.parse(response);
    this.setState((prevState) => {
      const data = prevState.data;
      const pointsToStore = Math.max(data.length - MAX_POINTS_TO_STORE, 0);

      data.push(reading);

      return {
        data: data.slice(pointsToStore),
        connected: true,
        error: false,
        lastTimestamp: new Date(data[data.length - 1].timestamp).toLocaleTimeString()
      };
    });

    console.log("stored", this.state.data)
    this.updateChart();
  }

  updateChart() {
    const pointsToShow = Math.max(this.state.data.length - (this.props["show-points"] || DEFAULT_MAX_POINTS_TO_SHOW), 0);
    const data = this.state.data.slice(pointsToShow);
    const highestValueInView = Math.max(...data.map(p => p.value))
    const zLine = data.map(p => ({ timestamp: p.timestamp, value: p.zscore ? highestValueInView : 0 }))
    console.log("showed", data)

    this.tsChart.adjustAxes(data)
    this.tsChart.updateSeries("sensor-data", data, false);
    this.tsChart.updateSeries("z-score", zLine, false);
  }

  pointsToShow = () => Math.max(this.state.data.length - (this.props.points || DEFAULT_MAX_POINTS_TO_SHOW), 0)
  render = () => (
    <div className="card">

      <span className={"status " + (this.state.connected ? 'success-bg' : 'danger-bg')}>{this.state.connected ? "Connected" : "Disconnected"}</span>
      <span className="danger">{this.state.error}</span>
      <span className={"timestamp " + (this.state.connected ? 'success' : 'danger')}>Last poll: {this.state.lastTimestamp}</span>

      <div className={"chart-container " + (this.state.error ? 'error' : '')}></div>
    </div>
  )

}
export default Chart;
