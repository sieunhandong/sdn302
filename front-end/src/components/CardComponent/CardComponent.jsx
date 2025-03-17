import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { useSelector } from "react-redux";
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo1.png'

const CardComponent = ({ name, mentor, image, description, start, end, onClick }) => {
    const role = useSelector((state) => state.user?.role);
    return (
        <WrapperCardStyle
            hoverable
            onClick={onClick}
            styles={{
                root: { width: '200px' },
                head: { backgroundColor: '#f0f2f5', height: '200px' }, // Thay vì dùng headStyle
                body: { padding: '10px' }
            }}
            cover={<img alt="Project" src={image || "https://via.placeholder.com/200"} />}
        >
            <StyleNameProduct>{name}</StyleNameProduct>
            {role !== "MENTOR" && (
            <WrapperReportText>Mentor: {mentor || "No information yet"}</WrapperReportText>
            )}
            <WrapperReportText>Start Date: {start}</WrapperReportText>
            <WrapperReportText>End Date: {end}</WrapperReportText>
        </WrapperCardStyle>

    )
}

export default CardComponent