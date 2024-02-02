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
            created_by: 'Derek',
            assigned_to: 'Jim',
            status_text: 'ongoing'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal('First Test', res.body.issue_title);
            assert.equal('posting every field', res.body.issue_text);
            assert.equal('Derek', res.body.created_by);
            assert.equal('Jim', res.body.assigned_to);
            assert.equal('ongoing', res.body.status_text);
            done();
          });
      });
});
