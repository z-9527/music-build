import React from 'react'
import { Route } from 'react-router-dom'
import PrivateRoute from '../../framework/PrivateRoute'
import LoadableComponent from '../../framework/LoadableComponent'

export default [
  <Route key="frontend_index" exact path="/" component={LoadableComponent(import('./frontend/FirstPage'))}/>,
  <Route key="frontend_login" exact path="/login" component={LoadableComponent(import('../Login'))}/>,
  <PrivateRoute key="front_backend" path="/main" component={LoadableComponent(import('./backend/Main'))}/>,
  <PrivateRoute key="front_home" path="/home" component={LoadableComponent(import('./home/HomePage'))}/>,
]