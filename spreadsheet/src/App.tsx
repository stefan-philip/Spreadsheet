import React from 'react';
import SpreadsheetController from "./components/SpreadsheetController";
import {SpreadsheetModel} from "./model/SpreadsheetModel";

function App() {
  return (
      <SpreadsheetController model={new SpreadsheetModel()}/>
  );
}

export default App;
