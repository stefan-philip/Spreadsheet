import React, {ReactElement} from 'react';
import styled from "styled-components";
import {Button} from "antd";

const HeaderContainer = styled.div`

  width: 100%;
  background-color: #f5f5f5;
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


const Header = () : ReactElement => {
  return (
      <HeaderContainer>
        <h3>Spreadsheet</h3>
        <ButtonContainer>
          <MenuButton>Clear Cell</MenuButton>
          <MenuButton>Cell Background</MenuButton>
          <MenuButton>Add Row</MenuButton>
          <MenuButton>Add Column</MenuButton>
          <MenuButton>Remove Row</MenuButton>
          <MenuButton>Remove Column</MenuButton>
        </ButtonContainer>
      </HeaderContainer>
  );
}

export default Header;


