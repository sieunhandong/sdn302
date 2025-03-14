import React, { useState } from 'react';
import { Badge, Button, Col, Popover } from 'antd';
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import Search from 'antd/es/transfer/search';
import { CaretDownOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';
import MenuComponent from '../MenuComponent/MenuComponent';

function HeaderComponent() {

  const user = useSelector((state) => state.user)
  console.log('user', user)
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State mở menu
  const navigate = useNavigate();

  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    setloading(true)
    // Xóa token khỏi frontend
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    await UserService.logoutUser()
    dispatch(resetUser())
    setloading(false)

  }

  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}>Dang xuat</WrapperContentPopup>
      <WrapperContentPopup>Thong tin nguoi dung</WrapperContentPopup>
    </div>
  )

  return (
    <div style={{ width: '100%', background: 'rgb(26,148,255)', display: 'flex', justifyContent: 'center' }}>
      <WrapperHeader>
        <Col span={5}>
          {/* Nút mở menu */}
          <Button type="text" icon={<MenuOutlined />} onClick={() => setIsMenuOpen(true)} />
          <WrapperTextHeader>IM</WrapperTextHeader>
        </Col>
        {/* <Col span={13} style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonInputSearch
            size="large"
            textButton="Search"
            placeholder="Input search text"
          // onSearch={onSearch}
          />
        </Col> */}
        <Col span={13} style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
          <Link to="/project" style={{ color: 'white', fontSize: '16px', textDecoration: 'none' }}>
            Recruitment
          </Link>
          <Link to="/notification" style={{ color: 'white', fontSize: '16px', textDecoration: 'none' }}>
            Notification
          </Link>
        </Col>

        <Col span={6} style={{ display: "flex", gap: "20px", alignItems: 'center' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
              <div>
                <UserOutlined style={{ fontSize: '30px' }} />
              </div>
              {user?.first_name ? (
                <>
                  <Popover content={content} trigger="click" >
                    <div style={{ cursor: 'pointer' }}>{user.first_name}</div>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Sign-in/Sign-up</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Account</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}

            </WrapperHeaderAccount>
          </Loading>
        </Col>
      </WrapperHeader>
      {/* Drawer Menu */}
      <MenuComponent isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} role={user?.role} />
    </div>
  );
}

export default HeaderComponent;
