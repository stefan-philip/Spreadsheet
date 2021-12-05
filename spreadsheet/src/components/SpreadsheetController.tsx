import React, {ReactElement} from 'react';
import {ISpreadsheetModel} from "../model/ISpreadsheetModel";
import Header from "./header";
import FormulaBox from "./formulaBox";

interface ControllerProps {
  model : ISpreadsheetModel;
}

const SpreadsheetController = ({model} : ControllerProps) : ReactElement => {
  return (
      <>
        <Header/>
        <FormulaBox/>
      </>
  );
}

export default SpreadsheetController;
