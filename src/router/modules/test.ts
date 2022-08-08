import Layout from "@/layout/index.vue";
/*const testRouter =  
      {
        "path": "/system",
        "name": "系统管理",
        meta: {
            title: '系统管理',
            icon: 'trend-charts',
            roles:['other']
        },
         component: Layout,
         redirect: 'noRedirect',
        "children": [
          {
            "resourceId": "2c16808b8b6a4cccbff9bfcae3c1a437",
            component: () => import('@/views/nested/menu1/menu1-1/index.vue'),
            "name": "角色管理",
            meta: { title: '角色管理',roles:['other'] },
            "path": "/system/rolelist",
          },
          {
            "resourceId": "b801470076984b718eae315aa90636ea",
            component: () => import('@/views/nested/menu1/menu1-2/index.vue'),
            "name": "资源管理",
            meta: { title: '资源管理',roles:['other'] },
            "path": "/system/resource"
          }
        ],
        "permissions": null,
        "userId": null,
        "roleId": null
      }
*/
const testRouter = {
  "children": [
      {
          "children": [],
          "meta": {
              "icon": "",
              "keepAlive": true,
              "title": "企业用户"
          },
          "name": "comprehensive",
          "parentId": "3e507b3ba4ad40a2be4cefa82bd373e1",
          "path": "comprehensive",
          "resourceId": "7b2557d6ec7a4a98b3b8c78009dd29c2"
      },
      {
          "children": [],
          "meta": {
              "icon": "",
              "keepAlive": true,
              "title": "账号管理"
          },
          "name": "inline-table",
          "parentId": "3e507b3ba4ad40a2be4cefa82bd373e1",
          "path": "inline-table",
          "resourceId": "a89a664f1b324a859b7457b00cedf899"
      },
      {
          "children": [],
          "meta": {
              "icon": "",
              "keepAlive": true,
              "title": "角色管理"
          },
          "name": "edit-table",
          "parentId": "3e507b3ba4ad40a2be4cefa82bd373e1",
          "path": "edit-table",
          "resourceId": "b5f0f539d0c24d2e90649a76c99e1606"
      }
  ],
  "meta": {
      icon: 'trend-charts',
      "keepAlive": true,
      "title": "系统管理"
  },
  "name": "table",
  "parentId": "parent",
  "path": "/table",
  "resourceId": "3e507b3ba4ad40a2be4cefa82bd373e1"
}
export default testRouter

