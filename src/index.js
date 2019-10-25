import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import Chart from './components/chart.js';

ReactDOM.render(
  <div>
    <h1>Sensors Dashboard</h1>
    <Chart sensorId="1" />
    <Chart sensorId="2" x-ticks="20" />
    <Chart sensorId="3" x-ticks="20"/>
  </div>
  , document.getElementById('root'));
