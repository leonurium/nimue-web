export default () => {
    const router = useRouter()
    const navRoutes = () => useState('nav_routes')

    const register = (newRoutes: NavRoute[]) => {
        const navs = navRoutes()
        navs.value = newRoutes
    }

    function initRoute() {
        const routes: NavRoute[] = [
            {
                href: '/',
                icon: 'bi:house-door',
                active: false
            },
            {
                href: '/chats',
                icon: 'bi:chat-dots',
                active: false
            }
        ]

        //validate
        const routers = router.getRoutes()
        const routesValidated: NavRoute[] = []
        routes.forEach(route => {
            const foundR = routers.find(r => r.path === route.href)
            if(foundR) {
                routesValidated.push(route)
            }
        });

        //register route
        register(routesValidated)
    }

    function navBack() {
        router.back()
    }

    return {
        initRoute,
        navRoutes,
        navBack
    }
}

export interface NavRoute {
    label?: string;
    href: string;
    icon?: string;
    active: boolean;
}