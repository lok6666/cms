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
export  const articlePpdateOne = `${host}/article/updateOne` // 文章内容


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