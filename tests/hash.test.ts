import { Cache } from '../lib/component/cache';

let cache: Cache;

describe('cache', () => {
  it('new', () => {
    cache = new Cache({ ttl: 0 });
    return (typeof cache === 'object');
  });

  it('add 100 000 caches no repeat', () => {
    const obj = {
      action: 'action',
      service: { name: 'ServiceName' },
      entity: { name: 'EntityName', query: { a: 1, b: 2, c: 3, x: 0 } },
    };
    const hash = {};
    let rep = 0;
    for (let i = 0; i < 10000; i++) {
      obj.entity.query.x = i;
      const h = cache.add(obj, true);
      if (hash[h]) {
        rep++;
        console.log('Repeat', h);
      }
      hash[h] = true;
    }
    if (rep) console.log('Repeats:', rep);
    cache.off();
    return rep === 0;
  });
});
