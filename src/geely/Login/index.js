import React ,{Component}from 'react';
import Login from '../../components/Login/index';
import {inject} from "mobx-react/index";

@inject('appStore')
class ContainerLogin extends  Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Login
                handleLogin={this.handleLogin}
            />
        )
    }

    handleLogin=(values)=>{
        const {appStore: {login}} = this.props
        login(values)

    };
}

export default ContainerLogin;
