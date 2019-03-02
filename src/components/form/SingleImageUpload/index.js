import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Upload, notification } from 'antd'
import classNames from 'classnames'
import { getSessionHeader } from '@/framework/utils/ajax'
import css from './SingleImageUpload.module.less'
import PDFIcon from './assets/PDF.svg'
import DOCIcon from './assets/DOC.svg'
import PPTIcon from './assets/PPT.svg'
import XSLIcon from './assets/XSL.svg'
import ZIPIcon from './assets/ZIP.svg'

const fileTypes = [
  {name:'pdf',icon:PDFIcon},
  {name:'pdf',icon:PDFIcon},
  {name:'doc',icon:DOCIcon},
  {name:'docx',icon:DOCIcon},
  {name:'ppt',icon:PPTIcon},
  {name:'pptx',icon:PPTIcon},
  {name:'xsl',icon:XSLIcon},
  {name:'xslx',icon:XSLIcon},
  {name:'zip',icon:ZIPIcon},
  {name:'rar',icon:ZIPIcon},
]

class SingleImageUpload extends React.Component {

  static propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    action: PropTypes.string,
    title: PropTypes.string,
    allowSize:PropTypes.number,
    allowTypes:PropTypes.array,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    type: 'small',
    name: 'file',
    action: 'https://api.whzzcc.com/b/file/upload',
    title:"上传附件",
    allowSize:2,
    allowTypes:[],
  }

  state = {
    loading: false
  }

  render () {
    const fileType = this.props.value.split('.')[this.props.value.split('.').length-1].toLocaleLowerCase()
    const imgPath = fileTypes.filter(item=>item.name === fileType).length !== 0 ? fileTypes.filter(item=>item.name === fileType)[0].icon : `https://api.whzzcc.com/b/file/${this.props.value}?w=300&h=300`
    return (
      <Upload
        name={this.props.name}
        listType="picture-card"
        className={classNames({[css.avatarUploaderSmall]: this.props.type === 'small'}, {[css.avatarUploaderBig]: this.props.type === 'big'})}
        showUploadList={false}
        action={this.props.action}
        headers={getSessionHeader()}
        beforeUpload={this.handleBeforeUpload}
        onChange={this.handleUpload}
      >
        {this.props.value ?
          <img src={imgPath} alt="点击上传图片"
               className={classNames({[css.uploadImageSmall]: this.props.type === 'small'}, {[css.uploadImageBig]: this.props.type === 'big'})}/> :
          (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'}/>
              <div className="ant-upload-text">{this.props.title}</div>
            </div>
          )}
      </Upload>
    )
  }

  handleUpload = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true})
      return
    }
    if (info.file.status === 'done') {
      this.setState({
        loading: false,
      })
      this.props.onChange(info.file.response)
    }
  }
  handleBeforeUpload = (file) => {
    let isAllowType = true
    let isAllowSize = true
    if(this.props.allowTypes.length>0){
      isAllowType = this.props.allowTypes.filter(item=>item === file.name.split('.')[file.name.split('.').length-1].toLocaleLowerCase()).length === 1;
      if (!isAllowType) {
        notification.error({
          message: '上传文件格式错误',
          description: `系统不支持该文件格式,系统仅支持${[...this.props.allowTypes]} 格式的文件`
        })
      }
    }

    isAllowSize = file.size / 1024 / 1024 < this.props.allowSize;
    if (!isAllowSize) {
      notification.error({
        message: '上传文件大小超过系统限制',
        description: `当前系统文件大小限制为：${this.props.allowSize}M,需要上传更大的文件请与管理员联系！`
      })
    }
    return isAllowType && isAllowSize;
  }
}

export default SingleImageUpload
