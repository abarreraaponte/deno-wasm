import { queryParams, type QueryParams } from './../wayfinder'

/**
 * @see \App\Http\Controllers\Auth\AuthController::login
 * @see app/Http/Controllers/Auth/AuthController.php:10
 * @route /login
 */
export const login = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ['get','head'],
    url: '\/login',
}

/**
 * @see \App\Http\Controllers\Auth\AuthController::login
 * @see app/Http/Controllers/Auth/AuthController.php:10
 * @route /login
 */
login.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return login.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\Auth\AuthController::login
 * @see app/Http/Controllers/Auth/AuthController.php:10
 * @route /login
 */
login.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: login.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\Auth\AuthController::login
 * @see app/Http/Controllers/Auth/AuthController.php:10
 * @route /login
 */
login.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: login.url(options),
    method: 'head',
})

export default login