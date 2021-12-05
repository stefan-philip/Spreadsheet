import React, {ReactElement} from 'react';
import styled from "styled-components";
import {Button} from "antd";

const TextBox = styled.input`
  margin-left: 20px;
  background-color: white;
  height: 18px;
  font-size: 15px;
  width: calc(100% - 100px);

`
const MenuButton = styled(Button)`
  margin-right: 1px;
  font-size: 18px;
 
  background-color: rgba(0, 0, 0, .2);
  border-width: 0px;
  
  :hover {
    background-color: rgba(0, 0, 0, .05);
  }
`

const FormulaBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const FormulaBox = () : ReactElement => {
  return (
      <FormulaBoxContainer>

        <TextBox type={'text'}/>
        <MenuButton>Enter</MenuButton>

      </FormulaBoxContainer>
  );
}

export default FormulaBox;


