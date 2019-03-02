import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import { Col, Icon, Layout, Menu, Row, Spin } from 'antd'
import backend from '../../routers/backend'
import styles from './Backend.module.less'
import SideMenu from '../../../components/SideMenu'

const {Header, Content, Sider} = Layout
const {SubMenu, Item} = Menu
const project = process.env.REACT_APP_PROJECT_NAME
const config=require(`@/${project}/config`).default

@inject('appStore', 'backendStore') @withRouter @observer
class Backend extends Component {

  async componentDidMount () {
    const {backendStore} = this.props
    await backendStore.initSideMenu(config.REACT_APP_COMPANY.backend)
  }

  render () {
    const {appStore, backendStore} = this.props

    return (
      <Spin spinning={backendStore.loading}>
        <Layout className={styles.contains}>
          <Sider width={250} collapsible collapsed={backendStore.collapsed} onCollapse={() => backendStore.collapse()}>
           <SideMenu dataSource={this.props.backendStore.leftMenu}/>
          </Sider>
          <Layout>
            <Header className={styles.header}>
              <Row>
                <Col span={1}>
                <span className={styles.icon}>
                  <Icon
                    className={styles.trigger}
                    type={backendStore.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={() => backendStore.collapse()}
                  />
                </span>
                </Col>
                <Col span={19}>
                  <Menu mode="horizontal">
                    <Menu.Item key="mail">
                      {/*<img alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style={{height: 30, width: 30}}/>*/}
                    </Menu.Item>
                  </Menu>
                </Col>
                <Col span={4}>
                  <Menu className={styles.menu} mode="horizontal">
                    <SubMenu style={{float: 'right'}} title={<span><Icon type="user"/>{appStore.userInfo.name}</span>}>
                      <Menu.Item key="userInfo">
                        <Link to={'/home'}><Icon type="home"/>进入前台</Link>
                      </Menu.Item>
                      <Menu.Divider/>
                      <Menu.Item key="logout">
                        <span onClick={() => backendStore.logout()}><Icon type="logout"/>注销</span>
                      </Menu.Item>
                    </SubMenu>
                  </Menu>
                </Col>
              </Row>
            </Header>
            <Content style={{height: '100%'}}>
              {backend}
            </Content>
          </Layout>
        </Layout>
      </Spin>
    )
  }

}

export default Backend