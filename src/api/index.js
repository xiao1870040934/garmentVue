// 将两个模块请求的接口函数统一暴露
import * as clientMark from './person/clientMark'
import * as providerMark from './person/providerMark'
import * as goodsManage from './person/goodsManage'
import * as inwharehouse from './person/inwarehouse'
import * as outwharehouse from './person/outwarehouse'

// 对外暴露
export default {
    clientMark,
    providerMark,
    goodsManage,
    inwharehouse,
    outwharehouse
}