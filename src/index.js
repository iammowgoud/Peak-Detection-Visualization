import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import Chart from './components/Chart';

ReactDOM.render(
  <div>
    <Chart sensorId="1" />
    <Chart sensorId="2" x-ticks="20" />
    <Chart sensorId="3" x-ticks="20"/>
  </div>
  , document.getElementById('root'));
