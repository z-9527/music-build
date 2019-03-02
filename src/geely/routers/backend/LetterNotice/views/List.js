import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Select, Form, Spin, Input, Table, Button, Icon, Card, Checkbox, Divider, DatePicker, Row, Col} from 'antd'
import {message, Modal} from 'antd/lib/index'
import {Link, withRouter} from 'react-router-dom'
import moment from 'moment'
import  '../LetterNotice.module.less'
import uuid from 'uuid/v4'

const RangePicker = DatePicker.RangePicker
const CheckboxGroup = Checkbox.Group
const Option = Select.Option
const confirm = Modal.confirm
const FormItem = Form.Item
const form = Form.create({
    onFieldsChange(props, changedFields) {
        props.letterNoticeStore.searchFieldsChangeModal(changedFields)
    }
})
@withRouter @inject('letterNoticeStore') @form @observer
 class List extends Component {
    state = {
        show: false,
        shareList: [],
        checked: false,
        id: ''
    }

    componentDidMount() {    //react第一次加载的时候进行绑值
        this.props.letterNoticeStore.initLetterNoticePage();
        this.props.letterNoticeStore.initCarSeriesList();
        this.props.letterNoticeStore.initFactoryList();
        this.props.letterNoticeStore.initCountryArea();
    }

    render() {
        const {getFieldDecorator} = this.props.form;   //表单赋值变量
        const {letterNoticeStore} = this.props;
        const formItemLayout = { //布局样式
            labelCol: {
                sm: {span: 9}
            },
            wrapperCol: {
                sm: {span: 15}
            },
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'num',
                align: 'center',
                width: 80
            },
            {
                title: '通知书编号',
                align: 'center',
                dataIndex: 'letterCode',
            },
            {
                title: '通知书名称',
                align: 'center',
                dataIndex: 'letterName',
            },
            {
                title: '基地',
                align: 'center',
                dataIndex: 'factoryName',
                render: (text) => text.split("/").slice(1, -1).join("，")   //拆成逗号分隔的形式
            },
            {
                title: '车系',
                align: 'center',
                dataIndex: 'carseriesCode',
                render: (text) => text.split("/").slice(1, -1).join("，")   //拆成逗号分隔的形式
            },
            {
                title: '创建人',
                align: 'center',
                dataIndex: 'creatorName',
            },
            {
                title: '创建时间',
                align: 'center',
                dataIndex: 'createTime',
                render: (text, record) => (moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'))
            },
            {
                title: '操作',
                align: 'center', key: 'title',
                render: (text, record) => (
                    <div style={{textAlign: 'left'}}>
                        <a><Icon type='share-alt'/> {record.isShare ? '修改共享' : '共享'}</a>
                        <Divider type='vertical'/>
                        <a><Icon type="download"/> 下载</a>
                        <Divider type='vertical'/>
                        <a><Icon type='delete'/> 删除</a>
                        <Divider type='vertical'/>
                    </div>
                )
            }
        ];
        const selectCarseries = (data) => {
            return (
                <Select
                    showSearch
                    placeholder="请选择车系"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    {
                        data.map((item, index) => {
                            return (<Option key={index} value={item.carSeriesCode}>{item.carSeriesCode}</Option>)
                        })
                    }
                </Select>
            )
        }
        const selectFactory = (data) => {
            return (
                <Select
                    showSearch
                    placeholder="请选择基地"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    {data.map((item, index) => {
                        return (<Option key={index} value={item.name}>{item.name}</Option>)
                    })}
                </Select>
            )
        }
        const selectShareCountryArea = (data) => {
            return (
                <Select
                    showSearch
                    placeholder="请选择共享大区"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    {data.map((item, index) => {
                        return (<Option key={index} value={item.name}>{item.name}</Option>)
                    })}
                </Select>
            )
        }

        return (
            <Spin spinning={letterNoticeStore.loading}>
                <Card bordered={false}>
                    <Form onSubmit={this.handleSearch} layout='inline'>
                        <Row style={{marginBottom: 8}}>
                            <Col span={6}>
                                <FormItem label={'通知书名称'} {...formItemLayout} style={styles.formItem}>
                                    {getFieldDecorator('letterName', {})(<Input placeholder="请输入通知书名称"/>)}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem label={<span>车&emsp;&emsp;系</span>} {...formItemLayout}
                                          style={styles.formItem}>
                                    {getFieldDecorator('carseriesCode', {})(selectCarseries(letterNoticeStore.carseriesList))}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem label={<span>是否共享</span>} {...formItemLayout} style={styles.formItem}>
                                    {getFieldDecorator('isShare', {})(
                                        <Select>
                                            <Select.Option value={'是'}>已共享</Select.Option>
                                            <Select.Option value={'否'}>未共享</Select.Option>
                                        </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label={<span>基&emsp;&emsp;地</span>} {...formItemLayout}
                                          style={styles.formItem}>
                                    {getFieldDecorator('factoryName', {})(selectFactory(letterNoticeStore.factoryList))}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <FormItem label={'通知书编号'} {...formItemLayout} style={styles.formItem}>
                                    {getFieldDecorator('letterCode', {})(<Input placeholder="请输入通知书编号"/>)}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem label={'共享大区'} {...formItemLayout} style={styles.formItem}>
                                    {getFieldDecorator('sharePlace', {})(selectShareCountryArea(letterNoticeStore.countryAreaList))}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem label={<span>创&ensp;建&ensp;人</span>} {...formItemLayout}
                                          style={styles.formItem}>
                                    {getFieldDecorator('creatorName', {})(<Input placeholder="请输入创建人"/>)}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <Form.Item label='时间范围' {...formItemLayout} style={styles.formItem}>
                                    {getFieldDecorator('rangePicker', {})(
                                        <RangePicker style={{width: '100%'}} showTime format="YYYY-MM-DD"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <FormItem style={{float: 'right', marginRight: 0, marginTop: 8, marginBottom: 12}}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                        </FormItem>
                    </Form>

                    <Table bordered={true}
                           onChange={this.handleTableChange}
                           dataSource={letterNoticeStore.letterNoticeList.slice()}
                           rowKey={(item) => item.id}
                           columns={columns}
                           pagination={letterNoticeStore.letterNoticePagination}/>

                </Card>
            </Spin>
        )
    }

    //确定搜索
    handleSearch = (e) => {
        e.preventDefault()
        //校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.letterNoticeStore.initLetterNoticePage()
            }
        })
    }

    //清空搜索框
    handleReset = () => {
        this.props.form.resetFields()
        this.props.letterNoticeStore.clearSearchFields()
        message.success("重置成功")
    }

}

const styles = {
    cardBody: {
        padding: '24px',
    },
    exportStyle: {
        width: '100px',
        height: '32px',
        padding: '0 15px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        lineHeight: '32px',
        textAlign: 'center',
        float: 'right'
    },
    title: {
        height: 64,
        lineHeight: '64px',
        background: '#1890FF',
        textAlign: 'center',
        color: '#fff'
    },
    formItem: {
        width: '100%',
    },
    inputItem: {
        width: 272,
        marginRight: 32
    },
}

export default List