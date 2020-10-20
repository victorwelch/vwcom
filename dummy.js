<?xml version="1.0"?>
<publishData>
	<publishProfile profileName="victorwelch.com - Web Deploy" publishMethod="MSDeploy" 
	publishUrl="https://victorwelch.com:8172/msdeploy.axd?site=victorwelch.com" msdeploySite="victorwelch.com" userName="myvictorwelch" destinationAppUrl="http://victorwelch.com" controlPanelLink="https://p3nwvpweb025.shr.prod.phx3.secureserver.net:8443"/>
</publishData>

active=true^published<=javascript:gs.endOfToday()

var dtmPubB4 = "2020-05-01";

var resultList = [];
var kbtext = '';
var tmpStr='';
var strStart,strEnd;
var gr = new GlideRecord('kb_knowledge');
gr.addActiveQuery();
gr.addQuery('workflow_state', 'published');
gr.orderBy('number');
gr.query()
while (gr.next()) {
	kbtext = gr.text.toString();
	strStart=kbtext.indexOf('<a');
	while (strStart>-1) {
	   strEnd=kbtext.indexOf('</a',strStart);
	   if (strEnd>-1) {
			var tmpStr=kbtext.slice(strStart,strEnd);
			resultList.push({
				"number": gr.number,
				"link": tmpStr				
			})
	   }
	   strStart=kbtext.indexOf('<a');
	}
}
gs.info('{0}',resultList.length);



    grCount.addQuery('sys_created_on', '<', dtmEnd);
	
	active=true^publishedISNOTEMPTY
	
'<a'
'</a'	

var ctr=0;
var resultList = [];
var kbtext = '';
var tmpStr='';
var strStart,strEnd;
var gr = new GlideRecord('kb_knowledge');
gr.addActiveQuery();
gr.addQuery('workflow_state', 'published');
gr.orderDesc('number');
gr.query()
while (gr.next()) {
	var kbnumber=gr.number.toString();
	var resultItem = {
		"number": kbnumber,
		"linkList": []
	};
	kbtext = gr.text.toString();
	strStart=kbtext.indexOf('<a',0);
	while (strStart>-1) {
	   strEnd=kbtext.indexOf('</a',strStart);
	   if (strEnd>-1) {
			var tmpStr=kbtext.slice(strStart,strEnd+4);
			resultItem.linkList.push(tmpStr);
	   }
	   strStart=kbtext.indexOf('<a',strEnd+5);
	}
        resultList.push(resultItem);
}
gs.info('{0}',JSON.stringify(resultList));
gs.info('{0}',JSON.stringify(resultList));

<a title="Qualtrics" href="https://uta.qualtrics.com" target="_blank">Qualtrics</a>


go.uta.edu/KB0010649

https://uta.service-now.com/selfservice2?id=kbar&kbnumber=kb0011170
utassp01_kb_article&sys_id=69717be6db1fff000ed7dbf0ce96194d&pageid=utassp02_kbs


https://uta.service-now.com/kb_view.do?sysparm_article=kb0010817

var ctr=0;
var resultList = [];
var kbtext = '';
var tmpStr='';
var strStart,strEnd;
var gr = new GlideRecord('kb_knowledge');
gr.addActiveQuery();
gr.addQuery('workflow_state', 'published');
gr.orderDesc('number');
gr.query()
while (gr.next()) {
	var kbnumber=gr.number.toString();
	var resultItem = {
		"number": kbnumber,
		"linkList": []
	};
	kbtext = gr.text.toString();
	strStart=kbtext.indexOf('<a',0);
	while (strStart>-1) {
	   strEnd=kbtext.indexOf('</a',strStart);
	   if (strEnd>-1) {
			var tmpStr=kbtext.slice(strStart,strEnd+4);
			resultItem.linkList.push(tmpStr);
	   }
	   strStart=kbtext.indexOf('<a',strEnd+5);
	}
        resultList.push(resultItem);
}
gs.info('{0}',JSON.stringify(resultList));