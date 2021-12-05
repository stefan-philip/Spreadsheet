import React, {ReactElement, useEffect, useState} from 'react';
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

interface FormulaBoxProps {
  handleFormulaChange: (newFormula : string) => void;
  selected : (string | number)[];
  getSelectedFormula(selectedPair : (string | number)[]) : string
}

const FormulaBox = ({handleFormulaChange, getSelectedFormula, selected} : FormulaBoxProps) : ReactElement => {

  let [formula, setFormula] = useState(getSelectedFormula(selected));
  let [lastSelected, setLastSelected] = useState(["A", 1]);

  useEffect(() => {
    if (selected !== lastSelected) {
      setLastSelected(selected);
      setFormula(getSelectedFormula(selected));
    }
  }, [selected])

  return (

      <FormulaBoxContainer>
        <TextBox onChange={(event) => {setFormula(event.target.value)}}
                       type={'text'}
                       value={
                         lastSelected === selected ? formula : getSelectedFormula(selected)}/>

        <MenuButton onClick={()=>handleFormulaChange(formula)}>Enter</MenuButton>

      </FormulaBoxContainer>
  );
}

export default FormulaBox;


