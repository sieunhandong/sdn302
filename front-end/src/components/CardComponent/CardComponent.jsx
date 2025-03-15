import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo1.png'

const CardComponent = ({ name, mentor, image, description, start, end, onClick }) => {
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
            <WrapperReportText>Mentor: {mentor || "Chưa có thông tin"}</WrapperReportText>
            <WrapperReportText>Thời gian bat dau: {start}</WrapperReportText>
        </WrapperCardStyle>

    )
}

export default CardComponent