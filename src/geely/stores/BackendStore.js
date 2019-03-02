import {observable, action, runInAction} from 'mobx'
import {json} from '../../framework/utils/ajax'
import {notification} from 'antd'
import {setStore} from "../../framework/utils/OnestepUtils";

const backendTabs = require(`../routers/backend`).default
const project = process.env.REACT_APP_PROJECT_NAME
const config = require(`@/${project}/config`).default
console.log(config, 'config')

class BackendStore {
    // top
    @observable loading

    // side
    @observable collapsed
    @observable leftMenu
    @observable leftMenuMode
    @observable panes         //标签页
    @observable activeKey     //当前活动的标签页

    constructor() {
        this.loading = false
        this.collapsed = false
        this.leftMenu = []
        this.leftMenuMode = 'inline'
        this.panes = []
        this.activeKey = ''
    }

    @action
    setStore = (obj) => {
        setStore(obj, this)
    }

    @action collapse = () => {
        this.collapsed = !this.collapsed
        this.leftMenuMode = this.collapsed ? 'vertical' : 'inline'
    }

    @action initSideMenu = async (platformId) => {
        this.loading = true
        try {
            const res = await json.get(`${config.apiUrl}/Menu/platformId/${platformId}`)
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

    /**
     * 添加标签页
     */
    @action
    addTabPane = (item) => {
        const panes = this.panes;
        const activeKey = item.name;
        const test = item.url.split('/').pop()
        console.log(test)
        //如果标签页不存在就添加一个标签页
        if (!panes.find(i => i.key === activeKey)) {
            if (panes.length > 7) {
                panes.shift()
            }
            panes.push({title: item.name, content: backendTabs[test] || item.name, key: activeKey});
        }
        this.panes = panes
        this.activeKey = activeKey
    }
    /**
     * 移除标签页
     */
    @action
    removePane = (targetKey) => {
        let activeKey = this.activeKey;
        let lastIndex;
        this.panes.find((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
            return pane.key === targetKey         //提前结束遍历
        });
        const panes = this.panes.filter(pane => pane.key !== targetKey);

        if (activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                panes[0] && (activeKey = panes[0].key)
            }
        }
        this.panes = panes
        this.activeKey = activeKey
    }


}

export default new BackendStore()