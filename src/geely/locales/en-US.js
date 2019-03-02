import antd from 'antd/lib/locale-provider/en_US'
import appLocaleData from 'react-intl/locale-data/en'
import messages from './en-US.message'

export default {
  messages: {
    ...messages,
  },
  antd: antd,
  locale: 'en-US',
  data: appLocaleData,
  lang:'English',
  key: 'en',
}