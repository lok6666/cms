const host:string = 'http://172.16.12.8:28182';
// const host:string = 'http://172.16.110.101:28191';
// 登录接口
export const login = `${host}/auth/login`

/*信息发布-文章发布*/
export  const articleSelectArticle = `${host}/article/selectTAL` //  文章类型
export  const articleSelectAll = `${host}/article/selectAll` //  文章列表
export  const articleDelete = `${host}/article/deleteAll` // 文章删除
export  const articleRecycle = `${host}/article/selectRecycleBin` // 文章删除
export  const articleSelectById = `${host}/article/selectById` // 文章内容
export  const articleUpdateOne = `${host}/article/updateOne` // 文章内容
export  const articleArticleAelectCircle = `${host}/articletype/selectType` // 文章类型 
export  const articleArticleAddOne = `${host}/article/addOne` // 新增

/*信息发布-敏感词*/
export  const sensitiveSelectAll = `http://172.16.110.101:81/assoication_sjs/trzSensitive/selectAll` //  文章列表
export const sensitiveAddOne = `http://172.16.110.101:81/assoication_sjs/trzSensitive/addOne`//  敏感词添加
export const sensitiveUpdateOne = `http://172.16.110.101:81/assoication_sjs/trzSensitive/updateOne`//  敏感词更新
export const sensitiveDelete = `${host}/article/deleteAll` // 敏感词更刪除

/*信息发布-下拉框配置*/
export  const SelectGetTree = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/getTree` //  标题tabs
export const SelectGetDataByTypeId = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/getDataByTypeId`//  下拉框列表
export const selectByIdType = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/selectByIdType` // 单条下拉框查询
export const selectAddOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/addOneType` // 单条下拉框新增
export const selectUpdateOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/updateOneType` // 单条下拉框更新
export const selectDeleteOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/deleteOneType` // 单条下拉框删除
export const selectOptionList = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/deleteOneType` // 下拉框option列表

/*信息发布-行业数据*/
export const industryDataList = `IndustryData/list` //  数据表格
/* export const SelectGetDataByTypeId = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/getDataByTypeId`//  下拉框列表
export const selectByIdType = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/selectByIdType` // 单条下拉框查询*/
export const industryDataAddOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/addOneType` // 行业数据新增
export const industryDataUpdateOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/updateOneType` // 行业数据更新
export const industryDataDeleteOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/deleteOneType` // 行业数据删除
export const industryDataOptionList = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/deleteOneType` // 下拉框option列表

/*信息发布-轮播图*/
export  const swiperAll = `http://172.16.110.101:81/assoication_sjs/trzSensitive/selectAll` // 轮播图列表
export const swiperAddOne = `http://172.16.110.101:81/assoication_sjs/trzSensitive/addOne`//  轮播图添加
export const swiperUpdateOne = `http://172.16.110.101:81/assoication_sjs/trzSensitive/updateOne`//  轮播图更新
export const swiperDelete = `${host}/article/deleteAll` // 轮播图删除
export const swiperArticleOption = `${host}/article/deleteAll` // 轮播图文章选项
export const swiperVideoOption = `${host}/article/deleteAll` // 轮播图视频选项

/*视频专栏*/
export const videoAll = `http://172.16.110.101:81/assoication_sjs/trzSensitive/selectAll` // 轮播图列表
export const videoAddOne = `http://172.16.110.101:81/assoication_sjs/trzSensitive/addOne`//  轮播图添加
export const videoUpdateOne = `http://172.16.110.101:81/assoication_sjs/trzSensitive/updateOne`//  轮播图更新
export const videoDelete = `${host}/article/deleteAll` // 轮播图删除

/*服务库管理-项目库*/
export const proJectAll = `IndustryData/list` //  项目库数据
export const proJectUpdateOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/updateOneType` // 行业数据更新

/*服务库管理-资金产品库*/
export const fundAll = `IndustryData/list` //  资金产品库数据
export const fundUpdateOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/updateOneType` // 资金产品更新

/*服务库管理-其他服务库*/
export const otherAll = `IndustryData/list` //  资金产品库数据
export const otherUpdateOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/updateOneType` // 其他服务
export const otherDeleteOne = `http://172.16.110.101:81/assoication_sjs/trzDictionaries/deleteOneType` // 行业数据删除

/*活动管理-活动发布*/
export const actionAll = `${host}/activity/list` // 轮播图列表
export const actionAddOne = `${host}/activity/insert`//  轮播图添加
export const actionrUpdateOne = `${host}/activity/update`//  轮播图更新
export const actionDelete = `${host}/activity/delete` // 轮播图删除

/*活动管理-活动报名*/
export const activityApplyAll = `${host}/activityApply/list` // 轮播图列表
export const activityApplyAddOne = `${host}/activityApply/insert`//  轮播图添加
export const activityApplyrUpdateOne = `${host}/activityApply/update`//  轮播图更新
export const activityApplyDelete = `${host}/activityApply/delete` // 轮播图删除

/*招商服务-入住申请*/
export const businessApplyAll = `${host}/activityApply/list` // 轮播图列表
export const businessApplyAddOne = `${host}/activityApply/insert`//  轮播图添加
export const businessApplyUpdateOne = `${host}/activityApply/update`//  轮播图更新
export const businessApplyDelete = `${host}/activityApply/delete` // 轮播图删除

/*招商服务-企业评估*/
export const businessEstimateAll = `${host}/activityApply/list` // 轮播图列表
export const businessEstimateAddOne = `${host}/activityApply/insert`//  轮播图添加
export const businessEstimatUpdateOne = `${host}/activityApply/update`//  轮播图更新
export const businessEstimatDelete = `${host}/activityApply/delete` // 轮播图删除

// menu路由
export const getMenuByUserId = `${host}/sysResource/getMenuByUserId`
// 上传附件,图片,视频
export const upLoad = `${host}/upload`

/*系统管理-企业用户管理*/
export  const roleResourceList = `${host}/roleResource/list` // 企业用户列表

/*系统管理-账号管理*/
export  const sysUserSelectAll = `${host}/sysUser/selectAll` // 账号用户列表
export  const sysUserAddOne = `${host}/sysUser/addOne` // 账号用户列表
export  const sysUserDeleteOne = `${host}/sysUser/deleteOne` // 账号用户列表
export  const sysUserUpdateOne = `${host}/sysUser/updateOne` // 账号用户列

/*系统管理-角色管理*/
export  const sysRoleList = `${host}/sysRole/list` // 角色管理列表
export  const sysRoleParent = `${host}/sysRole/parent` // 角色管理列表
export  const sysRoleUpdate = `${host}/sysRole/update` // 角色更新
export  const sysRoleDelete = `${host}/sysRole/delete` // 角色删除
export  const sysRoleInsert = `${host}/sysRole/insert` // 角色插入

// 系统管理-系统日志
export  const sysLogSelectAll = `${host}/sysLog/selectAll` // 系统日志

// 系统管理-资源管理
export  const sysResourceList = `${host}/sysResource/list` // 资源管理列表 todo 接口返回有问题
export const treeTable = `${host}/sysResource/treeTable` // 树形结构
export const sysResourceInsert = `${host}/sysResource/insert` // 插入
export const sysResourceUpdate = `${host}/sysResource/update` // 更新
export const sysResourceDelete = `${host}/sysResource/delete` // 删除