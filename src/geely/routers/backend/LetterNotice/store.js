import {observable, action, runInAction, computed} from 'mobx'
import {get, json} from "../../../../framework/utils/ajax";
import {handleSeerchAndPage} from '../../../../framework/utils/OnestepUtils'
import {message} from 'antd'

const project = process.env.REACT_APP_PROJECT_NAME
const config=require(`@/${project}/config`).default

class LetterNoticeStore {
    @observable loading;
    @observable searchFields; //搜索字段
    @observable letterNoticeList;   //通知单列表
    @observable letterNoticePage;   //通知单页面
    @observable letterNoticePagination;
    @observable addModal;   //新增弹窗
    @observable addFields;   //新增字段
    @observable carseriesList; //车系列表
    @observable factoryList; //基地列表
    @observable letterPath; //通知书保存路径
    @observable option; //用于判断新增father/son
    @observable info;   //保存table同一行数据
    @observable statisticsList;
    @observable statisticsPage;   //下载统计页面
    @observable statisticsPagination;
    @observable searchFieldsStatistics; //搜索条件  设为空
    @observable allowedAdd; //允许上传（附件添加成功）
    @observable carseriesCodeList; //新增时车系列表
    @observable factoryNameList; //新增时基地列表
    @observable countryAreaList;//查询时国家地区列表（针对共享）
    @observable countryAreaOptions //国家地区Options
    @observable fileList

    constructor() {
        this.loading = false;
        this.searchFields = {
            letterName: '',
            letterCode:'',
            isShare: '',
            factoryName:'',
            carseriesCode:'',
            creatorName:'',
            startTime:'',
            endTime:'',
            sharePlace:''
        };
        this.letterNoticeList = [];
        this.letterNoticePage = {
            current: 0,
            total: 1,
            showQuickJumper:true
        };
        this.letterNoticePagination = {
            current: 0,
            total: 1,
            showQuickJumper:true
        };
        this.addModal = 'hide';
        this.addFields = {
            letterCode: '',
            letterName: '',
            factoryName: '',
            carseriesCode: '',
            letterPath: '',
            level: '',
            pId: ''
        }
        this.carseriesList = [];
        this.factoryList = [];
        this.letterPath = '';
        this.option = [];
        this.info = [];
        this.statisticsPage = {
            current:0,
            total:1,
            showQuickJumper:true
        };
        this.statisticsPagination = {
            current:0,
            total:1,
            showQuickJumper:true
        }
        this.searchFieldsStatistics = {
            letterCode: '',
            letterName: ''
        }
        this.allowedAdd = false
        this.statisticsList = []
        this.carseriesCodeList = []
        this.factoryNameList = []
        this.countryAreaList = []
        this.countryAreaOptions = []
        this.fileList = []
    }

    //下载统计-搜索框绑值
    @computed
    get searchFieldsStatisticsModal() {
        let fields = {
            letterCode: {value: this.searchFieldsStatistics.letterCode},
            letterName: {value: this.searchFieldsStatistics.letterName}
        };
        return fields;
    }

    //下载统计-改变时绑定搜索框值
    @action
    searchFieldsStatisticsChangeModal(changeFields) {
        const fields = {...this.searchFieldsStatisticsModal, ...changeFields}
        const searchFieldsStatistics = {
            letterCode: fields.letterCode.value ? fields.letterCode.value.trim() : '',  //去除空格
            letterName: fields.letterName.value ? fields.letterName.value.trim() : '',  //去除空格
        };
        this.searchFieldsStatistics = searchFieldsStatistics;
    }

    //下载统计-清空搜索框
    @action
    clearSearchFieldsStatistics = () => {
        this.loading = true;
        this.searchFieldsStatistics = {
            letterName: '',
            letterCode: '',
        };
        this.loading = false
    };

    /**
     * 下载统计主页面
     * @param page
     * @returns {Promise.<void>}
     */
    @action
    initLetterNoticeDownloadPage = async(page) => {
        runInAction(() => {
            this.loading = true
        })
        let searchResult = handleSeerchAndPage(page,this.statisticsPagination,this.searchFieldsStatistics);
        const res = await get(`${config.apiUrl}/onestep/base/epc/letternoticedownload/getPage:search`, searchResult);
        runInAction(() => {
            this.statisticsList = res.content || [];
            this.statisticsPagination = {
                current: res.number + 1,
                total: res.totalElements,
                showQuickJumper:true
            };
            this.loading = false
        })
    };

    /**
     * 通知单主页面
     * @param page
     * @returns {Promise.<void>}
     */
    @action
    initLetterNoticePage = async (page) => {
        runInAction(() => {
            this.loading = true
        });
        let searchResult = handleSeerchAndPage(page, this.letterNoticePagination, this.searchFields);
        const res = await get(`${config.apiUrl}/onestep/base/epc/letternotice/get_page:search`, searchResult);
        runInAction(() => {
            this.letterNoticePagination = {
                current: res.number + 1,
                total: res.totalElements,
                showQuickJumper:true
            };
            this.letterNoticeList = this.setNumber(res.content) || [];
            this.loading = false
        })
    }

    /**
     * 设置当前列表序号，记录最后一个序号
     * @returns {{letterName: {value: string}, isShare: {value: string}}}
     */
    @action
    setNumber(arr ) {
        if (!arr){
            return
        }
        let arr2 = arr;
        arr2.forEach((item, index) => {
            if (index === 0) {
                item.num = 1
            } else {
                if (arr2[index - 1].children) {
                    item.num = arr2[index - 1].num + arr2[index - 1].children.length + 1
                } else {
                    item.num = arr2[index - 1].num + 1
                }
            }
            // index === 0 ? item.number = 1 : arr2[index-1].children? item.number = arr2[index-1].number+arr2[index-1].children.length+1 : item.number = arr2[index-1].number+1

            if (item.children) {
                item.children.forEach((item2, index2) => {
                    item2.num = item.num + index2 + 1
                })
            }
        });

        return arr2
    }

    //主页面搜索框绑值
    @computed
    get searchFieldsModal() {
        let fields = {
            letterName: {value: this.searchFields.letterName},
            letterCode: {value: this.searchFields.letterCode},
            isShare: {value: this.searchFields.isShare},
            factoryName: {value: this.searchFields.factoryName},
            carseriesCode: {value: this.searchFields.carseriesCode},
            creatorName: {value: this.searchFields.creatorName},
            startTime: {value: this.searchFields.startTime},
            endTime: {value: this.searchFields.endTime},
            sharePlace: {value: this.searchFields.sharePlace},
        };
        return fields;
    }

    //改变时绑定搜索框值
    @action
    searchFieldsChangeModal(changeFields) {
        const fields = {...this.searchFieldsModal, ...changeFields}
        const searchFields = {
            letterName: fields.letterName.value ? fields.letterName.value.trim() : '',
            letterCode: fields.letterCode.value ? fields.letterCode.value.trim() : '',
            isShare: (fields.isShare.value === '是') ? 1 :((fields.isShare.value === '否') ? 0 : ''),
            factoryName: fields.factoryName.value ? fields.factoryName.value : '',
            carseriesCode: fields.carseriesCode.value ? fields.carseriesCode.value : '',
            creatorName: fields.creatorName.value ? fields.creatorName.value.trim() : '',
            startTime: (fields.rangePicker && fields.rangePicker.value && fields.rangePicker.value.length) ? fields.rangePicker.value[0].format('YYYY-MM-DD') : '',
            endTime: (fields.rangePicker && fields.rangePicker.value && fields.rangePicker.value.length) ? fields.rangePicker.value[1].format('YYYY-MM-DD') : '',
            sharePlace: fields.sharePlace.value ? fields.sharePlace.value : '',

        }
        this.searchFields = searchFields;
    }

    //清空搜索框
    @action
    clearSearchFields = () => {
        this.searchFields = {
            letterName: '',
            letterCode:'',
            isShare: '',
            factoryName:'',
            carseriesCode:'',
            creatorName:'',
            startTime:'',
            endTime:'',
            sharePlace:''
        };
        this.initLetterNoticePage()
    };

    //删除
    @action
    doDelete = async (id) => {
        runInAction(() => {
            this.loading = true
        })
        await json.post(`${config.apiUrl}/onestep/base/epc/letternotice/delete/${id}`);
        runInAction(() => {
            this.initLetterNoticePage(this.letterNoticePage);
            this.loading = false
        })
    };

    /**
     * 新增Box绑值
     */
    @computed
    get addFieldModel() {
        let fileds = {
            letterCode: {value: this.addFields.letterCode},
            letterName: {value: this.addFields.letterName},
            letterPath: {value: this.addFields.letterPath},
            level: {value: this.addFields.level},
            pId: {value: this.addFields.pId},
            factoryNameList: {value: this.factoryNameList},
            countryAreaList: {value: this.countryAreaList}
        }
        return fileds
    }

    /**
     * 绑定新增窗口的值
     * @param changeFields
     */
    @action
    addFieldChangeModel(changeFields) {
        const fields = {...this.addFieldModel, ...changeFields}
        const addFields = {
            letterCode: fields.letterCode.value,
            letterName: fields.letterName.value,
            letterPath: fields.letterPath.value,
            level: fields.level.value,
            factoryNameList: fields.factoryNameList.value,
            countryAreaList: fields.countryAreaList.value
        }
        this.addFields = addFields
    }

    /**
     * 新增窗口弹出
     */
    @action
    showAddBox = (record, option) => {
        runInAction(() => {
            this.loading = true
            this.addFields = {
                letterCode: '',
                letterName: '',
                letterPath: '',
                level: '',
                pId: '',
            };
            this.carseriesCodeList = []
            this.factoryNameList = []
            this.info = record;
            this.option = option;
            this.letterPath = '';
            this.addModal = 'show';
            this.loading = false
        })
    }

    /**
     * 保存
     * 通知单属性是factoryName，carseriesCode，但是新增的form表单存的是factoryNameList，carseriesCodeList
     * 最后处理两个list 使其变成/XX/XX/XX/的形式存在对应属性里面
     */
    @action
    save = async (comment, option) => {
        if (this.allowedAdd===false){
            message.warning("必须成功上传附件");
            return
        }
        this.loading = true
        let info = this.info;
        let data = {
            'letterCode': comment.letterCode,
            'letterName': comment.letterName,
            'factoryName': "/"+comment.factoryNameList.join("/")+"/",
            'carseriesCode': "/"+comment.carseriesCodeList.join("/")+"/",
            'letterPath': this.letterPath,
            'level': '',
            'pId': ''
        }
        if (option === 'addSon') {
            data.level = 2;
            data.pId = info.id
        } else {
            data.level = 1;
            data.pId = 0
        }
       await json.post(`${config.apiUrl}/onestep/base/epc/letternotice/add`, data);
        runInAction(() => {
            this.loading = false
            this.addModal = 'hide'
            this.initLetterNoticePage(this.letterNoticePage.current);
            this.allowedAdd = false
        })
    }

    /**
     * 查询国家地区
     */
    @action
    initCountryArea = async () => {
        runInAction(() => {
            this.loading = true
        })
        let res = await json.get(`${config.apiUrl}/onestep/base/epc/dictionary/getOneRoot`, {name: '国家和地区/'})
        let countryAreaList = res.children || []
        let countryAreaOptions = []
        countryAreaList.forEach(item=>{
            countryAreaOptions.push({
                label:item.name,
                value:item.name
            })
        })
        runInAction(() => {
            this.countryAreaList = countryAreaList
            this.countryAreaOptions = countryAreaOptions
            this.loading = false
        })
    }

    /**
     * 查询基地(字典表)
     */
    @action
    initFactoryList = async () => {
        runInAction(() => {
            this.loading = true
        });
        const res = await json.get(`${config.apiUrl}/onestep/base/epc/dictionary/getOneRoot`,{name:'工厂/'})
        runInAction(() => {
            this.factoryList = res.children || [];
            this.loading = false
        })
    };

    /**
     * 查询车系
     */
    @action
    initCarSeriesList = async () => {
        runInAction(() => {
            this.loading = true
        });
        const res = await json.get(`${config.apiUrl}/onestep/base/epc/epc/carseriesCatalogs`)
        runInAction(() => {
            this.carseriesList = res.content || [];
            this.loading = false
        })
    };

    /**
     * 给附件地址赋值
     */
    @action
    setFilePath = (letterPath) => {
        this.letterPath = letterPath
    }

    /**
     * 设置上传文件列表
     */
    @action
    setFileList (fileList) {
        this.fileList=fileList
    }

    /**
     * 关闭弹窗
     */
    @action
    closeAddBox = async () => {
        runInAction(() => {
            this.addModal = 'hide'
            this.fileList = []
        })
    }

    /**
     * 共享
     */
    @action
    share = async (list, id) => {
        runInAction(() => {
            this.loading = true
        })

        await json.post(`${config.apiUrl}/onestep/base/epc/letternotice/shareletter/id/${id}`, list);
        message.success('操作成功')
        runInAction(() => {
            this.initLetterNoticePage(this.letterNoticePagination.current);
            this.loading = false
        })
    }
    //取消共享
    @action
    cancelShare = async (id) => {
        runInAction(() => {
            this.loading = true
        })
        await json.post(`${config.apiUrl}/onestep/base/epc/letternotice/cancelshare/id/${id}`);
        message.success('已取消共享');
        runInAction(() => {
            this.initLetterNoticePage(this.letterNoticePagination.current);
            this.loading = false
        })
    }

    @action
    uploadLoading = (flag) =>{
        runInAction(() => {
            this.loading = flag;
        })
    }

}

export default new LetterNoticeStore()