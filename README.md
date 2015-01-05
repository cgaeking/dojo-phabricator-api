dojo-phabricator-api
====================

Dojo Toolkit based API to phabricator via conduit

This is an extremely simplified helper in order to connect to phabricator and run commands.
It is compatible to the most recent versions of phabricator.

Just copy the ecolony folder into your dojo folder. Get the certificate generated inside of the phabricator user management (generated per user).

Usage example:
	define(["dojo/_base/declare",
     		"ecolony/Conduit"], function(declare, Conduit) {

	    var phab = new Conduit(
						'eiomvl6pdyh727ocrcqweofpdo4390852oerfwopi983498ufeworifu09w8rwf098ufjoreiwfu09w87erf4566x2ceiuamq27kzkdg5tmtrnljugckchdi4cn4ki4rrqx2z6juc3yccplqvmqew879r08f7439fuz80ewr98zfuiwoeuqzoriqewrqwertqdfsvyhnerzertgretgertgpmqpkezm6tumegjxj7jd4i3fitg66uigj5xbpe7b',
						'testusername',
						'http://phabricatorurl.example.com/api'
					);
					
	    phab.query("maniphest.createtask",{ 
	      "title":"Testrequest",
	      "description":"Testdescription",
	      "projectPHIDs": ["PHID-PROJ-54932847590827431344"] 
	    });
	}
