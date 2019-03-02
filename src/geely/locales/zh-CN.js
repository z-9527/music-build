import antd from 'antd/lib/locale-provider/zh_CN'
import appLocaleData from 'react-intl/locale-data/zh'
import messages from './zh-CN.message'

export default {
  messages: {
    ...messages,
  },
  antd: antd,
  locale: 'zh-CN',
  data: appLocaleData,
  lang:'中文',
  key: 'zh',
}