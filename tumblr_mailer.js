var fs = require('fs');
var ejs = require('ejs');

// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'mBbcHqBG4PmruNc1GI8qlLKt3Y2RywyMBNpposSKKBVlGzI6j2',
  consumer_secret: 'mlYaUdEDaBMQTVxRndTjJxLaqbgmGRCy5UzET1jAez8rClS4Dk',
  token: '8QgmeS7DAPPET0XUTjcYnMT62fElECZsBYqA1VS0WN6nP4alfU',
  token_secret: 'TmRWbn85Q4wUenyBd9thTLW8PgwBYfONEH6EiB3Px2ah9qfwtc'
});
//mandrel account data
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('7kIvZ_B9dO37LfYADFkbLQ');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');
function csvParse(myfile){
	var friend_array=myfile.split("\n");
	var header_array=friend_array[0].split(",");
	var friend_arr_arr=[];
	var final_array=[];
	for (var i=1;i<friend_array.length;i++){
		friend_arr_arr.push(friend_array[i].split(","));
	}

	for (j=0;j<friend_arr_arr.length;j++){
		var myobj={};
		for (var k=0;k<friend_arr_arr[0].length;k++){
			var key=header_array[k];
			var value=friend_arr_arr[j][k];
			myobj[key]=value;
		}
		final_array.push(myobj);
	}
	return final_array;
}

csvData = csvParse(csvFile);

client.posts("ryancoding",function(err, blog){
  	var latestPosts=[];
  	blog.posts.forEach(function(post){
  	if (Date.now()-Date.parse(post.date)<604800000){
  		latestPosts.push(post);
  	}
  });

	csvData = csvParse(csvFile);
	 
	csvData.forEach(function(row){
		firstName = row['firstName'];
		numMonthsSinceContact = row['numMonthsSinceContact'];
		copyTemplate = emailTemplate;
			
		var customizedTemplate = ejs.render(copyTemplate, {firstName: firstName,
									   numMonthsSinceContact: numMonthsSinceContact,
									   latestPosts: latestPosts									
		});
 
		sendEmail(firstName, row["emailAddress"], "Ryan B.", "ryan.bronz@gmail.com", "testing", customizedTemplate);			
		
		});
	});

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
	var message = {
	    "html": message_html,
	    "subject": subject,
	    "from_email": from_email,
	    "from_name": from_name,
	    "to": [{
	            "email": to_email,
	            "name": to_name
	        }],
	    "important": false,
	    "track_opens": true,    
	    "auto_html": false,
	    "preserve_recipients": true,
	    "merge": false,
	    "tags": [
	        "Fullstack_Tumblrmailer_Workshop"
	    ]    
	};
	var async = false;
	var ip_pool = "Main Pool";
	mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
	    	      
	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
}
