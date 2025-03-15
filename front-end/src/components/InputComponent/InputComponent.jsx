import { Input } from 'antd'
import React from 'react'

const InputComponent = ({ size, placeholder, variant, style, ...rests }) => {
    return (
        <div>

            <Input size={size}
                placeholder={placeholder}
                variant={variant}
                style={style}
                {...rests}
            />
        </div>
    )
}

export default InputComponent