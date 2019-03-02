import React, { Component } from 'react'
import { Modal } from 'antd'
import PropTypes from 'prop-types'

const confirm = Modal.confirm

class ConfirmModal extends Component {

  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    okType: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,

  }

  static defaultProps = {
    okType: 'primary'
  }

  state = {
    show: false
  }

  render () {
    return (
      <span onClick={this.handleShowModal}>
        {this.props.children}
      </span>
    )
  }

  handleShowModal = () => {
    confirm({
      title: this.props.title,
      content: this.props.content,
      onOk: this.props.onConfirm,
      onCancel: this.props.onCancel,
    })
  }
}

export default ConfirmModal