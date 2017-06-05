import demand from 'must'

import { Store } from './store';

describe('Store', () => {
  it('can can be created', () => {
    const store = new Store()
  })

  it('can store a single value using name', () => {
    const store = new Store()
    store.set('cheese', 'ham')
    demand(store.get('cheese')).must.equal('ham')
  })

  it('can store a single value using object', () => {
    const store = new Store()
    store.set({cheese: 'ham'})
    demand(store.get('cheese')).must.equal('ham')
  })

  it('can store a multiple values using object', () => {
    const store = new Store()
    store.set({cheese: 'ham', pea: 'pod'})
    demand(store.get('cheese')).must.equal('ham')
    demand(store.get('pea')).must.equal('pod')
  })

  it('can notify a single listener by name', done => {
    const store = new Store()

    store.register('cheese', value => {
      demand(value).must.equal('ham')
      done()
    })

    store.set('cheese', 'ham')
  })

  it('can notify a single listener by object', done => {
    const store = new Store()

    store.register('cheese', value => {
      demand(value).must.equal('ham')
      done()
    })

    store.set({cheese: 'ham'})
  })

  it('notifies when all registers complete settings by name', done => {
    const store = new Store()
    const completed = {
      a: false,
      b: false
    }

    store.register('cheese', value => {
      completed.a = true
    })
    store.register('cheese', value => {
      completed.b = true
    })

    store.set('cheese', 'ham', () => {
      demand(completed.a).must.be.true()
      demand(completed.b).must.be.true()
      done()
    })
  })

  it('notifies when all registers complete setting by object', done => {
    const store = new Store()
    const completed = {
      a: false,
      b: false
    }

    store.register('cheese', value => {
      completed.a = true
    })
    store.register('cheese', value => {
      completed.b = true
    })

    store.set({cheese: 'ham'}, () => {
      demand(completed.a).must.be.true()
      demand(completed.b).must.be.true()
      done()
    })
  })

  it('can unregister', done => {
    const store = new Store()
    let count = 0
    const unregister = store.register('cheese', value => {
      if (count === 0) {
        demand(value).must.equal('ham')
      } else {
        throw new Error('I should not be called a 2nd time!')
      }
      count++
    })

    store.set('cheese', 'ham')
    unregister()
    store.set('cheese', 'peas', done)
  })

  it('can notify multiple listener by name', done => {
    const [a, b, c] = all(done, 3)
    const store = new Store()

    store.register('cheese', value => { demand(value).must.equal('ham'); a()})
    store.register('cheese', value => { demand(value).must.equal('ham'); b()})
    store.register('cheese', value => { demand(value).must.equal('ham'); c()})

    store.set('cheese', 'ham')
  })

  it('can notify multiple listener by object', done => {
    const [a, b, c] = all(done, 3)
    const store = new Store()

    store.register('cheese', value => { demand(value).must.equal('ham'); a()})
    store.register('cheese', value => { demand(value).must.equal('ham'); b()})
    store.register('cheese', value => { demand(value).must.equal('ham'); c()})

    store.set({cheese: 'ham'})
  })

  describe('multi listeners', () => {
    it('S:{A,B} => N:{A,B}, N:A, N:B', done => {
      const [x, y, z] = all(done, 3)
      const store = new Store()
      store.registerMany(['A', 'B'], ({A, B}) => {
        demand(A).must.equal(1)
        demand(B).must.equal(2)
        x()
      })
      store.register('A', value => { demand(value).must.equal(1); y()})
      store.register('B', value => { demand(value).must.equal(2); z()})

      store.set({A: 1, B: 2})
    })

    it('S:{A,B} => N:{B,C}', done => {
      const store = new Store({c: 3})
      store.registerMany(['B', 'C'], ({B, C}) => {
        demand(B).must.equal(2)
        demand(C).must.be.undefined()
        done()
      })

      store.set({A: 1, B: 2})
    })

    it('should call a multi-callback only once', done => {
      const [y, z] = all(done, [1, 1])
      const store = new Store({c: 3})
      store.registerMany(['A', 'B'], ({A, B}) => {
        demand(A).must.equal(1)
        demand(B).must.equal(2)
        y()
      })

      store.set({A: 1, B: 2}, z)
    })
  })
})

function all (done, countOrExpected) {
  const callbacks = (Array.isArray(countOrExpected) ? countOrExpected : [...new Array(countOrExpected)])
    .map(expected => {
      const cb = () => {
        cb.times++

        // if (times !== undefined && cb.times > times) {
        //   throw new Error(`Callback was exptected to be called ${times} times but was called for the ${cb.times} time`)
        // }
        if (cb.expected !== undefined && cb.times > cb.expected) {
          throw new Error(`Callback was exptected to be called ${cb.expected} times but was called for the ${cb.times} time`)
        }
        const tests = callbacks.map(x => {
          const res = (x.expected !== undefined ? (x.times === x.expected) : (x.times >= 1))
          return res
        })

        if (tests.every(x => x)) {
          done()
        }
      }
      cb.expected = expected
      cb.times = 0
      return cb
    })
  return callbacks
}
