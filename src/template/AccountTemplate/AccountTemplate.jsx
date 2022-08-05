import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import PageLoading from "components/Loading/PageLoading";
import { logout } from "redux/slices/authSlice";
import { getAccountInfo, resetAccountReducer } from "redux/slices/accountSlice";

const { Header, Content, Footer, Sider } = Layout;

const AccountTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accountInfo, isUpdateSuccess, isLoading, error } = useSelector((state) => state.account);

  useEffect(() => {
    dispatch(getAccountInfo());
  }, []);

  useEffect(() => {
    if (isUpdateSuccess === true) {
      notification["success"]({ message: "Cập nhật thông tin thành công" });
      dispatch(resetAccountReducer());
      dispatch(getAccountInfo());
    } else if (isUpdateSuccess === false) {
      notification["error"]({ message: "Cập nhật thông tin không thành công" });
      dispatch(resetAccountReducer());
    }
  }, [isUpdateSuccess]);

  const getMenuItem = (key, label, path, children) => {
    return {
      key,
      label,
      path,
      children,
    };
  };

  const userMenuItems = [
    getMenuItem("1", "Thông tin", "/user/profile"),
    getMenuItem("2", "Lịch sử đặt vé", "/user/tickets-history"),
  ];

  const adminMenuItems = [
    getMenuItem("1", "Thông tin", "/admin/profile"),
    getMenuItem("2", "Lịch sử đặt vé", "/admin/tickets-history"),
    getMenuItem("3", "Quản lý Films", "", [
      getMenuItem("3-1", "Danh sách Film", "/admin/films/film-list"),
      getMenuItem("3-2", "Thêm Film", "/admin/films/add-film"),
    ]),
    getMenuItem("4", "Quản lý Users", "", [
      getMenuItem("4-2", "Danh sách User", "/admin/user-management/user-list"),
      getMenuItem("4-1", "Thêm User", "/admin/user-management/add-user"),
    ]),
  ];

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="flex my-2 justify-center items-center">
          <img src="../icon-tixjpg.jpg" width={40} alt="" />
          <p className="text-gray-100 m-0 font-bold text-lg mx-2">Trang cá nhân</p>
        </div>
        <div className="mt-10 bg-slate-300">
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" defaultOpenKeys={["1", "2", "3"]}>
            {accountInfo.maLoaiNguoiDung === "KhachHang"
              ? userMenuItems.map((menuItem) => {
                  return (
                    <Menu.Item key={menuItem.key} onClick={() => navigate(menuItem.path)}>
                      {menuItem.label}
                    </Menu.Item>
                  );
                })
              : accountInfo.maLoaiNguoiDung === "QuanTri"
              ? adminMenuItems.map((menuItem) => {
                  return menuItem.children?.length ? (
                    <Menu.SubMenu title={menuItem.label} key={menuItem.key}>
                      {menuItem.children.map((subItem) => {
                        return (
                          <Menu.Item key={subItem.key} onClick={() => navigate(subItem.path)}>
                            {subItem.label}
                          </Menu.Item>
                        );
                      })}
                    </Menu.SubMenu>
                  ) : (
                    <Menu.Item key={menuItem.key} onClick={() => navigate(menuItem.path)}>
                      {menuItem.label}
                    </Menu.Item>
                  );
                })
              : null}
          </Menu>
        </div>
      </Sider>
      <Layout className="min-h-screen">
        <Header className="bg-slate-200">
          <div className="flex justify-end items-center h-full">
            <div className="flex items-center">
              <Button type="primary" className="mx-3" onClick={() => navigate("/")}>
                Về trang chủ
              </Button>
              <Button type="danger" className="mx-3" onClick={() => dispatch(logout())}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </Header>
        <Content className="pl-10 lg:px-5 border border-slate-300 h-full">
          {isLoading ? <PageLoading classname={"min-h-full"} /> : <Outlet />}
        </Content>
        {/* <Footer>@ 2022 TIX</Footer> */}
      </Layout>
    </Layout>
  );
};

export default AccountTemplate;
