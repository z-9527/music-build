import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import { Link, withRouter } from 'react-router-dom'

const {Item, SubMenu} = Menu

@withRouter
class SideMenu extends Component {

  static defaultProps = {
    theme: 'dark',
    dataSource: [],
  }

  render () {
    return (
      <Menu
        onOpenChange={this.onOpenChange}
        theme={this.props.theme}
        mode='inline'>
        {
          this._createMenuItem(this.props.dataSource)
        }
      </Menu>
    )
  }

  _createMenuItem = (arr) => {
    return arr.map(item => {
      if (item.leaf) {
        return (
          <Item key={`${item.id}`}>
            <Link to={item.url} style={{display: 'inline-block'}}>
              {item.icon && <Icon type={item.icon}/>}
              <span>{item.name}</span>
            </Link>
          </Item>
        )
      } else {
        return (
          <SubMenu key={`${item.id}`} title={<span>{item.icon && <Icon type={item.icon}/>}<span>{item.name}</span></span>}>
            {this._createMenuItem(item.children)}
          </SubMenu>
        )
      }
    })
  }
}

export default SideMenu