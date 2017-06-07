var mongoose = require("mongoose");
//creates Schema class
var Schema = mongoose.Schema; 

//creates Article schema
var ArticleSchema = new Schema({
	title: {
		type: String, 
		require: true
	}, 
	link: {
		type: String,
		require: true
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

//create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema); 

//exports the model
module.exports = Article;