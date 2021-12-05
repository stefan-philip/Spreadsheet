import React, {ReactElement, useEffect, useState} from 'react';
import {CellReference, ISpreadsheetModel} from "../model/ISpreadsheetModel";
import Header from "./header";
import FormulaBox from "./formulaBox";
import Table from "./table";
import {letterToColumnIndex} from "../util/utils";


interface ControllerProps {
  model : ISpreadsheetModel;
}



const SpreadsheetController = ({model} : ControllerProps) : ReactElement => {
  const [selected, setSelected] = useState(["A", 1]);

  useEffect(() => {
    console.log("model changed");
  }, [model])

  function handleFormulaChange(newFormula : string) {
    try {
      model.updateCellFormula(new CellReference(selected[1] as number, selected[0] as string), newFormula);
    }
    catch (e) {
      // @ts-ignore
      console.log("ERROR: " + e.message);
    }
  }

  function getSelectedFormula(selectedPair : (string | number)[]) : string {
    return model.getCellFormula(new CellReference(selectedPair[1] as number, selectedPair[0] as string));
  }

  const handleCellClick = (rowNumber : number, columnLetter : string) : void => {
    if (rowNumber > 0 && letterToColumnIndex(columnLetter) > 0) {
      setSelected([columnLetter, rowNumber]);
    }
  }

  return (
      <>
        <Header/>
        <FormulaBox getSelectedFormula={getSelectedFormula}
                    selected={selected}
                    handleFormulaChange={handleFormulaChange}/>
        <Table model={model}
               selected={selected}
               handleCellClick={handleCellClick}/>
      </>
  );
}

export default SpreadsheetController;
