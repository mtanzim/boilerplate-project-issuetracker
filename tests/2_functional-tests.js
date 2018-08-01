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

const allFields = {
  issue_title: 'Title',
  issue_text: 'text',
  created_by: 'Functional Test - Every field filled in',
  assigned_to: 'Chai and Mocha',
  status_text: 'In QA',
};

const partialFields = {
  issue_title: 'Title',
  issue_text: 'text',
  created_by: 'Functional Test - Every field filled in',
  // assigned_to: 'Chai and Mocha',
  // status_text: 'In QA'
};


const missingFields = {
  issue_title: 'Title',
};

const oneFilter = { open: 'true' };
const multiFilter = { open: 'true', issue_title: 'Title' };



function chaiValidation (resolve, toResolve, status=500, isArr=false) {
  return function (err, res) {
    let serverResponse = res.body;
    if (isArr) serverResponse = res.body[0];

    assert.equal(res.status, status);
    if (status===200){
      assert.property(serverResponse, '_id');
      assert.property(serverResponse, 'issue_title');
      assert.property(serverResponse, 'issue_text');
      assert.property(serverResponse, 'created_by');
      assert.property(serverResponse, 'assigned_to');
      assert.property(serverResponse, 'status_text');
      assert.property(serverResponse, 'open');
      assert.property(serverResponse, 'created_on');
      assert.property(serverResponse, 'updated_on');
    }
    resolve(toResolve || res.body._id);
  }

}


function chaiGet(fields) {
  return new Promise(function (resolve, reject) {
    chai.request(server)
      .get('/api/issues/test')
      .query(fields)
    // function chaiValidation(resolve, toResolve, status = 500, isArr = false) {
      .end(chaiValidation(resolve, 'OK',200, true))
  });

}



function chaiPost(fields, isValid=true) {
  let statusToResolve = 500;
  let messageToResolve = "OK";
  if (isValid) {
    statusToResolve = 200;
  }
  return new Promise( function (resolve, reject) { 
    chai.request(server)
    .post('/api/issues/test')
    .send(fields)
    // function chaiValidation(resolve, toResolve, status = 500, isArr = false) {
    .end(chaiValidation(resolve,undefined,statusToResolve, false))
  });

}

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
        chaiPost(allFields)
          .then( res=> {
            // console.log(res);
            globalId = res;
            assert.isTrue(true, 'Filler workarund for wrapper');
            done();
          });
      });
      
      test('Required fields filled in', function(done) {
        chaiPost(partialFields)
          .then(res => {
            // console.log(res);
            assert.isTrue(true, 'Filler workarund for wrapper');
            done();
          });
        
      });
      
      test('Missing required fields', function(done) {
        chaiPost(missingFields, false)
          .then(res => {
            // console.log(res);
            assert.isTrue(true, 'Filler workarund for wrapper');
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

      chaiGet({})
        .then(res => {
          assert.isTrue(true, 'Filler workarund for wrapper');
          done();
        });
    });

    test('One filter', function (done) {

      chaiGet(oneFilter)
        .then(res => {
          assert.isTrue(true, 'Filler workarund for wrapper');
          done();
        });
    });

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {

      chaiGet(multiFilter)
        .then(res => {
          // console.log(res);
          // globalId = res;
          assert.isTrue(true, 'Filler workarund for wrapper');
          done();
        });
    });

  });

/*     suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        
      });
      
      test('One field to update', function(done) {
        
      });
      
      test('Multiple fields to update', function(done) {
        
      });
      
    }); */



});
