var mongoose = require("mongoose"); 
//create schema class 
var Schema = mongoose.Schema; 

//Create the Note schema 
var NoteSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	}
}); 

//create the Note model with the NoteSchema 
var Note = mongoose.model("Note", NoteSchema); 

//export the model 
module.exports = Note; 