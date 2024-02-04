const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let _id;

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
            _id = res.body._id;
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
      test('Test PUT /update one field on an issue', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: _id,
            status_text: 'need another day to fix'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal("successfully updated",  res.body.result);
            done();
          });
      });
      test('Test PUT /update multiple fields on an issue', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: _id,
            status_text: 'change person issue referred to',
            assigned_to: 'Alan'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal("successfully updated",  res.body.result);
            done();
          });
      });
      test('Test PUT /update issue with missing id', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: '',
            status_text: 'change person issue referred to',
            assigned_to: 'John'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal('missing_id',  res.body.error);
            done();
          });
      });
      test('Test PUT /update issue with no fields to update', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: _id           
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal('no update field(s) sent',  res.body.error);
            done();
          });
      });     test('Test PUT /update issue with invalid id', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: '015bfa29af7b37318ec98b0f6',
            status_text: 'ok then'         
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal('id not valid',  res.body.error);
            done();
          });
      });

});
