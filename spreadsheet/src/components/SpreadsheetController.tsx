import React, {ReactElement, useEffect, useState} from 'react';
import {ISpreadsheetModel} from "../model/ISpreadsheetModel";
import Header from "./header";
import FormulaBox from "./formulaBox";
import Table from "./tableComponent";
import {columnIndexToLetter, letterToColumnIndex} from "../util/utils";
import {CellReference} from "../model/CellReference";
import { Alert } from 'antd';
import {CellStyle, RGBColor} from "../model/CellStyle";
import writeXlsxFile from 'write-excel-file'
import {ExcelDataVisitor} from "../model/visitors/ExcelDataVisitor";


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

  const handleClickExport = async (): Promise<void> => {
    let visitor = new ExcelDataVisitor();
    model.accept(visitor);
    let data = visitor.getResult();
    await writeXlsxFile(data, {
      fileName: 'spreadsheet.xlsx'
    })
  }

  const handleClickClearCell = () : void => {
    handleFormulaChange("");
    handleClickCellBackground({r:255,g:255,b:255});
  }

  const handleClickCellBackground = (color : {r:number,g:number,b:number}) : void => {
    model.updateCellStyle(CellReference.createCellReference(selected[0] + "" + selected[1]),
                          new CellStyle(new RGBColor(color.r, color.g, color.b)));
    setNumTimesEnterHit(numTimesEnterHit + 1);
  }

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

  const getCellStyle = (rowIndex : number, columnLetter : string) => {
    return model.getCellStyle(new CellReference(rowIndex, columnLetter));
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
               numTimesEnterHit={numTimesEnterHit}
               getCellStyle={getCellStyle}/>
      </>
  );
}

export default SpreadsheetController;
