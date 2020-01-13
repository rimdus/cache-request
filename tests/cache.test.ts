import { Cache } from '../lib/component/cache';
import { assert } from 'chai';

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
    assert.equal(rep, 0);
  });

  it('check clone', () => {
    const obj = { a: { b: { c: { text: 123 } } } };
    cache.add({ action: 'clone' }, obj);
    obj.a.b.c.text = 456;
    const res = cache.get({ action: 'clone' });
    assert.notEqual(res.a.b.c.text, obj.a.b.c.text);
  });

  it('string key', () => {
    const obj = { a: 123 };
    cache.add('customstringkey', obj);
    const res = cache.get('customstringkey');
    assert.equal(res.a, obj.a);
  });

  it('custom conv key function', () => {
    const cache = new Cache({ keyConvertFn: (unique: any) => unique.uuid });
    const obj = { uuid: '123456789', data: { a: 8 } };
    cache.add(obj, obj);
    const res = cache.get(obj);
    cache.off();
    assert.equal(res.data.a, obj.data.a);
  });

  it('count', () => {
    const cache = new Cache();
    const obj = { a: 0 };
    for (let i = 0; i < 100; i++) {
      cache.add(obj, obj);
      obj.a += 1;
    }
    cache.off();
    assert.equal(cache.count(), 100);
  });
});
