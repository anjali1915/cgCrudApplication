import { createWebHistory, createRouter } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';
import UserForm from "./components/UserForm.vue";
import EditForm from './components/EditForm.vue';
import DisplayTable from './components/DisplayTable.vue';
import LoginPage from './components/LoginPage.vue';
import api from './api/axiosSetup.js';
import type { ApiResponse, authUserPayload } from './types/interfaces.js';

const routes:Array<RouteRecordRaw> = [
    {
        name: 'UserForm',
        path: '/add-user',
        component: UserForm,
        meta: {requiresAuth: true, role: "admin"}
    },
    {
        name: 'EditForm',
        path: '/edit/:user_id',
        component: EditForm,
         meta: {requiresAuth: true, role: "admin"}
    },
    {
        name: 'DisplayTable',
        path: '/display',
        component: DisplayTable,
         meta: {requiresAuth: true, role: "admin"}
    },
    {
        name: 'LoginPage',
        path: '/',
        component: LoginPage,
         meta: {requiresAuth: false}
    }
];
const router = createRouter({
    history: createWebHistory(),//decides how URLs look/behave (clean URLs)
    routes
});

router.beforeEach(async (to,from,next)=>{
    const publicPages = ['/'];
    const authPage = !publicPages.includes(to.path);
    
    if( !authPage){
        return next();
    }
    try{
        await api.get<ApiResponse<authUserPayload>>('users/loginUserCheck')
         next();
    }catch(error){
        const err = error as Error;
        console.log(err);
        return next('/');
    } 
});
export default router;
