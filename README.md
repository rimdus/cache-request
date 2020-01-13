# Cache request util

## Install

```
npm install cache-requestjs
```

## Description

This module provide in memory cache hot data for server requests like RESTFul. You should not come up with keys for
storing query results. Keys will be request's objects. This technology is based on casting the request object to 
a string, making it's hash (sha1, sha256, sha512 or murmur) and using it as a key.

You can create as many cache objects as you need, every cache has default ttl, and every cache element may have
its own ttl. When cache element's ttl has expired, memory is freed and element is deleted.

**Notice! Do not attempt to cache frequently changing data!**

## Example
```
import { Cache } from 'cache-requestjs';

const cache = new Cache({ ttl: 30 });

request(req)
.then((res) => {

  // add result from server to cache
  cache.add(req, res.body);
})

...
.then(() => {

  // load cached result by request
  const body = cache.get(req);
  // if not - go to the server
  if (!body) {
    return request(req)
  }
  return body;
})
.then((res) => {
  // working with result...
})

```

## API
```
import { Cache } from 'cache-requestjs';
const options: ICacheOptions;
const cache = new Cache(options);
```

### ICacheOptions

#### ttl

Time to live in seconds (60 sec default).

#### strategy

Add cache strategy
- UpdateExists - Always update cache and set new expires time
- AddNotExists - Only add not existing cache, that mean time will expare and you mast get new data from the server,
then put it to the cache

#### keyConvertFn

Custom convert function that makes keys.
```
const cache = new Cache({ keyConvertFn: (unique) => unique.uuid }})
```

#### isClone

The flag is responsible to clone the object or not. Default true.