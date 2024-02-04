const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    test('Test POST /every field', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({
            issue_title: 'First Test',
            issue_text: 'posting every field',
            created_by: 'Jack',
            assigned_to: 'Jim',
            status_text: 'ongoing'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal('First Test', res.body.issue_title);
            assert.equal('posting every field', res.body.issue_text);
            assert.equal('Jack', res.body.created_by);
            assert.equal('Jim', res.body.assigned_to);
            assert.equal('ongoing', res.body.status_text);
            done();
          });
      });
      test('Test POST /only required fields', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({
            issue_title: 'Second Test',
            issue_text: 'posting only required fields',
            created_by: 'Jack',
            assigned_to: '',
            status_text: ''
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal('Second Test', res.body.issue_title);
            assert.equal('posting only required fields', res.body.issue_text);
            assert.equal('Jack', res.body.created_by);
            assert.equal('', res.body.assigned_to);
            assert.equal('', res.body.status_text);
            done();
          });
      });
      test('Test POST /with missing required fields', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({
            issue_title: 'Third Test',
            issue_text: 'missing created by field',
            created_by: '',
            assigned_to: '',
            status_text: ''
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
      });
      test('Test GET /all issues on a project', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/apitest')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 8);
            done();
          });
      });
      test('Test GET /issues with one filter', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/apitest?created_by=Derek')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 4);
            done();
          });
      });
      test('Test GET /issues with multiple filters', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/apitest?created_by=Derek&assigned_to=Mike&open=true')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 2);
            done();
          });
      });
});
