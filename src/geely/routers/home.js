import React from 'react'
import PrivateRoute from '../../framework/PrivateRoute'
import LoadableComponent from '../../framework/LoadableComponent'

export default [
  <PrivateRoute key="home_role" exact path="/home/shoppingCar" component={LoadableComponent(import('./home/ShoppingCar'))}/>,
]