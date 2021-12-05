import React, {ReactElement} from 'react';
import styled from "styled-components";
import {ISpreadsheetModel} from "../model/ISpreadsheetModel";
import Cell from "./cell";
import {columnIndexToLetter} from "../util/utils";


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
}



const Row = ({rowNumber, numberOfColumns, rowData, className, selected, handleCellClick} : RowProps) : ReactElement => {
  return (
    <RowContainer className={className}>
      <RowNumber handleCellClick={handleCellClick} text={rowNumber ? rowNumber+"" : ""} selected={selected} rowIndex={rowNumber || 0} columnLetter={""}/>

      {rowData.map((data, index) => {
        return <Cell handleCellClick={handleCellClick} text={data + ""} selected={selected} rowIndex={rowNumber || 0} columnLetter={columnIndexToLetter(index+1)}/>
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
}

const Table = ({model, selected, handleCellClick} : TableProps) : ReactElement => {

    let nums = Array.from({length: model.getNumberOfRows()}, (_, i) => i + 1);
    let cols = Array.from({length: model.getNumberOfColumns()}, (_, i) => i + 1);

     let columnNames = cols.map((num) => {
          return columnIndexToLetter(num);
        });


  function buildRows(selected : (string | number)[]) : ReactElement[] {
    let t = cols.map((num) => {
      return " ";
    });

    return nums.map((num) => {
      return (<Row key={num}
                    rowNumber={num}
                    numberOfColumns={model.getNumberOfColumns()}
                    rowData={t}
                    selected={selected}
                    handleCellClick={handleCellClick}/>);
    });
  }

  return (
      <TableContainer>
       <ColumnHeader numberOfColumns = {model.getNumberOfColumns()}
                     rowData={columnNames}
                     selected={selected}
                     handleCellClick={handleCellClick}/>
        {buildRows(selected)}
      </TableContainer>
  );
}

export default Table;


