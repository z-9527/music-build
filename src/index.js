import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { configure } from 'mobx'
import { Provider, inject, observer } from 'mobx-react'
import stores from './stores'
import history from './framework/customHistory'
import { Router } from 'react-router-dom'
import MobxIntlProviderChild from './framework/MobxIntlProviderChild'

configure({
  enforceActions: 'observed'
})

//国际化组件
const MobxIntlProvider = inject('localeStore')(observer(MobxIntlProviderChild))

ReactDOM.render(
  <Provider {...stores}>
    <MobxIntlProvider>
      <Router basename="/" history={history}>
        <App/>
      </Router>
    </MobxIntlProvider>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
