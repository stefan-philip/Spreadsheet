import React, {ReactElement} from 'react';
import styled from "styled-components";
import {ISpreadsheetModel} from "../model/ISpreadsheetModel";
import Cell from "./cell";
import {columnIndexToLetter} from "../util/utils";
import {CellReference} from "../model/CellReference";
import {CellStyle, RGBColor} from "../model/CellStyle";


const TableContainer = styled.div`
  width: max-content;
  display: flex;
  flex-direction: column;
  margin-bottom: 1px;
  margin-left: 20px;
`

const RowContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`

const RowNumber = styled(Cell)`
  width: 30px;
  background-color: rgba(0, 0, 0, .2);
`

interface RowProps {
  rowNumber? : number;
  numberOfColumns : number;
  rowData : string[] | number[];
  className?: string;
  selected: (string | number)[];
  handleCellClick: (rowNumber : number, columnLetter : string) => void;
  getCellStyle : (rowNumber : number, columnLetter : string) => CellStyle;
}



const Row = ({rowNumber, numberOfColumns, rowData, className, selected, handleCellClick, getCellStyle} : RowProps) : ReactElement => {
  return (
      <RowContainer className={className}>
        <RowNumber color={new RGBColor(255, 255, 255)} handleCellClick={handleCellClick} text={rowNumber ? rowNumber+"" : ""} selected={selected} rowIndex={rowNumber || 0} columnLetter={""}/>

        {rowData.map((data, index) => {
          let cellStyle : CellStyle = getCellStyle(rowNumber ? rowNumber : 1, columnIndexToLetter(index+1));
          return <Cell color={cellStyle.getBackgroundColor()} handleCellClick={handleCellClick} text={data + ""} selected={selected} rowIndex={rowNumber || 0} columnLetter={columnIndexToLetter(index+1)}/>
        })}
      </RowContainer>

  );
}

const ColumnHeader = styled(Row)`
  background-color: rgba(0, 0, 0, .2);
  margin-top: 10px;
  > div {
      background-color: rgba(0, 0, 0, .2);
    }
`

interface TableProps {
  model : ISpreadsheetModel;
  selected : (string | number)[];
  handleCellClick: (rowNumber : number, columnLetter : string) => void;
  numTimesEnterHit : number;
  getCellStyle : (rowNumber : number, columnLetter : string) => CellStyle;
}

const Table = ({model, selected, handleCellClick, numTimesEnterHit, getCellStyle} : TableProps) : ReactElement => {

  let nums = Array.from({length: model.getNumberOfRows()}, (_, i) => i + 1);
  let cols = Array.from({length: model.getNumberOfColumns()}, (_, i) => i + 1);

  let columnNames = cols.map((num) => {
    return columnIndexToLetter(num);
  });


  function buildRows(selected : (string | number)[]) : ReactElement[] {
    return nums.map((num) => {

      let data = cols.map((columnNumber) => {
        return model.getCellValue(new CellReference(num, columnIndexToLetter(columnNumber)));
      });

      return (<Row key={num}
                   rowNumber={num}
                   numberOfColumns={model.getNumberOfColumns()}
                   rowData={data}
                   selected={selected}
                   handleCellClick={handleCellClick}
                   getCellStyle={getCellStyle}/>);
    });
  }

  return (
      <TableContainer>
        <ColumnHeader numberOfColumns = {model.getNumberOfColumns()}
                      rowData={columnNames}
                      selected={selected}
                      handleCellClick={handleCellClick}
                      getCellStyle={getCellStyle}/>
        {buildRows(selected)}
      </TableContainer>
  );
}

export default Table;


