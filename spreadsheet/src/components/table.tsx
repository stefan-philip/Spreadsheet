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
}



const Row = ({rowNumber, numberOfColumns, rowData, className} : RowProps) : ReactElement => {
  return (
    <RowContainer className={className}>
      <RowNumber text={rowNumber ? rowNumber+"" : ""}/>

      {rowData.map(data => {
        return <Cell text={data + ""}/>
       })}
    </RowContainer>

  );
}

const ColumnHeader = styled(Row)`
  background-color: rgba(0, 0, 0, .2);

  > div {
      background-color: rgba(0, 0, 0, .2);
    }
`

interface TableProps {
  model : ISpreadsheetModel;
}

const Table = ({model} : TableProps) : ReactElement => {

    let nums = Array.from({length: model.getNumberOfRows()}, (_, i) => i + 1);

     let columnNames = nums.map((num) => {
          return columnIndexToLetter(num);
        });


  function buildRows() : ReactElement[] {
    let t = nums.map((num) => {
      return " ";
    });

    return nums.map((num) => {
      return (<Row key={num}
                    rowNumber={num}
                    numberOfColumns={model.getNumberOfColumns()}
                    rowData={t}/>);
    });
  }

  return (
      <TableContainer>
       <ColumnHeader numberOfColumns = {model.getNumberOfColumns()}
                     rowData={columnNames}/>
        {buildRows()}
      </TableContainer>
  );
}

export default Table;


