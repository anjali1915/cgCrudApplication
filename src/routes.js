import {createWebHistory, createRouter} from 'vue-router'

import UserForm from './components/UserForm.vue'
import EditForm from './components/EditForm.vue'
import DisplayTable from './components/DisplayTable'

const routes=[
    {
        name:'UserForm',
        path:'/',
        component: UserForm
    },
    {
        name:'EditForm',
        path:'/edit/:mobile',
        component: EditForm
    },
    {
        name:'DisplayTable',
        path:'/display',
        component:DisplayTable
    }
];
const router = createRouter({
    history:createWebHistory(),
    routes
})
export default router;