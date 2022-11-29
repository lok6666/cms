//export const host =  process.env.NODE_ENV === 'development'? "http://172.16.4.62:28182": "http://enterprise.bjwcxf.com:28191";
export const host = "http://enterprise.bjwcxf.com:28191";
// 登录接口
export const login = `${host}/auth/login`
export const reset = `${host}/auth/reset`

/*信息发布-文章发布*/
export  const articleSelectArticle = `${host}/article/selectTAL` //  文章类型
export  const articleSelectAll = `${host}/article/list` //  文章列表
export  const articleDelete = `${host}/article/deleteAll` // 文章删除
export  const articleRecycle = `${host}/article/selectRecycleBin` // 回收站文章
export  const articleSelectById = `${host}/article/get` // 文章内容
export  const articleUpdateOne = `${host}/article/update` // 文章内容
export  const articleMoveUp = `${host}/article/moveUp` // 文章上移
export  const articleMoveDown = `${host}/article/moveDown` // 文章下移
export  const articleArticleAelectCircle = `${host}/articletype/selectType` // 文章类型 
export  const articleArticleAddOne = `${host}/article/insert` // 新增
export const policyPulishDetaill = `${host}`;

/*信息发布-敏感词*/
export  const sensitiveSelectAll = `${host}/sensitive/list` //  文章列表
export const sensitiveAddOne = `${host}/sensitive/insert`//  敏感词添加
export const sensitiveUpdateOne = `${host}/sensitive/update`//  敏感词更新
export const sensitiveDelete = `${host}/sensitive/delete` // 敏感词更刪除

/*信息发布-下拉框配置*/
export  const SelectGetTree = `${host}/assoication_sjs/trzDictionaries/getTree` //  标题tabs
export const SelectGetDataByTypeId = `${host}/assoication_sjs/trzDictionaries/getDataByTypeId`//  下拉框列表
export const selectByIdType = `${host}/assoication_sjs/trzDictionaries/selectByIdType` // 单条下拉框查询
export const selectAddOne = `${host}/assoication_sjs/trzDictionaries/addOneType` // 单条下拉框新增
export const selectUpdateOne = `${host}/assoication_sjs/trzDictionaries/updateOneType` // 单条下拉框更新
export const selectDeleteOne = `${host}/assoication_sjs/trzDictionaries/deleteOneType` // 单条下拉框删除
export const selectOptionList = `${host}/assoication_sjs/trzDictionaries/deleteOneType` // 下拉框option列表

/*信息发布-行业数据*/
export const industryDataList = `${host}/banner/list` //  数据表格
/* export const SelectGetDataByTypeId = `${host}/assoication_sjs/trzDictionaries/getDataByTypeId`//  下拉框列表
export const selectByIdType = `${host}/assoication_sjs/trzDictionaries/selectByIdType` // 单条下拉框查询*/
export const industryDataAddOne = `${host}/banner/insert` // 行业数据新增
export const industryDataUpdateOne = `${host}/banner/update` // 行业数据更新
export const industryDataDeleteOne = `${host}/article/deleteAll` // 行业数据删除
export const industryDataOptionList = `${host}/assoication_sjs/trzDictionaries/deleteOneType` // 下拉框option列表

/*信息发布-*/
export  const swiperAll = `${host}/banner/list` // 列表
export const swiperAddOne = `${host}/banner/insert`//  添加
export const swiperUpdateOne = `${host}/trzSensitive/updateOne`//  更新
export const swiperDelete = `${host}/article/deleteAll` // 删除
export const swiperArticleOption = `${host}/article/deleteAll` // 文章选项
export const swiperVideoOption = `${host}/article/deleteAll` // 视频选项

/*信息发布-站内信*/
export  const messageList = `${host}/message/list` // 角色管理列表
export  const messageInsertBatch = `${host}/message/insertBatch` // 角色管理列表

/*视频专栏*/
export const videoAll = `${host}/assoication_sjs/trzSensitive/selectAll` // 列表
export const videoAddOne = `${host}/assoication_sjs/trzSensitive/addOne`//  添加
export const videoUpdateOne = `${host}/assoication_sjs/trzSensitive/updateOne`//  更新
export const videoDelete = `${host}/article/deleteAll` // 删除

/*服务库管理-行业课程管理*/
export const trainingServicesAll = `${host}/trainingServices/list` //  行业数据数据
export const trainingServicesUpdateOne = `${host}/trainingServices/update` // 行业数据更新
export const trainingServicesDeleteOne = `${host}/trainingServices/delete` // 行业数据删除
export const trainingServicesInsert = `${host}/trainingServices/insert` // 行业新增

/*服务库管理-金融服务管理*/
export const financialServicesAll = `${host}/financialServices/list` //  金融数据
export const financialServicesUpdateOne = `${host}/financialServices/update` // 金融更新
export const financialServicesDeleteOne = `${host}/financialServices/delete` // 金融删除
export const financialServicesInsert = `${host}/financialServices/insert` // 行业新增

/*服务库管理-灵活用工管理*/
export const recruitServiceDockingAll = `${host}/recruitServiceDocking/list` //  金融数据
export const recruitServiceDockingUpdateOne = `${host}/recruitServiceDocking/update` // 金融更新
export const recruitServiceDockingDeleteOne = `${host}/recruitServiceDocking/delete` // 金融删除
export const recruitServiceDockingInsert = `${host}/recruitServiceDocking/insert` // 行业新增

/*服务库管理-企业服务管理*/
export const entServicesAll = `${host}/entServices/listBack` //  金融数据
export const entServicesUpdateOne = `${host}/entServices/update` // 金融更新
export const entServicesDeleteOne = `${host}/entServices/delete` // 金融删除
export const entServicesInsert = `${host}/entServices/insert` // 行业新增

/*服务库管理-企业服务管理*/
export const buildingsAll = `${host}/buildings/list` //  金融数据
export const buildingsUpdateOne = `${host}/buildings/update` // 金融更新
export const buildingsDeleteOne = `${host}/buildings/delete` // 金融删除
export const buildingsInsert = `${host}/buildings/insert` // 行业新增

/*服务库管理-服务对接管理*/
export const entServiceDockingAll = `${host}/entServiceDocking/list` //
export const entServiceDockingUpdate = `${host}/entServiceDocking/update` //


/*政策申报*/
export const policyApplyList = `${host}/policyApply/list`// 获取活动详情


/*政策推送*/
export const policyPush = `${host}/policy/policyPush`// 获取活动详情

/*企业信息-企业标签*/
export  const policyMatchList = `${host}/policyMatchTags/list` // 信息列表
export  const policyMatchTagsUpdate = `${host}/policyMatchTags/update` // 政策匹配企业标签列表

/*意向企业-企业招商意向名单导入*/
export  const entMerchantsList = `${host}/entMerchantsList/list` // 企业信息导入
export  const entMerchantsInsert = `${host}/entMerchantsList/insert` // 企业信息导入
export  const entMerchantsUpdate = `${host}/entMerchantsList/update` // 企业信息导入
export  const entMerchantsdelete = `${host}/entMerchantsList/delete` // 企业信息删除
export  const entMerchantsImportExcel = `${host}/entMerchantsList/importExcel` // 企业信息导入

/*入驻企业-企业招商意向名单导入*/
export  const entMerchantsSuccessList = `${host}/entMerchantsSuccessList/list` // 企业信息导入
export  const entMerchantsSuccessListInsert = `${host}/entMerchantsSuccessList/insert` // 企业信息导入
export  const entMerchantsSuccessListUpdate = `${host}/entMerchantsSuccessList/update` // 企业信息导入
export  const entMerchantsSuccessListdelete = `${host}/entMerchantsSuccessList/delete` // 企业信息删除
export  const entMerchantsSuccessListImportExcel = `${host}/entMerchantsSuccessList/importExcel` // 企业信息导入

/*招商意向名单名称导入*/
export  const entMerchantsPersonList = `${host}/entMerchants/list` // 企业信息导入
export  const entMerchantsPersonInsert = `${host}/entMerchants/insert` // 企业信息新增
export  const entMerchantsPersondelete = `${host}/entMerchants/delete` // 企业信息导入

/*入驻企业-意向企业-过程跟踪*/
export  const entDynamicList = `${host}/entDynamic/list` // 企业信息导入
export  const entDynamicInsert = `${host}/entDynamic/insert` // 企业信息新增

/*服务库管理-供应商管理*/
export const suppliersAll = `${host}/supplier/list` //  金融数据
export const suppliersUpdateOne = `${host}/supplier/update` // 金融更新
export const suppliersDeleteOne = `${host}/supplier/delete` // 金融删除
export const suppliersInsert = `${host}/supplier/insert` // 行业新增

/*服务库管理-资金产品库*/
export const fundAll = `${host}/financialServiceDocking/list` //  资金产品库数据
export const fundUpdateOne = `${host}/financialServiceDocking/update` // 资金产品更新

/*服务库管理-其他服务库*/
export const otherAll = `${host}IndustryData/list` //  资金产品库数据
export const otherUpdateOne = `${host}/assoication_sjs/trzDictionaries/updateOneType` // 其他服务
export const otherDeleteOne = `${host}/assoication_sjs/trzDictionaries/deleteOneType` // 行业数据删除

/*活动管理-活动发布*/
export const actionAll = `${host}/activity/list` // 列表
export const actionAddOne = `${host}/activity/insert`//  添加
export const actionrUpdateOne = `${host}/activity/update`//  更新
export const actionDelete = `${host}/activity/delete` // 删除

/*企业信息*/
export const entInfoAll = `${host}/entUser/list` // 基本信息列表
export const entInfoUpdate = `${host}/entUser/update` // 基本信息更新
export const entInfoGet = `${host}/entUser/get` // 基本信息详情
export const entPropagateAll = `${host}/entPropagate/list` // 宣传资料列表
export const entPropagateGet = `${host}/entPropagate/get` // 宣传资料详情
export const entPropagateUpdate = `${host}/entPropagate/update` // 宣传资料列表
export const entIncomeAll = `${host}/entIncome/list` // 财税数据列表
export const entIncomeGet = `${host}/entIncome/get` // 财税数据详情

export const entFilingAll = `${host}/entFiling/list` // 企业备案列表
export const entFilingGet = `${host}/entFiling/get` // 企业备案详情

/*政策发布*/
export  const policyUpdate = `${host}/policyTags/update` //  文章类型
export  const policyDetail = `${host}/policyTags/get` //  政策详情
export  const policyList = `${host}/policyTags/listAdmin` //  政策列表
export  const policyInsert = `${host}/policyTags/insert` //  政策列表
export  const policyUpload = `${host}/upload` //  上传


/*政策申报-课程报名*/
export const policyApplyById = `${host}/policyApply/get`// 获取活动详情
export const policyApplyUpdateOne = `${host}/policyApply/update`//  更新
export const policyApplyInsert = `${host}/policyApply/insert`//  插入

/*政策关联*/
export  const policyTagList = `${host}/policyTags/listNoPage` //  政策解读列表
export  const policyTagInsert = `${host}/policyRelation/insert` //  政策解读关联新增
export  const policyRelationList = `${host}/policyRelation/list` //  关联信息
export  const policyFileInsert = `${host}/policyRelation/insertByPolicyIds` //  政策文件insert接口
export  const policyFilelistByNoticeId = `${host}/policyRelation/listByNoticeId` //  详情页关联信息接口

/*标签列表*/
export  const industryCodeList = `${host}/industryCode/list` //  标签列表
export  const personInsert = `${host}/policyPerson/insert` //  标签列表

/*活动管理-活动报名*/
export const activityApplyAll = `${host}/activityApply/list` // 轮播图列表
export const activityApplyAddOne = `${host}/activityApply/insert`//  轮播图添加
export const activityApplyrUpdateOne = `${host}/activityApply/update`//  轮播图更新
export const activityApplyDelete = `${host}/activityApply/delete` // 轮播图删除

/*招商服务-活动申请*/
export const businessApplyAll = `${host}/activityApply/list` // 轮播图列表
export const businessApplyAddOne = `${host}/activityApply/insert`//  轮播图添加
export const businessApplyUpdateOne = `${host}/activityApply/update`//  轮播图更新
export const businessApplyDelete = `${host}/activityApply/delete` // 轮播图删除

/*招商服务-入住申请*/
export const entApplyAll = `${host}/entApply/list` // 轮播图列表
export const entApplAddOne = `${host}/entApply/insert`//  轮播图添加
export const entApplyUpdateOne = `${host}/entApply/update`//  轮播图更新
export const entApplyDelete = `${host}/entApply/delete` // 轮播图删除
export const entGetByName = `${host}/ent/getByName` // 轮播图删除
export const entPatentGet = `${host}/ent/getPatentByName` // 获取企业专利信息数据
export const engetRecruitByName = `${host}/ent/getRecruitByName` // 根据企业名称获取招聘数据
export const entgetSoftByName = `${host}/ent/getSoftByName` // 根据企业名称获取软著数据
export const entgetTrademarkByName = `${host}/ent/getTrademarkByName` // 根据企业名称获取商标数据
export const entgetWorksByName = `${host}/ent/getWorksByName` // 根据企业名称获取作品著作权数据
export const entgetRecruitByName = `${host}/ent/getRecruitByName` // 根据企业名称获取招聘数据
export const entgetNewsByName = `${host}/ent/getNewsByName` // 根据企业名称获取舆情数据
export const entAppraise = `${host}/entAppraise/getByName` // 根据企业名称获取评价

/*招商服务-企业评估*/
export const businessEstimateAll = `${host}/entList/list` // 轮播图列表
export const businessEstimateAddOne = `${host}/entList/insert`//  轮播图添加
export const businessEstimatUpdateOne = `${host}/entList/update`//  轮播图更新
export const businessEstimatDelete = `${host}/entList/delete` // 轮播图删除

/*招商服务-招商效果*/
export const fincialDataStatistics = `${host}/fincialDataStatistics/getByName` // 轮播图删除

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