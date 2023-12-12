import { createWebHistory, createRouter } from "vue-router";
import ProductList from './components/pages/ProductList';
import ProductCreate from './components/pages/ProductCreate';
import ProductEdit from './components/pages/ProductEdit';
import ProductShow from './components/pages/ProductShow';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
const BoardUser = () => import("./components/BoardUser.vue")

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: '/', 
            component: ProductList },
        { 
            path: '/all', 
            component: ProductList },
        { 
            path: '/create', 
            component: ProductCreate },
        { 
            path: '/edit/:id', 
            component: ProductEdit },
        { 
            path: '/show/:id', 
            component: ProductShow },
        {
            path: '/register',
            component: RegisterPage
        },
        {
            path: '/login',
            component: LoginPage
        },
        {
            path: "/user",
            name: "user",
            // lazy-loaded
            component: BoardUser,
        },
    ],
  });
  router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/home'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
      next('/login');
    } else {
      next();
    }
  });
export default router;
