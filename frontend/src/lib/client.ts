// Code generated by the Encore v1.10.2 client generator. DO NOT EDIT.

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * BaseURL is the base URL for calling the Encore application's API.
 */
export type BaseURL = string

export const Local: BaseURL = "http://localhost:4000"

/**
 * Environment returns a BaseURL for calling the cloud environment with the given name.
 */
export function Environment(name: string): BaseURL {
    return `https://${name}-airbnb-mkg2.encr.app`
}

/**
 * Client is an API client for the airbnb-mkg2 Encore application. 
 */
export default class Client {
    public readonly booking: booking.ServiceClient
    public readonly graphql: graphql.ServiceClient
    public readonly listing: listing.ServiceClient
    public readonly payment: payment.ServiceClient
    public readonly user: user.ServiceClient


    /**
     * @deprecated This constructor is deprecated, and you should move to using BaseURL with an Options object
     */
    constructor(target: string, token?: string)

    /**
     * Creates a Client for calling the public and authenticated APIs of your Encore application.
     *
     * @param target  The target which the client should be configured to use. See Local and Environment for options.
     * @param options Options for the client
     */
    constructor(target: BaseURL, options?: ClientOptions)
    constructor(target: string | BaseURL = "prod", options?: string | ClientOptions) {

        // Convert the old constructor parameters to a BaseURL object and a ClientOptions object
        if (!target.startsWith("http://") && !target.startsWith("https://")) {
            target = Environment(target)
        }

        if (typeof options === "string") {
            options = { auth: options }
        }

        const base = new BaseClient(target, options ?? {})
        this.booking = new booking.ServiceClient(base)
        this.graphql = new graphql.ServiceClient(base)
        this.listing = new listing.ServiceClient(base)
        this.payment = new payment.ServiceClient(base)
        this.user = new user.ServiceClient(base)
    }
}

/**
 * ClientOptions allows you to override any default behaviour within the generated Encore client.
 */
export interface ClientOptions {
    /**
     * By default the client will use the inbuilt fetch function for making the API requests.
     * however you can override it with your own implementation here if you want to run custom
     * code on each API request made or response received.
     */
    fetcher?: Fetcher

    /**
     * Allows you to set the auth token to be used for each request
     * either by passing in a static token string or by passing in a function
     * which returns the auth token.
     *
     * These tokens will be sent as bearer tokens in the Authorization header.
     */
    auth?: string | AuthDataGenerator
}

export namespace booking {
    export interface InitiateParams {
        listingID: number
        checkin: string
        checkout: string
        guests: number
    }

    export interface InitiateResponse {
        RedirectURL: string
    }

    export class ServiceClient {
        private baseClient: BaseClient

        constructor(baseClient: BaseClient) {
            this.baseClient = baseClient
        }

        public async Initiate(params: InitiateParams): Promise<InitiateResponse> {
            // Now make the actual call to the API
            const resp = await this.baseClient.callAPI("POST", `/booking.Initiate`, JSON.stringify(params))
            return await resp.json() as InitiateResponse
        }
    }
}

export namespace graphql {

    export class ServiceClient {
        private baseClient: BaseClient

        constructor(baseClient: BaseClient) {
            this.baseClient = baseClient
        }

        public async Playground(method: string, body?: BodyInit, options?: CallParameters): Promise<Response> {
            return this.baseClient.callAPI(method, `/graphql/playground`, body, options)
        }

        public async Query(method: string, body?: BodyInit, options?: CallParameters): Promise<Response> {
            return this.baseClient.callAPI(method, `/graphql`, body, options)
        }
    }
}

export namespace listing {
    export interface ListResponse {
        Listings: Listing[]
    }

    /**
     * Listing represents a home listing.
     */
    export interface Listing {
        id: number
        title: string
        description: string
        location: string
        numBeds: number
        numBaths: number
        /**
         * Lat, Lng are the latitude and longitude of the home.
         */
        lat: number

        lng: number
        hostUID: string
        created: string
        pricePerNight: number
        rating: number
        pictures: Pictures
        tags: Tags
        distanceKm: number
    }

    export type Pictures = string[]

    export type Tags = string[]

    export class ServiceClient {
        private baseClient: BaseClient

        constructor(baseClient: BaseClient) {
            this.baseClient = baseClient
        }

        /**
         * Create creates a new listing.
         */
        public async Create(params: Listing): Promise<Listing> {
            // Now make the actual call to the API
            const resp = await this.baseClient.callAPI("POST", `/listing`, JSON.stringify(params))
            return await resp.json() as Listing
        }

        /**
         * List returns all listings.
         */
        public async List(): Promise<ListResponse> {
            // Now make the actual call to the API
            const resp = await this.baseClient.callAPI("GET", `/listing`)
            return await resp.json() as ListResponse
        }

        /**
         * ListForUser returns all listings for a user.
         */
        public async ListForUser(uid: string): Promise<ListResponse> {
            // Now make the actual call to the API
            const resp = await this.baseClient.callAPI("GET", `/listing/user/${encodeURIComponent(uid)}`)
            return await resp.json() as ListResponse
        }
    }
}

export namespace payment {

    export class ServiceClient {
        private baseClient: BaseClient

        constructor(baseClient: BaseClient) {
            this.baseClient = baseClient
        }

        public async StripeWebhook(method: string, body?: BodyInit, options?: CallParameters): Promise<Response> {
            return this.baseClient.callAPI(method, `/payment.StripeWebhook`, body, options)
        }
    }
}

export namespace user {
    export interface BeforeCreateWebhookParams {
        SharedSecret: string
        User: User
    }

    /**
     * User represents a user, who is either a host or a guest.
     */
    export interface User {
        ID: string
        /**
         * Email is the user's email.
         */
        Email: string

        /**
         * Name is the user's name.
         */
        DisplayName: string

        /**
         * PictureURL is the user's picture URL.
         */
        PictureURL: string
    }

    export class ServiceClient {
        private baseClient: BaseClient

        constructor(baseClient: BaseClient) {
            this.baseClient = baseClient
        }

        /**
         * BeforeCreateWebhook processes webhooks from Firebase when a user is created.
         */
        public async BeforeCreateWebhook(params: BeforeCreateWebhookParams): Promise<void> {
            // Convert our params into the objects we need for the request
            const headers: Record<string, string> = {
                "x-shared-secret": params.SharedSecret,
            }

            // Construct the body with only the fields which we want encoded within the body (excluding query string or header fields)
            const body: Record<string, any> = {
                User: params.User,
            }

            await this.baseClient.callAPI("POST", `/user.BeforeCreateWebhook`, JSON.stringify(body), {headers})
        }
    }
}



function encodeQuery(parts: Record<string, string | string[]>): string {
    const pairs = []
    for (const key in parts) {
        const val = (Array.isArray(parts[key]) ?  parts[key] : [parts[key]]) as string[]
        for (const v of val) {
            pairs.push(`${key}=${encodeURIComponent(v)}`)
        }
    }
    return pairs.join("&")
}
// CallParameters is the type of the parameters to a method call, but require headers to be a Record type
type CallParameters = Omit<RequestInit, "method" | "body"> & {
    /** Any headers to be sent with the request */
    headers?: Record<string, string>;

    /** Any query parameters to be sent with the request */
    query?: Record<string, string | string[]>
}

// AuthDataGenerator is a function that returns a new instance of the authentication data required by this API
export type AuthDataGenerator = () => (string | undefined)

// A fetcher is the prototype for the inbuilt Fetch function
export type Fetcher = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

class BaseClient {
    readonly baseURL: string
    readonly fetcher: Fetcher
    readonly headers: Record<string, string>
    readonly authGenerator?: AuthDataGenerator

    constructor(baseURL: string, options: ClientOptions) {
        this.baseURL = baseURL
        this.headers = {
            "Content-Type": "application/json",
            "User-Agent":   "airbnb-mkg2-Generated-TS-Client (Encore/v1.10.2)",
        }

        // Setup what fetch function we'll be using in the base client
        if (options.fetcher !== undefined) {
            this.fetcher = options.fetcher
        } else {
            this.fetcher = fetch
        }

        // Setup an authentication data generator using the auth data token option
        if (options.auth !== undefined) {
            const auth = options.auth
            if (typeof auth === "function") {
                this.authGenerator = auth
            } else {
                this.authGenerator = () => auth                
            }
        }

    }

    // callAPI is used by each generated API method to actually make the request
    public async callAPI(method: string, path: string, body?: BodyInit, params?: CallParameters): Promise<Response> {
        // eslint-disable-next-line prefer-const
        let { query, ...rest } = params ?? {}
        const init = {
            ...rest,
            method,
            body: body ?? null,
        }

        // Merge our headers with any predefined headers
        init.headers = {...this.headers, ...init.headers}

        // If authorization data generator is present, call it and add the returned data to the request
        let authData: string | undefined
        if (this.authGenerator) {
            authData = this.authGenerator()
        }

        // If we now have authentication data, add it to the request
        if (authData) {
            init.headers["Authorization"] = "Bearer " + authData
        }

        // Make the actual request
        const queryString = query ? '?' + encodeQuery(query) : ''
        const response = await this.fetcher(this.baseURL+path+queryString, init)

        // handle any error responses
        if (!response.ok) {
            // try and get the error message from the response body
            let body: APIErrorResponse = { code: ErrCode.Unknown, message: `request failed: status ${response.status}` }

            // if we can get the structured error we should, otherwise give a best effort
            try {
                const text = await response.text()

                try {
                    const jsonBody = JSON.parse(text)
                    if (isAPIErrorResponse(jsonBody)) {
                        body = jsonBody
                    } else {
                        body.message += ": " + JSON.stringify(jsonBody)
                    }
                } catch {
                    body.message += ": " + text
                }
            } catch (e) {
                // otherwise we just append the text to the error message
                body.message += ": " + String(e)
            }

            throw new APIError(response.status, body)
        }

        return response
    }
}

/**
 * APIErrorDetails represents the response from an Encore API in the case of an error
 */
interface APIErrorResponse {
    code: ErrCode
    message: string
    details?: any
}

function isAPIErrorResponse(err: any): err is APIErrorResponse {
    return (
        err !== undefined && err !== null && 
        isErrCode(err.code) &&
        typeof(err.message) === "string" &&
        (err.details === undefined || err.details === null || typeof(err.details) === "object")
    )
}

function isErrCode(code: any): code is ErrCode {
    return code !== undefined && Object.values(ErrCode).includes(code)
}

/**
 * APIError represents a structured error as returned from an Encore application.
 */
export class APIError extends Error {
    /**
     * The HTTP status code associated with the error.
     */
    public readonly status: number

    /**
     * The Encore error code
     */
    public readonly code: ErrCode

    /**
     * The error details
     */
    public readonly details?: any

    constructor(status: number, response: APIErrorResponse) {
        // extending errors causes issues after you construct them, unless you apply the following fixes
        super(response.message);
        
        // set error name as constructor name, make it not enumerable to keep native Error behavior
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target#new.target_in_constructors
        Object.defineProperty(this, 'name', {
            value:        'APIError',
            enumerable:   false,
            configurable: true,
        })
        
        // fix the prototype chain
        if ((Object as any).setPrototypeOf == undefined) { 
            (this as any).__proto__ = APIError.prototype 
        } else {
            Object.setPrototypeOf(this, APIError.prototype);
        }
        
        // capture a stack trace
        if ((Error as any).captureStackTrace !== undefined) {
            (Error as any).captureStackTrace(this, this.constructor);
        }

        this.status = status
        this.code = response.code
        this.details = response.details
    }
}

/**
 * Typeguard allowing use of an APIError's fields'
 */
export function isAPIError(err: any): err is APIError {
    return err instanceof APIError;
}

export enum ErrCode {
    /**
     * OK indicates the operation was successful.
     */
    OK = "ok",

    /**
     * Canceled indicates the operation was canceled (typically by the caller).
     *
     * Encore will generate this error code when cancellation is requested.
     */
    Canceled = "canceled",

    /**
     * Unknown error. An example of where this error may be returned is
     * if a Status value received from another address space belongs to
     * an error-space that is not known in this address space. Also
     * errors raised by APIs that do not return enough error information
     * may be converted to this error.
     *
     * Encore will generate this error code in the above two mentioned cases.
     */
    Unknown = "unknown",

    /**
     * InvalidArgument indicates client specified an invalid argument.
     * Note that this differs from FailedPrecondition. It indicates arguments
     * that are problematic regardless of the state of the system
     * (e.g., a malformed file name).
     *
     * This error code will not be generated by the gRPC framework.
     */
    InvalidArgument = "invalid_argument",

    /**
     * DeadlineExceeded means operation expired before completion.
     * For operations that change the state of the system, this error may be
     * returned even if the operation has completed successfully. For
     * example, a successful response from a server could have been delayed
     * long enough for the deadline to expire.
     *
     * The gRPC framework will generate this error code when the deadline is
     * exceeded.
     */
    DeadlineExceeded = "deadline_exceeded",

    /**
     * NotFound means some requested entity (e.g., file or directory) was
     * not found.
     *
     * This error code will not be generated by the gRPC framework.
     */
    NotFound = "not_found",

    /**
     * AlreadyExists means an attempt to create an entity failed because one
     * already exists.
     *
     * This error code will not be generated by the gRPC framework.
     */
    AlreadyExists = "already_exists",

    /**
     * PermissionDenied indicates the caller does not have permission to
     * execute the specified operation. It must not be used for rejections
     * caused by exhausting some resource (use ResourceExhausted
     * instead for those errors). It must not be
     * used if the caller cannot be identified (use Unauthenticated
     * instead for those errors).
     *
     * This error code will not be generated by the gRPC core framework,
     * but expect authentication middleware to use it.
     */
    PermissionDenied = "permission_denied",

    /**
     * ResourceExhausted indicates some resource has been exhausted, perhaps
     * a per-user quota, or perhaps the entire file system is out of space.
     *
     * This error code will be generated by the gRPC framework in
     * out-of-memory and server overload situations, or when a message is
     * larger than the configured maximum size.
     */
    ResourceExhausted = "resource_exhausted",

    /**
     * FailedPrecondition indicates operation was rejected because the
     * system is not in a state required for the operation's execution.
     * For example, directory to be deleted may be non-empty, an rmdir
     * operation is applied to a non-directory, etc.
     *
     * A litmus test that may help a service implementor in deciding
     * between FailedPrecondition, Aborted, and Unavailable:
     *  (a) Use Unavailable if the client can retry just the failing call.
     *  (b) Use Aborted if the client should retry at a higher-level
     *      (e.g., restarting a read-modify-write sequence).
     *  (c) Use FailedPrecondition if the client should not retry until
     *      the system state has been explicitly fixed. E.g., if an "rmdir"
     *      fails because the directory is non-empty, FailedPrecondition
     *      should be returned since the client should not retry unless
     *      they have first fixed up the directory by deleting files from it.
     *  (d) Use FailedPrecondition if the client performs conditional
     *      REST Get/Update/Delete on a resource and the resource on the
     *      server does not match the condition. E.g., conflicting
     *      read-modify-write on the same resource.
     *
     * This error code will not be generated by the gRPC framework.
     */
    FailedPrecondition = "failed_precondition",

    /**
     * Aborted indicates the operation was aborted, typically due to a
     * concurrency issue like sequencer check failures, transaction aborts,
     * etc.
     *
     * See litmus test above for deciding between FailedPrecondition,
     * Aborted, and Unavailable.
     */
    Aborted = "aborted",

    /**
     * OutOfRange means operation was attempted past the valid range.
     * E.g., seeking or reading past end of file.
     *
     * Unlike InvalidArgument, this error indicates a problem that may
     * be fixed if the system state changes. For example, a 32-bit file
     * system will generate InvalidArgument if asked to read at an
     * offset that is not in the range [0,2^32-1], but it will generate
     * OutOfRange if asked to read from an offset past the current
     * file size.
     *
     * There is a fair bit of overlap between FailedPrecondition and
     * OutOfRange. We recommend using OutOfRange (the more specific
     * error) when it applies so that callers who are iterating through
     * a space can easily look for an OutOfRange error to detect when
     * they are done.
     *
     * This error code will not be generated by the gRPC framework.
     */
    OutOfRange = "out_of_range",

    /**
     * Unimplemented indicates operation is not implemented or not
     * supported/enabled in this service.
     *
     * This error code will be generated by the gRPC framework. Most
     * commonly, you will see this error code when a method implementation
     * is missing on the server. It can also be generated for unknown
     * compression algorithms or a disagreement as to whether an RPC should
     * be streaming.
     */
    Unimplemented = "unimplemented",

    /**
     * Internal errors. Means some invariants expected by underlying
     * system has been broken. If you see one of these errors,
     * something is very broken.
     *
     * This error code will be generated by the gRPC framework in several
     * internal error conditions.
     */
    Internal = "internal",

    /**
     * Unavailable indicates the service is currently unavailable.
     * This is a most likely a transient condition and may be corrected
     * by retrying with a backoff. Note that it is not always safe to retry
     * non-idempotent operations.
     *
     * See litmus test above for deciding between FailedPrecondition,
     * Aborted, and Unavailable.
     *
     * This error code will be generated by the gRPC framework during
     * abrupt shutdown of a server process or network connection.
     */
    Unavailable = "unavailable",

    /**
     * DataLoss indicates unrecoverable data loss or corruption.
     *
     * This error code will not be generated by the gRPC framework.
     */
    DataLoss = "data_loss",

    /**
     * Unauthenticated indicates the request does not have valid
     * authentication credentials for the operation.
     *
     * The gRPC framework will generate this error code when the
     * authentication metadata is invalid or a Credentials callback fails,
     * but also expect authentication middleware to generate it.
     */
    Unauthenticated = "unauthenticated",
}
