// var expect = require('chai').expect;
// var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

function checkEmpty(string) {
  return string.replace(/\s/g, "") == "";
}

module.exports = function (app, db) {

  app.route('/api/issues/:project')

    .get(function (req, res, next) {

      // console.log(req.query);

      // console.log({ ...req.query, ...req.params});
      let toFind = { ...req.query, ...req.params };

      if (toFind.open !== undefined) {
        if (toFind.open.toLowerCase() === 'true') toFind.open = true;
        else toFind.open = false;
      }
      // console.log (toFind);

      db.collection(process.env.DB_COL)
        .find(toFind)
        .sort([['updated_on', -1]])
        // .project({ 'comments': 0 })
        .toArray((err, doc) => {
          if (err) return next(err);
          return res.json(doc);
        });


    })
    .post(function (req, res, next) {
      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to || "";
      let status_text = req.body.status_text || "";

      if (
        checkEmpty(project) ||
        checkEmpty(issue_title) ||
        checkEmpty(issue_text) ||
        checkEmpty(created_by)
      ) return next(new Error(`Please provide missing parameter!`));


      db.collection(process.env.DB_COL)
        .insert({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open: true,
          created_on: new Date(),
          updated_on: new Date(),
        }, (err, doc) => {
          if (err) return next(err);
          if (!doc.result.ok || doc.result.n !== 1 || !doc.ops[0]) return next(new Error('Document insert error'));
          return res.json(doc.ops[0]);
        });
    })

    .put(function (req, res, next) {
      // console.log(req.body); 
      // console.log({ ...req.body, updated_on: new Date() }); 
      let toUpdateId = ObjectId(req.params.project);
      db.collection(process.env.DB_COL)
        .updateOne({ _id: toUpdateId },
          { $set: { ...req.body, updated_on: new Date() } },
          (err, doc) => {
            if (err) return next(err);
            // return res.json(doc.result);
            if (doc.result.n === 1 && doc.result.nModified === 1 && doc.result.ok === 1) { 
              return res.send('successfully updated');
            } else {
              return res.send(`Could not update ${req.params.project}`);
            } 
          });
    })

    .delete(function (req, res, next) {
      if (checkEmpty(req.params.project)) return next(new Error('_id error'));
      var toDelId = ObjectId(req.params.project);
      // console.log(toDelId);
      db.collection(process.env.DB_COL)
        .remove({ _id: toDelId }, function (err, doc) {
          if (err) return next(err);
          // console.log(doc.result);
          if (doc.result.n === 1 && doc.result.ok === 1) return res.send(`Deleted ${req.params.project}`);
          else return next(new Error(`Could not delete ${req.params.project}`));
        });

    });

};
