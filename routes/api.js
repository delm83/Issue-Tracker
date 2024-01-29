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
      let Issue = mongoose.model(project, issueSchema);
      await Issue.find((err, issue_list)=>{
        let log = [];
        for(let i=0; i<issue_list.length; i++){
          log.push({assigned_to: issue_list[i].assigned_to, status_text: issue_list[i].status_text, open: issue_list[i].open, _id: issue_list[i]._id, issue_title: issue_list[i].issue_title, issue_text: issue_list[i].issue_text, created_by: issue_list[i].created_by, created_on: issue_list[i].created_on, updated_on: issue_list[i].updated_on})
        }
        return res.json(log);
      });
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
