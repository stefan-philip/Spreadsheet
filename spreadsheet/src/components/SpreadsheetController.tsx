import React, {ReactElement, useEffect, useState} from 'react';
import {ISpreadsheetModel} from "../model/ISpreadsheetModel";
import Header from "./header";
import FormulaBox from "./formulaBox";
import Table from "./tableComponent";
import {letterToColumnIndex} from "../util/utils";
import {CellReference} from "../model/CellReference";


interface ControllerProps {
  model : ISpreadsheetModel;
}



const SpreadsheetController = ({model} : ControllerProps) : ReactElement => {
  const [selected, setSelected] = useState(["A", 1]);
  const [numTimesEnterHit, setNumTimesEnterHit] = useState(0);

  useEffect(() => { }, [model])

  function getSelectedFormula(selectedPair : (string | number)[]) : string {
    return model.getCellFormula(new CellReference(selectedPair[1] as number, selectedPair[0] as string));
  }

  const handleFormulaChange = (newFormula : string) => {
    try {
      setNumTimesEnterHit(numTimesEnterHit + 1);
      model.updateCellFormula(new CellReference(selected[1] as number, selected[0] as string), newFormula);
    }
    catch (e) {
      // @ts-ignore
      console.log("ERROR: " + e.message);
    }
  }

  const handleCellClick = (rowNumber : number, columnLetter : string) : void => {
    if (rowNumber > 0 && letterToColumnIndex(columnLetter) > 0) {
      setSelected([columnLetter, rowNumber]);
    }
  }

  const handleClickExport = () : void => { }

  const handleClickClearCell = () : void => {
    handleFormulaChange("");
    
  }

  const handleClickCellBackground = () : void => { }
  const handleClickAddRow = () : void => { }
  const handleClickAddColumn = () : void => { }
  const handleClickRemoveRow = () : void => { }
  const handleClickRemoveColumn = () : void => { }

  return (
      <>
        <Header handleClickExport={handleClickExport}
                handleClickClearCell={handleClickClearCell}
                handleClickCellBackground={handleClickCellBackground}
                handleClickAddRow={handleClickAddRow}
                handleClickAddColumn={handleClickAddColumn}
                handleClickRemoveRow={handleClickRemoveRow}
                handleClickRemoveColumn={handleClickRemoveColumn}/>

        <FormulaBox getSelectedFormula={getSelectedFormula}
                    selected={selected}
                    handleFormulaChange={handleFormulaChange}/>
        <Table model={model}
               selected={selected}
               handleCellClick={handleCellClick}
               numTimesEnterHit={numTimesEnterHit}/>
      </>
  );
}

export default SpreadsheetController;
