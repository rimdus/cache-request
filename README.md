# Cache request util

## Example
```
import { Cache } from 'cache-request';

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