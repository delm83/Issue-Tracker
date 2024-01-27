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
    created_on: String,
    updated_on: String,
    open: {
    type: Boolean,
    default: false}
 });

 let Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
