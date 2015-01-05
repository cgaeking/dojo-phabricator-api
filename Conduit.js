define([
	"dojo/_base/declare",
	"dojo/json",
	"dojox/encoding/digests/SHA1"
], function(declare, json, SHA1){

	// e-colony Phabricator-Conduit Connector

	var Conduit = declare("ecolony.Conduit", null, {
		cert: "",
		user: "",
		phabUrl: "",
		url:"",
		token: null,
		signature: "",
		params: null,
		session: null,
		csrf: null,
		
		constructor: function(cert,user,phabUrl){
			this.initConnection(cert,user,phabUrl);
			
		},
		initConnection: function(cert,user,phabUrl) {
			this.cert=cert;
			this.user=user;
			this.phabUrl=phabUrl;
			this.token=Math.round(new Date()/1000);
			this.signature=SHA1(this.token+this.cert, dojox.encoding.digests.outputTypes.Hex);
			this.params={
				    'client': 'e-colony Conduit',
				    'clientVersion': 1,
				    'clientDescription': 'Conduit Connector',
				    'user': this.user,
				    'host': this.phabUrl,
				    'authToken': this.token,
				    'authSignature': this.signature
			}
		},
		query: function(action, localparams) {
			var self=this;
			var post = {    "params": json.stringify(self.params),
                                        __conduit__:true };
			dojo.xhrPost({
			    url: self.phabUrl+"/conduit.connect",
			    handleAs: "json",
			    postData: post,
				
			    preventCache: true,
			    load: function(response){
					var r = response.result;
					self.session = {
					    'sessionKey': response.result.sessionKey,
					    'connectionID': response.result.connectionID
					    //'userPHID': response.result.userPHID
					};
					dojo.xhrGet({
						url: self.phabUrl+"/../login/refresh/",
						handleAs: "text",
						load: function(result) {
							self.csrf=json.parse(result.substr(result.indexOf("{"))).payload.token;
							console.debug(self.csrf);
							dojo.xhrPost({
	                            url: self.phabUrl+"/"+action,
	    	                    handleAs: "json",
	            	            postData: {
									"params":json.stringify(localparams),
									"__conduit__":json.stringify(self.session),
									"__csrf__":self.csrf,
									"output":"json"
	            	            },
	
	                            preventCache: true,
	    	                    load: function(response){
	    	                    	console.debug("OK",response);
	            	            },
	                    	    error: function(error){
	                               	console.debug("ERR",error);
	    	                    }
	            	        });
						}
					});

			    },
			    error: function(error){
			    	console.debug("ERR",error);
			    }
			});
		}
	});

	return Conduit;
});
