'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});

  let Schema = mongoose.Schema;

  let issueSchema = new Schema({
    title: {
    type: String,
    required: true,
   },
    text: {
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

 let Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(async (req, res)=>{
      try{
      let project = req.params.project;
      let title = req.body.issue_title;
      let text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let status_text = req.body.status_text;

      let inputIssue = new Issue({
        title: title,
        text: text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        created_on: new Date(),
        updated_on: new Date()
    });

    await inputIssue.save();

    res.json({_id: inputIssue.id, title: inputIssue.title, text: inputIssue.text, created_by: inputIssue.created_by, assigned_to: inputIssue.assigned_to, status_text: inputIssue.status_text, created_on: inputIssue.created_on, updated_on: inputIssue.updated_on, open: inputIssue.open})

    }catch(err){return res.json({error: err})}
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
