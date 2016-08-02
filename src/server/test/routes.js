const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const test = require('tape');

test('GET /health', t => {
  api
  .get('/health')
  .expect('Content-type', /json/)
  .expect(200)
  .end((err, res) => {
    if (err) {
      t.fail(err);
      t.end();
    } else {
      t.ok(res.body, 'It should have a response body');
      t.equals(res.body.healthy, true, 'It should return a healthy parameter and it should be true');
      t.end();
    }
  })
})

test('GET /docker', t => {
  api
  .get('/docker')
  .expect('Content-type', /json/)
  .expect(200)
  .end((err, res) => {
    if (err) {
      t.fail(err);
      t.end();
    } else {
      t.ok(res.body, 'It should have a response body');
      t.equals(res.body.docker, 'rocks!', 'It should return a docker parameter with a value rocks!');
      t.end();
    }
  });
});

test('GET unknown route', t => {
  api
  .get(`/${Math.random() * 10}`)
  .expect(200)
  .end((err, res) => {
    if (err) {
      t.fail(err);
      t.end();
    } else {
      t.ok(res.text, 'It should have a response text');
      t.equals(res.text.slice(0, 15), '<!DOCTYPE html>', 'It should send the index file on unknown routes')
      t.end()
    }
  })
})