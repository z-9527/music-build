import React from 'react'
import {Spin} from 'antd'

const Loading = () => (
  <Spin size="large" tip="加载中，请稍候...">
    <div style={{width: '100vw', height: '100vh'}}></div>
  </Spin>
)

export default Loading