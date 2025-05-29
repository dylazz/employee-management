import {createRouter, createWebHistory} from "vue-router";
import EmployeeIndex from "../components/views/EmployeeIndex.vue";
import EmployeeProfile from "../components/employee/EmployeeProfile.vue";

const router = createRouter({
    history:createWebHistory(),
    routes: [
        {
            path: "/",
            name: 'index',
            component: EmployeeIndex
        },
        {
            path: "/index",
            redirect: "/"
        },
        {
            path: '/employee/:id',
            name: 'employee-profile',
            component: EmployeeProfile,
            props: true,
        }
    ]
})

export default router;