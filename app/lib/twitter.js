/*-------------------------------------------------------------------*/
/*                                                                   */
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*                                                                   */
/*-------------------------------------------------------------------*/
/*                                                                   */
/*        NOTICE TO USERS OF THE SOURCE CODE EXAMPLES                */
/*                                                                   */
/* The source code examples provided by IBM are only intended to     */
/* assist in the development of a working software program.          */
/*                                                                   */
/* International Business Machines Corporation provides the source   */
/* code examples, both individually and as one or more groups,       */
/* "as is" without warranty of any kind, either expressed or         */
/* implied, including, but not limited to the warranty of            */
/* non-infringement and the implied warranties of merchantability    */
/* and fitness for a particular purpose. The entire risk             */
/* as to the quality and performance of the source code              */
/* examples, both individually and as one or more groups, is with    */
/* you. Should any part of the source code examples prove defective, */
/* you (and not IBM or an authorized dealer) assume the entire cost  */
/* of all necessary servicing, repair or correction.                 */
/*                                                                   */
/* IBM does not warrant that the contents of the source code         */
/* examples, whether individually or as one or more groups, will     */
/* meet your requirements or that the source code examples are       */
/* error-free.                                                       */
/*                                                                   */
/* IBM may make improvements and/or changes in the source code       */
/* examples at any time.                                             */
/*                                                                   */
/* Changes may be made periodically to the information in the        */
/* source code examples; these changes may be reported, for the      */
/* sample code included herein, in new editions of the examples.     */
/*                                                                   */
/* References in the source code examples to IBM products, programs, */
/* or services do not imply that IBM intends to make these           */
/* available in all countries in which IBM operates. Any reference   */
/* to the IBM licensed program in the source code examples is not    */
/* intended to state or imply that IBM's licensed program must be    */
/* used. Any functionally equivalent program may be used.            */
/*-------------------------------------------------------------------*/


var request = require('request');
var consumerKey = 'insert consumer key here';
var consumerSecret = 'insert consumer secret here';
var bearerToken;


function authenticate (cb) {
// authenticates by getting bearer token from twitter using consumer key and 
//    consumer secret supplied above. 

	if (bearerToken) return cb(null, bearerToken); // return cached copy

	// store options for use during request.
	var options = {
		url: 'https://api.twitter.com/oauth2/token',
		auth: {
			'user': consumerKey,
			'pass': consumerSecret
		},
		form: {
			'grant_type': 'client_credentials'
		}
	};


	// POST to twitter REST endpoint to get Bearer Token
	request.post(options, function (err, res, body) {
		if (err) return cb(err);

		bearerToken = JSON.parse(body).access_token;
		cb(null, bearerToken);
	});
}


exports.getResults = function (keyword, count, result_type, cb) {
// query twitter's search API getting results related to keyword
//		the number supplied in count signifies the number of results to be returned
//		the value supplied in "result_type" signifies the type of tweets to be returned.
//      proper values are "popular", "mixed", or "recent"

	authenticate(function (err, bearer) {
		var options = {
			url: 'https://api.twitter.com/1.1/search/tweets.json',
			qs: {
				'q': keyword,
				'count': count,
				'result_type': result_type
			},
			headers: {
				Authorization: 'Bearer ' + bearer
			}
		};

		request.get(options, function (err, res, body) {
			if (err) return cb(err);

			if (res.statusCode != 200) {
				return cb({ error: 'Status code: ' + res.statusCode });
			}

			return cb(null, JSON.parse(body));
		});
	});
};