'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});

  let Schema = mongoose.Schema;

  let issueSchema = new Schema({
    issue_title: {
      type: String,
      required: true
    },
    issue_text: {
      type: String,
      required: true
    },
    created_by: {
      type: String,
      required: true
    },
    assigned_to: String,
    status_text: String,
    created_on: Date,
    updated_on: Date,
    open: {
    type: Boolean,
    default: true}
 });


  app.route('/api/issues/:project')
  
  .get(async (req, res)=>{
    try{
    let project = req.params.project;
    let query_list={"status_text":undefined, "open":undefined, "_id":undefined, "issue_title":undefined, "issue_text":undefined, "created_by":undefined, "assigned_to":undefined, "created_on":undefined, "updated_on":undefined}
    for(let field in query_list){
    query_list[field] = req.query[field];
    if(!query_list[field]){delete query_list[field];}
    }
    let Issue = mongoose.model(project, issueSchema);
    let issue_list = await Issue.find(query_list).select({__v: 0});
      return res.json(issue_list);
  } catch(err){return res.json({error: err})}
  })
    
    .post(async (req, res)=>{
      try{
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema);
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let status_text = req.body.status_text;

      if(!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      if(!assigned_to){assigned_to = ''}
      if(!status_text){status_text = ''}

      let inputIssue = new Issue({
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        created_on: new Date(),
        updated_on: new Date()
    });

    await inputIssue.save();

    res.json({assigned_to: inputIssue.assigned_to, status_text: inputIssue.status_text, open: inputIssue.open, _id: inputIssue.id, issue_title: inputIssue.issue_title, issue_text: inputIssue.issue_text, created_by: inputIssue.created_by, created_on: inputIssue.created_on, updated_on: inputIssue.updated_on})

    }catch(err){return res.json({error: err})}
    })
       
    .put(async (req, res)=>{
      try{
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema);
      let _id = req.body._id;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let status_text = req.body.status_text;
      let open = req.body.open;

      if(!_id) {
        return res.json({ error: 'missing _id' });
      }

let inputIssue = await Issue.findById(_id);
if(inputIssue){
if(!issue_title&&!issue_text&&!created_by&&!assigned_to&&!status_text&!open){return res.json({ error: 'no update field(s) sent', '_id': _id });}
if(issue_title){inputIssue.issue_title = issue_title}
if(issue_text){inputIssue.issue_text = issue_text}
if(created_by){inputIssue.created_by = created_by}
if(assigned_to){inputIssue.assigned_to = assigned_to}
if(status_text){inputIssue.status_text = status_text}
if(open){inputIssue.open = open}
inputIssue.updated_on = new Date();
await inputIssue.save();
return res.json({ result: 'successfully updated', '_id': _id })
}
else{return res.json({ error: 'could not update', '_id': _id } );}
}catch(err){return res.json({error: 'id not valid'})}
    })
    
    .delete(async (req, res)=>{
      try{
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema);
      let _id = req.body._id;

      if(!_id) {
        return res.json({ error: 'missing _id' });
      }

      Issue.findByIdAndRemove(_id, (err, issue)=> {
        if (err) {
          return res.json({ error: 'id not valid', '_id': _id });
        }
        else {
          return res.json({ result: 'successfully deleted', '_id': _id });
        }
    });
      }catch(err){return res.json({error: 'could not delete', '_id': _id})}
    });
    
};
