import React, {ReactElement, useEffect, useState} from 'react';
import {ISpreadsheetModel} from "../model/ISpreadsheetModel";
import Header from "./header";
import FormulaBox from "./formulaBox";
import Table from "./tableComponent";
import {columnIndexToLetter, letterToColumnIndex} from "../util/utils";
import {CellReference} from "../model/CellReference";
import { Alert } from 'antd';

interface ControllerProps {
  model : ISpreadsheetModel;
}

const SpreadsheetController = ({model} : ControllerProps) : ReactElement => {
  const [selected, setSelected] = useState(["A", 1]);
  const [numTimesEnterHit, setNumTimesEnterHit] = useState(0);

  const [error, setError] = useState("");
  const [shouldShowError, setShouldShowError] = useState(false);

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
      setError(e.message);
      setShouldShowError(true);
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

  const handleClickAddRow = () : void => {
    model.addRowAbove(selected[1] as number);
    setSelected([selected[0], selected[1] as number + 1]);
  }
  const handleClickAddColumn = () : void => {
    model.addColumnToLeft(selected[0] as string);
    setSelected([columnIndexToLetter(letterToColumnIndex(selected[0] as string) + 1), selected[1] as number]);
  }
  const handleClickRemoveRow = () : void => {
    try {
      model.removeRow(selected[1] as number);
      setSelected([selected[0], Math.max(1, selected[1] as number - 1)]);
    }
    catch (e) {
      // @ts-ignore
      setError(e.message);
      setShouldShowError(true);
    }

  }
  const handleClickRemoveColumn = () : void => {
    try {
      model.removeColumn(selected[0] as string);
      setSelected([columnIndexToLetter(Math.max(1, letterToColumnIndex(selected[0] as string) - 1)), selected[1] as number]);
    }
    catch (e) {
      // @ts-ignore
      setError(e.message);
      setShouldShowError(true);
    }
  }

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

        {shouldShowError && <Alert message={error}
                                  closable={true}
                                  showIcon={true}
                                  onClose={()=>{setShouldShowError(false)}}
                                   banner={true}/>}


        <Table model={model}
               selected={selected}
               handleCellClick={handleCellClick}
               numTimesEnterHit={numTimesEnterHit}/>
      </>
  );
}

export default SpreadsheetController;
