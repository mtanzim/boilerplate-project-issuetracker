/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

let globalId = null;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          // console.log(res.body);
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          globalId = res.body._id;
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'status_text');
          assert.property(res.body, 'open');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in',
            // assigned_to: 'Chai and Mocha',
            // status_text: 'In QA'
          })
          .end(function (err, res) {
            // console.log(res.body);
            assert.equal(res.status, 200);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'status_text');
            assert.property(res.body, 'open');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            done();
          });
        
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
          })
          .end(function (err, res) {
            // console.log(res.body);
            assert.equal(res.status, 500);
/*             assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'status_text');
            assert.property(res.body, 'open');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on'); */
            done();
          });
      });
      
    });

    suite('DELETE /api/issues/{project} => text', function () {

      test('No _id', function (done) {
        chai.request(server)
          .delete('/api/issues/test')
          .end(function (err, res) {
            // console.log(res.status);
            assert.equal(res.status, 500);
            done();
          });
      });

      test('Valid _id', function (done) {
        chai.request(server)
          .delete(`/api/issues/${globalId}`)
          .end(function (err, res) {
            // console.log(res.text);
            // console.log(globalId);
            assert.equal(res.status, 200);
            assert.equal(res.text, `Deleted ${globalId}`, 'Right ID deleted!');
            done();
          });
        // Deleted 5b6082fb70f6b32f10011565

      });

    });
    


  suite('GET /api/issues/{project} => Array of objects with issue data', function () {

    test('No filter', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
    });

    test('One filter', function (done) {

    });

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {

    });

  });

    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        
      });
      
      test('One field to update', function(done) {
        
      });
      
      test('Multiple fields to update', function(done) {
        
      });
      
    });



});
