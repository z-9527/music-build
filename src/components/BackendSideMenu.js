import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import {inject} from "mobx-react/index";

const {Item, SubMenu} = Menu

@withRouter @inject('backendStore')
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
            <div onClick={()=>this.add(item)} style={{display: 'inline-block'}}>{item.icon && <Icon type={item.icon}/>}<span>{item.name}</span></div>
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

    add = (item)=>{
        this.props.backendStore.addTabPane(item)
    }

}

export default SideMenu