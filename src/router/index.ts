import {createRouter, createWebHistory} from "vue-router";
import EmployeeIndex from "../components/views/EmployeeIndex.vue";

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
        }
    ]
})

export default router;