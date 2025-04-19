import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \App\Http\Controllers\Auth\Auth0Controller::redirect
 * @see app/Http/Controllers/Auth/Auth0Controller.php:20
 * @route /auth/auth0/redirect
 */
export const redirect = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ['get','head'],
    url: '\/auth\/auth0\/redirect',
}

/**
 * @see \App\Http\Controllers\Auth\Auth0Controller::redirect
 * @see app/Http/Controllers/Auth/Auth0Controller.php:20
 * @route /auth/auth0/redirect
 */
redirect.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return redirect.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\Auth\Auth0Controller::redirect
 * @see app/Http/Controllers/Auth/Auth0Controller.php:20
 * @route /auth/auth0/redirect
 */
redirect.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: redirect.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\Auth\Auth0Controller::redirect
 * @see app/Http/Controllers/Auth/Auth0Controller.php:20
 * @route /auth/auth0/redirect
 */
redirect.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: redirect.url(options),
    method: 'head',
})

/**
 * @see \App\Http\Controllers\Auth\Auth0Controller::callback
 * @see app/Http/Controllers/Auth/Auth0Controller.php:30
 * @route /auth/auth0/callback
 */
export const callback = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ['get','head'],
    url: '\/auth\/auth0\/callback',
}

/**
 * @see \App\Http\Controllers\Auth\Auth0Controller::callback
 * @see app/Http/Controllers/Auth/Auth0Controller.php:30
 * @route /auth/auth0/callback
 */
callback.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return callback.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\Auth\Auth0Controller::callback
 * @see app/Http/Controllers/Auth/Auth0Controller.php:30
 * @route /auth/auth0/callback
 */
callback.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: callback.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\Auth\Auth0Controller::callback
 * @see app/Http/Controllers/Auth/Auth0Controller.php:30
 * @route /auth/auth0/callback
 */
callback.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: callback.url(options),
    method: 'head',
})

const Auth0Controller = { redirect, callback }

export default Auth0Controller