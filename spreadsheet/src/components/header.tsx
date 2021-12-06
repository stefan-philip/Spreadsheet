import React, {ReactElement, useState} from 'react';
import styled from "styled-components";
import {Button, Modal} from "antd";
import { RgbColorPicker } from "react-colorful";
import {RGBColor} from "../model/CellStyle";

const HeaderContainer = styled.div`

  width: 100%;
  background-color: #e8ffec;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`
const ButtonContainer = styled.div`
  
  display: flex;
  flex-direction: row;
  
`

const MenuButton = styled(Button)`
  margin-right: 1px;
  font-size: 18px;
 
  background-color: rgba(255, 255, 255, 0);
  border-width: 0px;
  
  :hover {
    background-color: rgba(0, 0, 0, .2);
  }
`

const Title = styled.h2`
  margin-top: 10px;
  margin-left: 12px;
`

interface HeaderProps {
  handleClickExport: () => void;
  handleClickClearCell: () => void;
  handleClickCellBackground: (color : {r:number,g:number,b:number}) => void;
  handleClickAddRow: () => void;
  handleClickAddColumn: () => void;
  handleClickRemoveRow: () => void;
  handleClickRemoveColumn: () => void;

}

const Header = ({handleClickExport,
                  handleClickClearCell,
                  handleClickCellBackground,
                  handleClickAddRow,
                  handleClickAddColumn,
                  handleClickRemoveRow,
                  handleClickRemoveColumn} : HeaderProps) : ReactElement => {

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState({r: 255, g:255, b:255});

  const handleOk = () => {
    setShowColorPicker(false);
    handleClickCellBackground(color);
  }

  return (
      <HeaderContainer>
        <Modal title="Basic Modal" visible={showColorPicker} onOk={handleOk} onCancel={() => setShowColorPicker(false)}>
          <RgbColorPicker onChange={setColor}/>
        </Modal>
        <Title>Spreadsheet</Title>
        <ButtonContainer>
          <MenuButton onClick={handleClickExport}>Export</MenuButton>
          <MenuButton onClick={handleClickClearCell}>Clear Cell</MenuButton>
          <MenuButton onClick={() => setShowColorPicker(true)}>Cell Background</MenuButton>
          <MenuButton onClick={handleClickAddRow}>Add Row</MenuButton>
          <MenuButton onClick={handleClickAddColumn}>Add Column</MenuButton>
          <MenuButton onClick={handleClickRemoveRow}>Remove Row</MenuButton>
          <MenuButton onClick={handleClickRemoveColumn}>Remove Column</MenuButton>
        </ButtonContainer>
      </HeaderContainer>
  );
}

export default Header;


