import React, {ReactElement, useState} from 'react';
import {ISpreadsheetModel} from "../model/ISpreadsheetModel";
import Header from "./header";
import FormulaBox from "./formulaBox";
import Table from "./table";
import {letterToColumnIndex} from "../util/utils";

interface ControllerProps {
  model : ISpreadsheetModel;
}



const SpreadsheetController = ({model} : ControllerProps) : ReactElement => {
  const [selected, setSelected] = useState(["A", 1]);

  const handleCellClick = (rowNumber : number, columnLetter : string) : void => {
    if (rowNumber > 0 && letterToColumnIndex(columnLetter) > 0) {
      setSelected([columnLetter, rowNumber]);
    }
  }

  return (
      <>
        <Header/>
        <FormulaBox/>
        <Table model={model} selected={selected} handleCellClick={handleCellClick}/>
      </>
  );
}

export default SpreadsheetController;
