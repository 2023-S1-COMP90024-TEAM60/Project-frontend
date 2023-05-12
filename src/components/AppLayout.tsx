import {
  RobotOutlined,
  SmileOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { ReactNode, useState } from 'react'
import { Breadcrumb, Layout, Menu, MenuProps, theme } from 'antd';
import { useRouter } from 'next/router';
import { useBreadcrumbPath } from '@/utils/hooks/useBreadcrumbPath';
interface Props {
  children?: ReactNode
}
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { label: "AI", key: "/ai", icon: <RobotOutlined />, children: [
    { label: "Map", key: "/ai/map" },
    { label: "Charts", key: "/ai/charts" },
  ] },
  { label: "Covid-19", key: "/covid19", icon: <TeamOutlined /> },
  { label: "Entertainment", key:"entertainment", icon: <TrophyOutlined />, children: [
    { label: "Esports", key: "/entertainment/esports" },
    { label: "Kpop", key: "/entertainment/kpop" },
  ]},
  { label: "Sentiment", key: "/sentiment", icon: <SmileOutlined />, children: [
    { label: "Map", key: "/sentiment/map" },
    { label: "Charts", key: "/sentiment/charts" },
  ] },
]

export default function AppLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const selected = router.pathname
  const breadcrumbItems = useBreadcrumbPath();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems}/>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
}
