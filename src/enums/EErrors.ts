/**
 * @enum EErrors
 */
export const enum EErrors {
  INVALID_ENGINE_NAME = 'new Suya({ engine: { name: [name], ... } }), [name] is invalid. Supported [name]: node-cache, redis, memcached. http://github.com/ridwanobafunso/suya#API',
  INVALID_CONFIGS_FOR_REDIS = "new Suya({ engine: { name: 'redis', configs: { } } }) redis configurations object is missing. http://github.com/ridwanobafunso/suya#API",
  INVALID_CONFIGS_FOR_MEMCACHED = "new Suya({ engine: { name: 'memcached', configs: { } } }) memcached configurations object is missing. http://github.com/ridwanobafunso/suya#API",
  FOREVER_INVALID_REQUEST_METHOD = 'new Suya().forever() middleware can only be use on GET request method. http://github.com/ridwanobafunso/suya#API',
  DURATION_INVALID_REQUEST_METHOD = 'new Suya().duration([n]) middleware can only be use on GET request method. http://github.com/ridwanobafunso/suya#API',
  RESETONMUTATE_INVALID_REQUEST_METHOD = 'new Suya().resetOnMutate({ [...] }) middleware can only be use on POST, PUT, PATCH, and DELETE request method. http://github.com/ridwanobafunso/suya#API',
  REDIS_ERRORS = '[REDIS]: {err}',
  MEMCACHED_UNABLE_TO_CONNECT = '[MEMCACHED]: Suya unable to connect to memcached!',
}
