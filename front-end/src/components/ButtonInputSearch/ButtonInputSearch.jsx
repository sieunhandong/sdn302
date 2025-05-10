import { Button } from 'antd'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const { size,
        placeholder,
        textButton,
        bordered,
        backgroundColorInput = "#fff",
        backgroundColorButton = "rgb(13,92,182)",
        colorButton = '#fff'
    } = props
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <InputComponent size={size}
                placeholder={placeholder}
                bordered={false}
                style={{
                    backgroundColor: backgroundColorInput,
                    borderRadius: '0px'
                }} />

            <ButtonComponent size={size}
                bordered={false}
                styleButton={{
                    border: !bordered && 'none',
                    borderRadius: '0px',
                    background: backgroundColorButton,
                    color: colorButton
                }}
                icon={<SearchOutlined style={{ color: colorButton }} />}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
            />
        </div>
    )
}

export default ButtonInputSearch