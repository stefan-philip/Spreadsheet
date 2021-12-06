import React, {ReactElement} from 'react';
import styled from "styled-components";
import {Color} from "../model/CellStyle";

const CellContainer = styled.div`
  width: 60px;
  height: 20px;
  font-size: 13px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, .05);
  text-align: center;
  background-color: ${({ colorRGB } : CellProps2) => "rgb(" + colorRGB.r + "," + colorRGB.g + ", " + colorRGB.b + ")"};  overflow: hidden;
`


const SelectedCellContainer = styled.div`
  width: 60px;
  height: 20px;
  font-size: 13px;
  border-width: 1px;
  border-style: solid;
  border-color: #3373de;
  text-align: center;
  background-color: ${({ colorRGB } : CellProps2) => "rgb(" + colorRGB.r + "," + colorRGB.g + ", " + colorRGB.b + ")"};
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
  color : Color;
}

interface CellProps2 {
  colorRGB : { r:number, g:number, b:number }
}

const Cell = ({text, className, selected, rowIndex, columnLetter, handleCellClick, color} : CellProps) : ReactElement => {
  const isSelected = selected[1] === rowIndex && selected[0] === columnLetter;
  return (
        isSelected ?
          <SelectedCellContainer
              colorRGB={{r: color.getRed(), g: color.getGreen(), b: color.getBlue()}}
              onClick={() => handleCellClick(rowIndex || 0, columnLetter)}
              className={className}>
            <CellText>{text}</CellText>
          </SelectedCellContainer>
            :
            <CellContainer
                colorRGB={{r: color.getRed(), g: color.getGreen(), b: color.getBlue()}}
                onClick={() => handleCellClick(rowIndex || 0, columnLetter)}
                className={className}>
              <CellText>{text}</CellText>
            </CellContainer>

  );
}

export default Cell;


