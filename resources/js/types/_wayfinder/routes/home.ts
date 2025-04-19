import { queryParams, type QueryParams } from './../wayfinder'

/**
 * @see \App\Http\Controllers\Web\HomeController::home
 * @see app/Http/Controllers/Web/HomeController.php:15
 * @route /home
 */
export const home = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ['get','head'],
    url: '\/home',
}

/**
 * @see \App\Http\Controllers\Web\HomeController::home
 * @see app/Http/Controllers/Web/HomeController.php:15
 * @route /home
 */
home.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\Web\HomeController::home
 * @see app/Http/Controllers/Web/HomeController.php:15
 * @route /home
 */
home.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: home.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\Web\HomeController::home
 * @see app/Http/Controllers/Web/HomeController.php:15
 * @route /home
 */
home.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: home.url(options),
    method: 'head',
})

export default home