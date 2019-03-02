import { observable, action, runInAction } from 'mobx'
import { json } from '../../framework/utils/ajax'
import { notification } from 'antd'
import * as Session from '../../framework/utils/Session'
import history from '../../framework/customHistory'

const project = process.env.REACT_APP_PROJECT_NAME
const config=require(`@/${project}/config`).default
console.log(config,'config')

class BackendStore {
  // top
  @observable loading

  // side
  @observable collapsed
  @observable leftMenu
  @observable leftMenuMode

  constructor () {
    this.loading = false
    this.collapsed = false
    this.leftMenu = []
    this.leftMenuMode = 'inline'
  }

  @action collapse = () => {
    this.collapsed = !this.collapsed
    this.leftMenuMode = this.collapsed ? 'vertical' : 'inline'
  }

  @action initSideMenu = async (platformId) => {
    this.loading = true
    try {
      const res = await json.get(`${config.apiUrl}/Menu/platformId/${platformId}`)
        console.log(res,12121)
      if (res.status === 0) {
        notification.error({message: res.code, description: res.msg})
      } else {
        runInAction(() => {
          this.leftMenu = res.data
        })
      }
      runInAction(() => {
        this.loading = false
      })
    } catch (err) {
      notification.error({
        message: 'error',
        description: err.message
      })
    }
  }


}

export default new BackendStore()