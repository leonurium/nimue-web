export default () => {

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
        const router = useRouter().getRoutes()
        const routesValidated: NavRoute[] = []
        routes.forEach(route => {
            const foundR = router.find(r => r.path === route.href)
            if(foundR) {
                routesValidated.push(route)
            }
        });

        //register route
        register(routesValidated)
    }

    return {
        navRoutes,
        initRoute
    }
}

export interface NavRoute {
    label?: string;
    href: string;
    icon?: string;
    active: boolean;
}