import React, {ReactElement} from 'react';
import styled from "styled-components";

const CellContainer = styled.div`
  width: 60px;
  height: 20px;
  font-size: 13px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, .05);
  text-align: center;
  background-color: white;
  overflow: hidden;
`


const SelectedCellContainer = styled.div`
  width: 60px;
  height: 20px;
  font-size: 13px;
  border-width: 1px;
  border-style: solid;
  border-color: #3373de;
  text-align: center;
  background-color: white;
  overflow: hidden;
`

const CellText = styled.p`
  margin: 0;
`

interface CellProps {
  text: string;
  className? : string;
  selected: (string | number)[];
  rowIndex: number;
  columnLetter : string;
  handleCellClick : (rowIndex : number, columnLetter : string) => void;
}

const Cell = ({text, className, selected, rowIndex, columnLetter, handleCellClick} : CellProps) : ReactElement => {
  const isSelected = selected[1] === rowIndex && selected[0] === columnLetter;
  return (
        isSelected ?
          <SelectedCellContainer onClick={() => handleCellClick(rowIndex || 0, columnLetter)} className={className}>
            <CellText>{text}</CellText>
          </SelectedCellContainer>
            :
            <CellContainer onClick={() => handleCellClick(rowIndex || 0, columnLetter)} className={className}>
              <CellText>{text}</CellText>
            </CellContainer>

  );
}

export default Cell;


