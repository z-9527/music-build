import React from 'react'
import {inject, observer} from 'mobx-react'
import {Switch} from 'react-router-dom'
import {Layout, Dropdown, Icon, Tooltip, Menu} from 'antd'
import {FormattedMessage, injectIntl} from 'react-intl'
import css from './HomePage.module.less'
import SideMenu from '../../../../components/SideMenu'
import history from '../../../../framework/customHistory'
import home from '../../home'
import * as Session from '../../../../framework/utils/Session'

const {Header, Content, Sider, Footer} = Layout

@injectIntl @inject('appStore', 'localeStore') @observer
class HomePage extends React.Component {

    render() {

        const {appStore, localeStore: {locale}} = this.props

        const languageMenu = (
            <Menu onClick={({key}) => this.handleSelectLanguage(key)}>
                <Menu.Item style={{padding: '12px 20px', display: (locale.lang) === '中文' ? "none" : "block"}}
                           key={'zh'}>中文</Menu.Item>
                <Menu.Item style={{padding: '12px 20px', display: (locale.lang) === 'English' ? "none" : "block"}}
                           key={'en'}>English</Menu.Item>
                <Menu.Item style={{padding: '12px 20px', display: (locale.lang) === 'العربية' ? "none" : "block"}}
                           key={'ar'}>العربية</Menu.Item>
                <Menu.Item style={{padding: '12px 20px', display: (locale.lang) === 'español' ? "none" : "block"}}
                           key={'es'}>español</Menu.Item>
                <Menu.Item style={{padding: '12px 20px', display: (locale.lang) === 'русский' ? "none" : "block"}}
                           key={'ru'}>русский</Menu.Item>
            </Menu>
        )

        const userMenu = (
            <Menu>
                <Menu.Item style={{padding: '12px 20px', textAlign: 'center', fontWeight: 'bold'}}>
                    {appStore.userInfo.user.name},<FormattedMessage id={'HomePage.welcome'}/>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item style={{padding: '12px 20px'}}>
                    <div><Icon type="edit"/>&emsp;<FormattedMessage id={'HomePage.password'}/></div>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item style={{padding: '12px 20px'}}>
                    <div onClick={this.logout}><Icon type="poweroff"/>&emsp;<FormattedMessage id={'HomePage.logout'}/>
                    </div>
                </Menu.Item>
            </Menu>
        )

        const sideMenu = [
            {
                id: '1',
                name: <FormattedMessage id={'HomePage.Shopping'}/>,
                icon: 'shopping-cart',
                url: `/home/shoppingCar`,
                leaf: true,
            }
        ]

        return (
            <Layout>
                <Header className={css.header}>
                    <div className={css.logo}>
                        <span><FormattedMessage id={'HomePage.title'}/></span>
                    </div>
                    <div className={css.menu}>
                        <Dropdown overlay={languageMenu}>
                            <span style={{fontSize: 16}}>{this.props.localeStore.locale.lang} <Icon type="down" style={{
                                fontSize: 18,
                                verticalAlign: 'middle'
                            }}/></span>
                        </Dropdown>
                        <Tooltip title={<FormattedMessage id={'HomePage.backend'}/>}>
                            <Icon type={'desktop'} style={{margin: '0 38px'}}
                                  onClick={() => {history.push('/main')}}/>
                        </Tooltip>
                        <Dropdown overlay={userMenu}>
                            <Icon type="user"/>
                        </Dropdown>
                    </div>
                </Header>
                <Layout>
                    <Sider className={css.sider} width={['zh', 'ar'].includes(locale.key) ? 200 : 250}>
                        <SideMenu dataSource={sideMenu}/>
                    </Sider>
                    <Layout>
                        <Content style={{padding: 24}}>
                            <Switch>
                                {home}
                            </Switch>
                        </Content>
                        <Footer style={{textAlign: 'center', marginLeft: -100}}>Copyright @ <FormattedMessage
                            id={'HomePage.Geely'}/> 2018</Footer>
                    </Layout>
                </Layout>
            </Layout>
        )
    }

    //选择语言
    handleSelectLanguage = (key) => {
        this.props.localeStore.changeLocale(key)
    }

    //注销
    logout =  () => {
        Session.logout();
        this.props.history.push('/')
    }
}

export default HomePage