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
    assigned_to: {
    type: String,
    defualt: ''
    },
    status_text: {
    type: String,
    default: ''},
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
    if(query_list[field]==undefined){delete query_list[field];}
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
       
    .put(function (req, res){
      let project = req.params.project;
    })
    
    .delete(function (req, res){
      let project = req.params.project;
    });
    
};
