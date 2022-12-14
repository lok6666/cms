/** When your routing table is too long, you can split it into small modules**/

import Layout from "@/layout/index.vue";

const permissionRouter = {
    path: '/permission',
    component: Layout,
    redirect: 'noRedirect',
    name: 'permission',
    alwaysShow: true, // 总是显示根目录
    meta: {
        title: '权限测试页',
        roles:['other']
    },
    children: [
        {
            path: 'page',
            component: () => import('@/views/permission/page.vue'),
            name: 'page',
            meta: { title: '页面权限', roles:['other']  }
        },
    ]
}

export default permissionRouter
