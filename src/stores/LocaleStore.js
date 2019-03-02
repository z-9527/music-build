import { observable, action, runInAction } from 'mobx'
import moment from 'moment'

const project = process.env.REACT_APP_PROJECT_NAME
const zhCN = require(`@/${project}/locales/zh-CN`).default
const enUS = require(`@/${project}/locales/en-US`).default

class LocaleStore {
  @observable locale
  @observable initFromServer

  constructor () {
    this.initFromServer = false
    const lang = navigator.language.split(/-|_/)[0]
    this.changeLocale(lang)
  }

  @action changeLocale = (locale) => {
    this.locale = this._switchLocale(locale)
    moment.locale(locale)
  }

  @action initLocaleInServer = async () => {
    if (!this.initFromServer) {
      // const res = await json.get(`${process.env.REACT_APP_API_URL}/onestep/base/epc/language/get_user_language`)
      const res = {
        status: 1,
        data: {
          language: 'zh'
        }
      }
      runInAction(() => {
        this.locale = this._switchLocale(res.data.language)
        moment.locale(res.data.language)
        this.initFromServer = true
      })
    }
  }

  _switchLocale = (locale) => {
    switch (locale) {
      case 'zh':
        import('moment/locale/zh-cn')
        return zhCN
      case 'en':
        return enUS
      default:
        return zhCN
    }
  }
}

export default new LocaleStore()