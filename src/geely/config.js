import favicon from './favicon.ico'
import dev from './config.dev'
import prop from './config.prop'

const config = () => {
    switch (process.env.REACT_APP_PROFILE) {
        case 'dev': return dev
        case 'prop': return prop
        default: return {}
    }
}

export default {
    title: '吉利技术服务平台',
    favicon: favicon,
    apiUrl: 'http://api.eisndoc.com',
    REACT_APP_API_UPLOAD_URL:'http://47.97.206.90:8080/upload/file/upload',
    REACT_APP_CATALOG_URL:4,
    REACT_APP_CATALOG2_URL:3,
    REACT_APP_COMPANY:{"frontend":5,"backend":4,"pageId": "246e2580-b4d0-11e8-83c3-6fba56808002"},
    companyId:6,
    ...config()
}