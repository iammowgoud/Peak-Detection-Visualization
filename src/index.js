import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import Chart from './components/Chart'

ReactDOM.render(
  <div>
    <Chart sensor="1" />
    <Chart sensor="2" show-points="15" />
    <Chart sensor="3" show-points="10"/>

  </div>
  , document.getElementById('root'));
