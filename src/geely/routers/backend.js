import React from 'react'
import PrivateRoute from '../../framework/PrivateRoute'
import LoadableComponent from '../../framework/LoadableComponent'

export default [
    <PrivateRoute key="main_letterNotice"  path="/main/letterNotice" component={LoadableComponent(import('./backend/LetterNotice'))}/>,
]