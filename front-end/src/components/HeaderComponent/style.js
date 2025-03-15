import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  background-color: rgb(26, 148, 255);
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  width: 1270px;
  padding: 10px 0;
`;

export const WrapperTextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: center
`;
export const WrapperHeaderAccount = styled.span`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
`;
export const WrapperTextHeaderSmall = styled.span`
font-size: 12px;
color: #fff;
`
export const WrapperContentPopup = styled.p`
  cursor: pointer;
  &:hover {
    background: rgb(26,148,255);
    color: #ffff;
  } 
`