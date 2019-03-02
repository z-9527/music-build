import React from 'react';
import {inject, observer} from 'mobx-react'
import {Card, DatePicker, Table, Form, Input, Button, Icon, Col, Row} from 'antd';
import moment from 'moment';
import {message, Modal} from "antd/lib/index";

import {FormattedMessage, injectIntl, intlShape} from 'react-intl'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const form = Form.create({
    //表单数据绑定到store
    onFieldsChange(props, changedFields) {
        props.shopStore.searchFieldChange(changedFields)
    },
});

@injectIntl @inject('shopStore') @form @observer
class ShoppingCar extends React.Component {
    static propTypes = {
        intl: intlShape.isRequired,
    }

    componentDidMount() {         //react第一次加载的时候进行绑值
        this.props.shopStore.initPage()
    }

    render() {
        const {shopStore} = this.props;
        const {getFieldDecorator} = this.props.form;      //表单赋值变量
        const {intl: {formatMessage}} = this.props;   //语言国际化
        const formItemLayout = {
            labelCol: {sm: {span: 10}},
            wrapperCol: {sm: {span: 12}},
        };
        const rowSelection = {                             //多选框
            onChange: (selectedRowKeys) => {
                this.props.shopStore.setSelectedRowKeys(selectedRowKeys)
            },
        };
        const columns = [
            {
                title: <div>{formatMessage({id: 'shopping.tableNo'})}</div>,
                align: 'center',
                dataIndex: 'number',
                render: (text, record, index) => {
                    let number = (this.props.shopStore.page.current - 1) * 10 + index + 1
                    if (number < 10) {
                        number = '0' + number
                    }
                    return number
                }
            },
            {title: <div>{formatMessage({id: 'shopping.tableSpareNo'})}</div>, dataIndex: 'spareNo', align: 'center'},
            {
                title: <div>{formatMessage({id: 'shopping.tableMATNR'})}</div>,
                dataIndex: 'materialCode',
                align: 'center'
            },
            {
                title: <div>{formatMessage({id: 'shopping.tableSpareName'})}</div>,
                dataIndex: 'spareName',
                align: 'center'
            },
            {
                title: <div>{formatMessage({id: 'shopping.tableServiceStation'})}</div>,
                dataIndex: 'serviceCode',
                align: 'center'
            },
            {
                title: <div>{formatMessage({id: 'shopping.tableOrderTime'})}</div>,
                dataIndex: 'orderTime',
                align: 'center',
                render: (text, record) => (moment(text).format('YYYY-MM-DD HH:mm:ss'))
            },
            {
                title: <div>{formatMessage({id: 'shopping.tableAmount'})}</div>,
                dataIndex: 'orderNumber',
                align: 'center'
            },
            {
                title: <div>{formatMessage({id: 'shopping.tableOperation'})}</div>,
                align: 'center',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <a onClick={this.deleteClick.bind(this, record.id)}><Icon type='delete'/>&nbsp;<FormattedMessage
                        id="shopping.tableDelete"/></a>
                ),
            }];
        return (
            <div>
                <Card bordered={false} className='searchBox' style={{marginBottom: 24}} bodyStyle={styles.cardBody}>
                    <Form style={{width: '100%'}} layout='inline'>
                        <Row>
                            <Col span={9}>
                                <FormItem label={formatMessage({id: 'shopping.spareNo'})}{...formItemLayout}
                                          style={{width: '100%'}}>
                                    {getFieldDecorator('spareNo', {})(<Input style={{width: '100%'}}
                                                                             placeholder={formatMessage({id: 'shopping.spareNoInput'})}/>)}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem label={formatMessage({id: 'shopping.MATNR'})} {...formItemLayout}
                                          style={{width: '100%'}}>
                                    {getFieldDecorator('materialCode', {})(<Input style={{width: '100%'}}
                                                                                  placeholder={formatMessage({id: 'shopping.MATNRInput'})}/>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 16}}>
                            <Col span={9}>
                                <FormItem label={formatMessage({id: 'shopping.startTime'})} {...formItemLayout}
                                          style={{width: '100%'}}>
                                    {getFieldDecorator('startTime', {})(
                                        <DatePicker style={{width: '100%'}}
                                                    placeholder={formatMessage({id: 'shopping.startTimeInput'})}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem label={formatMessage({id: 'shopping.endTime'})} {...formItemLayout}
                                          style={{width: '100%'}}>
                                    {getFieldDecorator('endTime', {})(
                                        <DatePicker style={{width: '100%'}}
                                                    placeholder={formatMessage({id: 'shopping.DeadlineInput'})}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <div style={{textAlign: 'right',marginTop:16}}>
                            <Button icon={'search'} style={{marginRight: 8}} type="primary" htmlType="submit"
                                    onClick={() => this.search()}>{formatMessage({id: 'shopping.demand'})}</Button>
                            <Button icon={'reload'}
                                    onClick={this.handleReset}>{formatMessage({id: 'shopping.reset'})}</Button>
                        </div>
                    </Form>
                </Card>
                <Card bordered={false} bodyStyle={styles.cardBody}>
                    <div style={{textAlign: 'right', marginBottom: 16}}>
                        <Button type="primary" style={{marginRight: 8,color:'#fff'}} href={this.getUrl()} icon={"export"}>
                            {formatMessage({id: 'shopping.derive'})}
                        </Button>
                        <Button icon='delete' onClick={this.removeListData}>{formatMessage({id: 'shopping.deleteBatch'})}</Button>
                    </div>
                    <Table
                        rowKey={(item) => item.id}
                        rowSelection={rowSelection}
                        pagination={shopStore.page}
                        onChange={this.handleTableChange}
                        columns={columns}
                        loading={shopStore.loading}
                        dataSource={shopStore.searchData.slice()}
                        bordered/>
                </Card>
            </div>
        )
    }

    //处理数据分页
    handleTableChange = (page) => {
        this.props.shopStore.initPage(page.current)
    }

    //重置
    handleReset = async () => {
        this.props.form.resetFields()
        await this.props.shopStore.initPage()
        message.success(this.props.intl.formatMessage({id: 'shopping.warnReset'}))
    }

    //根据条件查询table的值
    search = async () => {
        const fieldsValue = this.props.form.getFieldsValue()
        if (fieldsValue.startTime && fieldsValue.endTime) {
            if (fieldsValue.startTime > fieldsValue.endTime) {
                message.warning(this.props.intl.formatMessage({id: 'shopping.warnTime'}))
                this.setState({
                    loading: false
                })
                return
            }
        }
        await this.props.shopStore.initPage(null)
    };

    // 导出
    getUrl = () => {
        return this.props.shopStore.getUrl()

    }

    // 单条删除
    deleteClick = (id) => {
        let _this = this;
        confirm({
            title: <div>{this.props.intl.formatMessage({id: 'shopping.oneDeleteTitle'})}</div>,
            content: <div>{this.props.intl.formatMessage({id: 'shopping.oneDeleteContent'})}</div>,
            okText: <div>{this.props.intl.formatMessage({id: 'shopping.oneDeleteOkText'})}</div>,
            okType: 'danger',
            cancelText: <div>{this.props.intl.formatMessage({id: 'shopping.oneDeleteCancelText'})}</div>,
            onOk() {
                _this.props.shopStore.doDelete(id)
            },
            onCancel() {
            },
        })
    }

    //批量删除
    removeListData = () => {
        if (!this.props.shopStore.delectSelectParam.length) {
            message.info(this.props.intl.formatMessage({id: 'shopping.deleteBatchMessageInfo'}))
            return
        }
        let _this = this
        confirm({
            title: <div>{this.props.intl.formatMessage({id: 'shopping.deleteBatchTitle'})}</div>,
            content: <div>{this.props.intl.formatMessage({id: 'shopping.deleteBatchContent'})}</div>,
            okText: <div>{this.props.intl.formatMessage({id: 'shopping.deleteBatchOkText'})}</div>,
            okType: 'danger',
            cancelText: <div>{this.props.intl.formatMessage({id: 'shopping.deleteBatchCancelText'})}</div>,
            onOk() {
                _this.props.shopStore.doRemoveListData();
            },
            onCancel() {
            },
        })
    }

}
const styles={
    cardBody: {
        padding: '24px',
    }
}

export default ShoppingCar
