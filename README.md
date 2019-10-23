# Peak Detection Visualization

## Project
In this project I'm trying to build a React app that can stream data using Socket.io from a live stream (presumably a **sensor**) and graph the **readings** accordingly using D3.js

To simulate the **sensor**, I created a very small server using Express.js that rotate over a JSON file  and keeps on sending data **reading** by **reading** forever.

The data file in `api/data.json` contains example data for 3 sensors. You can connect to the socket by pinging `https://localhost:4001?socket={sensorId}`. **sensorId** can only be 1 or 2 or 3.

I didn't spend much on the server and didn't implement proper error handling/reporting because that's not the scope of the project.

The frontend app contains two main classes:
  * Chart: `src/components/Chart.js`
    * This is the React component that connects to the relevant **sensor** to stream the **readings**, store it and does some data manipulation logic and finally initialize and update the D3 chart.
    * The React component has 1 **required prop** `sensorID` and optional `x-ticks` whcich defaults to 20 and has a max of 50.
  * D3TsChart: `src/d3-helpers/d3-ts-chart.js`
    * This is the class that handles the Time Series Chart graphics and everything related to the chart SVG.
    * **Readings** are passed to this class to be graphed in DOM but never stored in the class itself. Data is part of the `Chart` component state.

## Installation

There is 2 projects in this repo so you need to run `npm install` in **both** the client root `/` and server `/api/` directories.

## Running

I wanted to test the different cases when the server is not available or when multiple clients connect or disconnect to the server sockets.

* To run the server: `npm start` in `/api`
* To run the client: `npm start` in `/`. 

Client should automatically open `http://localhost:3000` in browser)

You can run any one first and you can shutdown and restart the server several times to see the effect on UI.

## TODO

* Add pointsToShow property to `Chart` and control it from UI
  * **50%**
* Make the D3 SVG responsive
  * Currently responses to container CSS on each new Reading render tick.
  * Need to decouple responsiveness from rendering.
* UX
  * Make it pretty. UX is minimal and very basic now
  * Improve copy. e.g: Initial load should show 'Connecting' instead of the negative 'Disconnected'
* This project is designed to work with a stateful WebSockets API assuming a live streaming scenario. Could also make it support batch streaming REST API with a periodic `setInterval`.
* Add JSDoc documentation
  * Last thing to do.