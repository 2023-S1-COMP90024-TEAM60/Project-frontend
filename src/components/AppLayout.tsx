import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { ReactNode, useState } from 'react'
import { Breadcrumb, Layout, Menu, MenuProps, theme } from 'antd';
import { useRouter } from 'next/router';
interface Props {
  children?: ReactNode
}
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { label: "Home", key: "/", icon: <PieChartOutlined /> },
  { label: "Page2", key: "/page2", icon: <DesktopOutlined /> },
  { label: "User", key:"A", icon: <DesktopOutlined />, children: [
    { label: "Tom", key: "/page3" },
    { label: "Bill", key: "/page4" },
    { label: "Alex", key: "/page5" },
  ]},
  { label: "Team", key:"B", icon: <TeamOutlined />, children: [
    { label: "Team 1", key: "/page6" },
    { label: "Team 2", key: "/page7" },
  ]},
  { label: "Files", key: "/page8", icon: <FileOutlined /> },
]

export default function AppLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  const selected = "/" + router.pathname.split("/")[1]
  console.log(selected)
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" mode="inline" selectedKeys={[selected]} items={menuItems} onClick={({key}) => {
          if (key) {
            router.push(key)
          }
        }}/>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
}
