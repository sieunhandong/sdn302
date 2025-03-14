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
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mutation = useMutatioHooks(
        data => UserService.loginUser(data)

    )
    console.log("mutation", mutation)
    const { data, isLoading, isError, isSuccess } = mutation

    useEffect(() => {
        if (isSuccess) {
            navigate('/');
            localStorage.setItem('access_token', JSON.stringify(data?.data?.access_token));
            localStorage.setItem('refresh_token', JSON.stringify(data?.data?.refresh_token));

            const accessToken = data?.data?.access_token;
            if (accessToken) {
                const decoded = jwtDecode(accessToken);
                console.log("🔹 Token decoded:", decoded);
                if (decoded?.payload?.id) {
                    console.log("🔹 Gọi handleGetDetailsUser với ID:", decoded.payload.id);
                    handleGetDetailsUser(decoded.payload.id, accessToken);
                }
            }
        }
    }, [isSuccess]);



    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);

        console.log("✅ Toàn bộ Response từ API:", res);
        console.log("🎯 res.data:", res?.data);
        if (res?.data) {
            dispatch(updateUser({ ...res?.data, access_token: token }));
        }
    };


    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangePassword = (value) => {
        setPassword(value)
    }
    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }
    const handleSignin = () => {
        setIsSigningIn(true);

        console.log("Gửi yêu cầu đăng nhập với:", { email, password });

        mutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    console.log("Dữ liệu trả về từ API:", data);
                },
                onError: (error) => {
                    console.error("Lỗi từ API:", error);
                },
                onSettled: () => {
                    setIsSigningIn(false);
                },
            }
        );
    };


    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1>Xin chao</h1>
                    <p>Dang nhap va tao tai khoan</p>
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
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isSigningIn}>

                        <ButtonComponent
                            disabled={!email.length || !password.length}
                            onClick={handleSignin}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px'
                            }}
                            textButton={'Dang nhap'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                    <p><WrapperTextLight>Quen mat khau</WrapperTextLight></p>
                    <p>Chua co tai khoan ? <WrapperTextLight onClick={handleNavigateSignUp}>Tao tai khoan</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={login} preview={false} alt="image-logo" height="203px" width="203px" />
                    <h4>Mua sam tai MiHoo</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage