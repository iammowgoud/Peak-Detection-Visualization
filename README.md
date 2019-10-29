# 📈📈📈 Realtime Peak Detection Visualization 📈📈📈
(with live streaming)

### [Demo 🔗](https://peak-detection-visualization.herokuapp.com/)

### [Blog Post 🔗](https://hatem-hassan.com/blog/Realtime-Data-Visualization-with-Peak-Detection-using-SocketIO-D3-and-React/)

## Project 
In this project I'm trying to build a React app that can stream data using Socket.io from a live stream (presumably a **sensor**) and visualize the **readings** in a time series line chart accordingly using D3.js

To simulate the **sensor**, I created a very small server using Express.js that rotate over a JSON file  and keeps on sending data **reading** by **reading** *every 1 second* forever.

The data file `api/data.json` contains mock data for 3 sensors. You can connect to the socket by pinging `https://localhost:4001?socket={sensorId}`. **sensorId** can only be 1 or 2 or 3 *for now*.

I didn't spend much time on the server development and didn't implement proper error handling/reporting because that's not the scope of the project.

The frontend app contains two main classes:
  * Chart: `src/components/Chart.js`
    * This is the main React component that connects to the relevant **sensor** to stream  **readings**, store it then does some data manipulation logic and finally initialize and update the D3 chart.
    * The React component has 1 **required prop** `sensorID` and optional `x-ticks` which has a default value of 20 and a max value of 50.
  * D3TsChart: `src/d3-helpers/d3-ts-chart.js`
    * This is the class that handles the Time Series Chart graphics and everything related to the chart SVG.
    * **Readings** are passed to this class to be rendered in DOM using D3 but never stored in the class itself. The data lives in the `Chart` component state.

## Installation

There are 2 projects in this repo so you need to run `npm install` in **both** the client root `/` and server `/api/` directories.

## Running

I wanted to test the different cases when the server is not available or when multiple clients connect/disconnect to the server sockets.

* To run the server: `npm start` in `/api`
* To run the client: `npm run serve` in `/`
    - Client should automatically open `http://localhost:3000` in browser)

You can run these commands in any order or you can shutdown and restart the server several times to see the effect on UI.

To run both apps using one command you can `npm start` in `/`. The app will be served on `:4001`

## TODO / Improvments

* Add x-ticks property to `Chart` and control it from UI
  * **50%**
* Make the D3 SVG responsive [CRITICAL]
  * Currently responses to parent element CSS on each new Reading render tick.
  * Need to decouple responsiveness from rendering.
  * The `adjustDimensions`  function adds extra an render cycle that can be avoided
  * Maybe do some performance tracking here to decide whether to rely on browser API `onresize` or not.
* UX
  * Make it pretty. UX is minimal and very basic now.
  * Improve copy. e.g: Initial load should show 'Connecting' instead of the negative 'Disconnected'
* This project is designed to work with a stateful WebSockets API assuming a live streaming scenario. Could also make it support batch streaming REST with a periodic `setInterval`.