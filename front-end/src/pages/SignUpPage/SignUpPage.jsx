import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import login from '../../assets/images/login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutatioHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setComfirmPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);


    const mutation = useMutatioHooks(
        data => UserService.signUpUser(data)
    )

    const { data, isLoading, isError, isSuccess } = mutation
    console.log('data', mutation)
    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleNavigateSignIn()
        } else if (isError) {
            // Lưu thông báo lỗi từ backend
            setErrorMessage(data?.message || "Account creation failed.");
        }
    }, [isSuccess, isError, data])

    const handleOnchangeEmail = (value) => {
        setEmail(value)
        setErrorMessage(null);
    }
    const handleOnchangePassword = (value) => {
        setPassword(value)
        setErrorMessage(null);
    }

    const handleOnchangeConfirmPassword = (value) => {
        setComfirmPassword(value)
        setErrorMessage(null);
    }

    const handleSignUp = () => {
        setErrorMessage(null);
        setIsSigningIn(true); // Chỉ bật isLoading khi bấm nút đăng nhập
        mutation.mutate(
            { email, password, confirmPassword },
            {
                onSettled: () => {
                    setIsSigningIn(false); // Khi xong thì tắt loading
                },
            }
        );
        console.log('sign-up', email, password, confirmPassword);
    };
    const navigate = useNavigate();
    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }


    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1>Hello</h1>
                    <p>Sign In and Sign Up</p>
                    {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}

                    <InputFormComponent style={{ marginBottom: '10px' }} placeholder="abc@gmail.com"
                        value={email} onChange={handleOnchangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px'
                            }}>{
                                isShowPassword ? (
                                    <EyeFilled />
                                ) : (
                                    <EyeInvisibleFilled />
                                )
                            }

                        </span>
                        <InputFormComponent style={{ marginBottom: '10px' }} placeholder="password" type={isShowPassword ? "text" : "password"}
                            value={password} onChange={handleOnchangePassword} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}

                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px'
                            }}>{
                                isShowConfirmPassword ? (
                                    <EyeFilled />
                                ) : (
                                    <EyeInvisibleFilled />
                                )
                            }

                        </span>
                        <InputFormComponent style={{ marginBottom: '10px' }} placeholder="confirm password" type={isShowConfirmPassword ? "text" : "password"}
                            value={confirmPassword} onChange={handleOnchangeConfirmPassword} />
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isSigningIn}>
                        <ButtonComponent
                            disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px'
                            }}
                            textButton={'Đăng ký'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                    <p>Do you have an account? <WrapperTextLight onClick={handleNavigateSignIn} style={{ cursor: 'pointer' }}>Sign In</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={login} preview={false} alt="image-logo" height="203px" width="203px" />
                    <h4>Find a job at IM</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignUpPage