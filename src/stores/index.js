import localeStore from './LocaleStore'
const stores = require(`../${process.env.REACT_APP_PROJECT_NAME}/stores`)


export default {
  localeStore,
  ...stores.default
}