import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Form, Input, Icon, Button } from 'antd'
import styles from './index.module.less'

const form = Form.create()
const project = process.env.REACT_APP_PROJECT_NAME
const config=require(`@/${project}/config`).default
const logo = require(`./imgs/${project}/login_logo.png`)
const bg = require(`./imgs/${project}/login_BG.png`)

@form @observer
class Index extends Component {
    componentDidMount() {
        this.getCaptcha();
    }

    componentWillUnmount() {
        this.verifyCode = null
    }

  render () {
    const {form: {getFieldDecorator}} = this.props
    return (
      <div className={styles.container} style={{backgroundImage: `url(${bg})`}}>
        <div className={styles.logo}>
          <img src={logo} alt=''/>
        </div>
        <div className={`${styles.loginForm} ${styles[`login-form-${project}`]}`}>
          <div className={styles.titleBar}>
            <img src={require('./imgs/qingdenglu.png')} alt=''/>
          </div>
          <Form className={styles.forms}>
            <Form.Item className={styles.textInput}>
              {getFieldDecorator('loginName', {
                rules: [{required: true, message: '用户名不能为空，请输入用户名！'}],
              })(
                <Input size="large" placeholder="用户名" autoComplete="off" prefix={<Icon type="user" style={{fontSize: 16}}/>}/>
              )}
            </Form.Item>
            <Form.Item className={styles.textInput}>
              {getFieldDecorator('password', {
                rules: [{required: true, message: '密码不能为空，请输入密码！'}],
              })(
                <Input size="large" placeholder="密码" autoComplete="off" prefix={<Icon type="lock" style={{fontSize: 16}}/>}
                       type="password" onPressEnter={this.handleLogin}/>
              )}
            </Form.Item>
              <Form.Item>
                  {getFieldDecorator('verification', {
                      validateFirst: true,
                      rules: [
                          {required: true, message: '输入验证码'},
                          {
                              validator: (rule, value, callback) => {
                                  if (value.length>=6 && this.verifyCode.toUpperCase() !== value.toUpperCase()) {
                                      callback('验证码输入错误')
                                  }
                                  callback()
                              }
                          },
                      ]
                  })(
                      <Input
                          autoComplete="off"
                          placeholder={'123'}
                          prefix={<Icon type="safety" style={{fontSize: 16}}/>}
                          size='large'
                          addonAfter={<img id='CaptchaID'  width={'100px'} height={'38px'} onClick={this.getCaptcha}/>}
                      />

                  )}
              </Form.Item>
            <Form.Item>
              为了更好的使用体验，请使用
              <img width={30} height={30} src={require('./imgs/google.png')} alt=""/>
              <img width={30} height={30} src={require('./imgs/firefox.png')} alt=""/>
            </Form.Item>
            <Form.Item style={{width: '100%', height: '16.8%', textAlign: 'center'}}>
              <Button type="primary" className={styles.button} onClick={this.handleLogin}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }

  handleLogin = (e) => {
    const { form: {validateFieldsAndScroll}} = this.props
    validateFieldsAndScroll((errors, values) => {
      if (errors) return
      this.props.handleLogin(values)
    })
  }

    getCaptcha = () => {
        var xmlhttp;
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET",`${config.apiUrl}/user:captcha?stamp=${Date.now()}`,true);
        xmlhttp.responseType = "blob";
        xmlhttp.onload = function(){
            if (this.status == 200) {
                var blob = this.response;
                var img = document.getElementById("CaptchaID");
                img.onload = function(e) {
                    window.URL.revokeObjectURL(img.src);
                };
                img.src = window.URL.createObjectURL(blob);
            }
        }
        xmlhttp.onreadystatechange= () => {
            if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
                this.verifyCode =xmlhttp.getResponseHeader("Captcha")
            }
        }
        xmlhttp.send();
        this.props.form.resetFields("verification")
        return  this.verifyCode
    }
}

export default Index