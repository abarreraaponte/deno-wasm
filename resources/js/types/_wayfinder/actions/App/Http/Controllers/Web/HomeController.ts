import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \App\Http\Controllers\Web\HomeController::HomeController
 * @see app/Http/Controllers/Web/HomeController.php:15
 * @route /home
 */
const HomeController = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: HomeController.url(options),
    method: 'get',
})

HomeController.definition = {
    methods: ['get','head'],
    url: '\/home',
}

/**
 * @see \App\Http\Controllers\Web\HomeController::HomeController
 * @see app/Http/Controllers/Web/HomeController.php:15
 * @route /home
 */
HomeController.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return HomeController.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\Web\HomeController::HomeController
 * @see app/Http/Controllers/Web/HomeController.php:15
 * @route /home
 */
HomeController.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: HomeController.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\Web\HomeController::HomeController
 * @see app/Http/Controllers/Web/HomeController.php:15
 * @route /home
 */
HomeController.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: HomeController.url(options),
    method: 'head',
})

export default HomeController