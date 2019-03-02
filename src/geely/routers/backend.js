import React from 'react'
import LoadableComponent from '../../framework/LoadableComponent'
import asyncComponent from '../../components/AsyncComponent'

const LetterNotice = asyncComponent(()=>import('./backend/LetterNotice'));
// const LetterNotice = asyncComponent(()=>LoadableComponent(import('./backend/LetterNotice')));
// const LetterNotice =(()=>(LoadableComponent(import('./backend/LetterNotice'))))

const backendTabs={
    letterNotice:<LetterNotice/>
}

export default backendTabs