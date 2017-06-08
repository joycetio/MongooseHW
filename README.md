# MongooseHW

# Live Link
https://mongoose-hw.herokuapp.com/

# To Scrape Articles on the Website
* Go to https://mongoose-hw.herokuapp.com/scrape 
* Then go back to the live link to see all the scraped articles!

# Instructions 
* Create an app that follows this user story: 
1. Whenever a user visits your site, the app will scrape stories from a news outlet of your choice. The data should at least include a link to the story and a headline. 
2. Use Cheerio to grab the site content and Mongoose to save it to your MongoDB database. 
3. All users can leave comments on the stories you collect. They should also be allowed to delete whatever comments they want removed. All stored comments should be visible to every user. 
4. You'll need to use Mongoose's model system to associate comments with partu=icular articles. 

# Technologies Used: 
* MongoDB
* Mongoose
* Cheerio
* NPM packages
* AJAX 
* JavaScript/jQuery

# Code Explanation: 
* Filtered out every 'a' tag that had a certain class, referring to the articles available on the website. 
```
$(this).filter(function(i, el) {
    if ($(this).attr('class') === '_2HBM5') {
        ...
    }
}
```

