import {observable, action, runInAction} from 'mobx'
import {get, json} from '../../../../framework/utils/ajax'
import {handleSeerchAndPage, ValueObjToObj,_encodeParamToSearch} from "../../../../framework/utils/OnestepUtils";
import {message} from "antd/lib/index";
import moment from 'moment';

const project = process.env.REACT_APP_PROJECT_NAME
const config=require(`@/${project}/config`).default

class shopStore {
    @observable loading;
    @observable searchData;
    @observable page;
    @observable searchValue;    //条件查询时的值
    @observable delectSelectParam  //多选删除

    constructor() {
        this.loading = false;
        this.page = {
            current: 0,
            total: 1,
            showQuickJumper:true
        };
        this.searchData=[];
        this.searchValue={
            spareNo:'',
            materialCode:'',
            startTime:'',
            endTime:''
        };
        this.delectSelectParam = []  //多选删除
    }

    /*** 主页面搜索表单的值绑定* @param changedFields*/
    @action
    searchFieldChange(changedFields) {
        runInAction(() => {
            this.loading = true
            this.searchValue = {...this.searchValue, ...ValueObjToObj(changedFields)}
            this.loading = false
        })
    }

    /*** 根据条件或无条件分页请求接口加载数据*/
    @action
    initPage = async (temPage) => {
        runInAction(() => {
            this.loading = true
        });
        //重新定义一个变量接收，如在原条件值上修改则页面会崩溃
        let searchValue = {
            spareNo: this.searchValue.spareNo || '',
            materialCode: this.searchValue.materialCode || '',
            startTime: !this.searchValue.startTime ? "" : moment(this.searchValue.startTime).format("YYYY-MM-DD"),
            endTime: !this.searchValue.endTime ? "" : moment(this.searchValue.endTime).format("YYYY-MM-DD")
        };
        let search = handleSeerchAndPage(temPage, this.page, searchValue);
        const res = await get(`${config.apiUrl}/onestep/base/epc/epc/shoppingCar/queryAllShopCarDetailedListForPage`,search)
        if (res && res.status === 0) {
            message.error(res.msg);
            runInAction(() => {
                this.loading = false
            });
            return
        }
        runInAction(() => {
            this.loading = false;
            this.searchData = res.content || [];
            this.page = {
                current: res.number + 1,
                total: res.totalElements,
                showQuickJumper:true
            }
        })
    }

    /********导出**/
    @action
    getUrl = () => {
        const url = `${config.apiUrl}/onestep/base/epc/epc/shoppingCar/exportShopCarExcel`;
        return `${url}?${_encodeParamToSearch(this.getParam())}`
    };
    @action
    getParam = () => {
       const values = {
            spareNo: this.searchValue.spareNo && this.searchValue.spareNo.trim(),
            materialCode: this.searchValue.materialCode && this.searchValue.materialCode.trim(),
            startTime: this.searchValue.startTime && this.searchValue.startTime.format('YYYY-MM-DD'),
            endTime: this.searchValue.endTime && this.searchValue.endTime.format('YYYY-MM-DD')
        }
        return values;
    };


    /******单条删除****/
    @action
    doDelete = async (id) => {
        runInAction(() => {
            this.loading = true
        })
        await json.delete(`${config.apiUrl}/onestep/base/epc/epc/shoppingCar/batchDelShopCar?ids=${id}`);
        runInAction(() => {
            this.loading = false;
            this.initPage(this.page.current);
        })
    };


    /**批量删除*/
    @action
    setSelectedRowKeys = (list) => {
        let delectSelectParam=list.map((item)=>{
             return `ids=${item}`
        });
        this.delectSelectParam = delectSelectParam.join("&")
    }

    @action
    doRemoveListData = async () => {
        console.log(this.delectSelectParam)
        await json.delete(`${config.apiUrl}/onestep/base/epc/epc/shoppingCar/batchDelShopCar?${this.delectSelectParam}`)
        runInAction(() => {
                    this.loading = false;
                    this.initPage(this.page.current);
                })
    }
}

export default new shopStore()