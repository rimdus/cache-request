import { Hash } from '../component/hash';
import { performance } from 'perf_hooks';

const obj = {
  // action: 'select',
  // service: { name: 'Emergency'},
  entity: { name: 'Sms', query: { a: 1, b: 2, c: 3, x: 0 } },
};

function check() {
  const hash = {};
  let rep = 0;
  console.log('check');
  for (let i = 0; i < 10000; i++) {
    obj.entity.query.x = i;
    const start = performance.now();
    const h = Hash.generate(JSON.stringify(obj));
    const end = performance.now();
    console.log('Total time', (end - start));
    if (hash[h]) {
      rep++;
      console.log('Repeat', h);
    }
    hash[h] = true;
  }
  console.log('Total rep', rep);
}

setTimeout(() => {
  check();

  setTimeout(() => {
    check();
  }, 3000);
//  console.log('Total time', (end - start));

}, 500);
