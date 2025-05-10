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
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Thêm state lưu lỗi từ backend

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mutation = useMutatioHooks(
        data => UserService.loginUser(data)
    );

    console.log("mutation", mutation)
    const { data, isLoading, isError, isSuccess } = mutation

    useEffect(() => {
        if (isSuccess) {
            navigate('/');
            localStorage.setItem('access_token', JSON.stringify(data?.data?.access_token));
            // localStorage.setItem('refresh_token', JSON.stringify(data?.data?.refresh_token));

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

        // console.log("✅ Toàn bộ Response từ API:", res);
        // console.log("🎯 res.data:", res?.data);
        if (res?.data) {
            dispatch(updateUser({ ...res?.data, access_token: token }));
        }
    };

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangePassword = (value) => {
        setPassword(value);
    };
    const handleNavigateSignUp = () => {
        navigate('/sign-up');
    };

    const handleSignin = () => {
        setIsSigningIn(true);
        setErrorMessage(""); // Reset lỗi trước khi gửi yêu cầu mới

        console.log("Gửi yêu cầu đăng nhập với:", { email, password });

        mutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    console.log("Dữ liệu trả về từ API:", data);
                },
                onError: (error) => {
                    console.error("Lỗi từ API:", error);

                    // Nếu có phản hồi từ API
                    if (error.response) {
                        setErrorMessage(error.response.data.message || "Đăng nhập thất bại!");
                    } else {
                        setErrorMessage("Lỗi kết nối! Vui lòng thử lại.");
                    }
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
                    <h1>Hello</h1>
                    <p>Sign In and Sign Up</p>
                    <InputFormComponent style={{ marginBottom: '10px' }} placeholder="abc@gmail.com"
                        value={email} onChange={handleOnchangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px',
                                cursor: 'pointer'
                            }}>
                            {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <InputFormComponent style={{ marginBottom: '10px' }} placeholder="Password" type={isShowPassword ? "text" : "password"}
                            value={password} onChange={handleOnchangePassword} />
                    </div>

                    {/*Hiển thị lỗi từ API */}
                    {errorMessage && <span style={{ color: 'red', marginBottom: '10px', display: 'block' }}>{errorMessage}</span>}

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
                            textButton={'Sign In'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        />
                    </Loading>

                    <p><WrapperTextLight>Forgot Password?</WrapperTextLight></p>
                    <p>Don't have an account? <WrapperTextLight onClick={handleNavigateSignUp}>Sign Up</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={login} preview={false} alt="image-logo" height="203px" width="203px" />
                    <h4>Find a job at IM</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage;
