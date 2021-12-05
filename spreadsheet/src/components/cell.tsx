import React, {ReactElement} from 'react';
import styled from "styled-components";

const CellContainer = styled.div`
  width: 60px;
  height: 20px;
  font-size: 13px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, .1);
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
}

const Cell = ({text, className} : CellProps) : ReactElement => {
  return (
      <CellContainer className={className}>
        <CellText>{text}</CellText>
      </CellContainer>
  );
}

export default Cell;


