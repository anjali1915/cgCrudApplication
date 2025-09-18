import { createWebHistory, createRouter } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';
import UserForm from "./components/UserForm.vue";
import EditForm from './components/EditForm.vue';
import DisplayTable from './components/DisplayTable.vue';
import LoginPage from './components/LoginPage.vue';


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

router.beforeEach((to,from,next)=>{
    const publicPages = ['/'];
    const authAuth = !publicPages.includes(to.path);
    const token = localStorage.getItem("token");
    if(authAuth && !token){
        return next('/');
    }
    else {
        next();
    }
});
export default router;
