var apiKey="InsertAPIKEY";


function starRepo (repo, searchparam) {
 var Url = "https://api.github.com/user/starred/" + repo;
 var xhr = new XMLHttpRequest();
			  xhr.open('Put', Url, true);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 204) {
		search(searchparam);
	 }
 }
}
function starredRepo (repo, row, index, tagUrl, searchparam) {
 var Url = "https://api.github.com/user/starred/" + repo;
 var xhr = new XMLHttpRequest();
			  xhr.open('Get', Url, true);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 204) {
		 row+="<a id=\"remove" + index + "\" href=\"#\" onclick=\"unstarRepo(\'" + repo + "\',\'" + searchparam + "\');return false;\">remove</a>";
		 row+="</td></tr>";
		document.getElementById("favourites").innerHTML += row;
		document.getElementById("favourite" + index).innerHTML = ""; 
		tags(tagUrl, index);
	 }
 }
}

function unstarRepo (repo, searchparam) {
 var Url = "https://api.github.com/user/starred/" + repo;
 var xhr = new XMLHttpRequest();
			  xhr.open('Delete', Url, true);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 204) {
		search(searchparam);
	 }
 }
}
function mainLanguage (repo) {
  	var Url = "https://api.github.com/repos/" + repo + "/languages";
 	var xhr = new XMLHttpRequest();
			  xhr.open('Get', Url, false);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	var results1=true;
	 function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 200) {
		results1 = JSON.parse(xhr.responseText);
		 return results1;
	 }
 };
	
	//results = JSON.parse(xhr.responseText);
	return  results1;
	
}
function tags (tagUrl, tagNumber) {
  	var Url = tagUrl;
 	var xhr = new XMLHttpRequest();
			  xhr.open('Get', Url, true);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	 function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 200) {
		 var tags = JSON.parse(xhr.responseText);
		 
		
		 if (jQuery.isEmptyObject(tags))
		 {
			 document.getElementById("tag" + tagNumber).innerHTML = "-";
			 if( $('#tags' + tagNumber).length )  
			 {
			 	document.getElementById("tags" + tagNumber).innerHTML = "-";
			 }
		 }
		 else
		 {
			 document.getElementById("tag" + tagNumber).innerHTML = tags[0].name;
			 if( $('#tags' + tagNumber).length )  
			 {
			 	document.getElementById("tags" + tagNumber).innerHTML = tags[0].name;
			 }
		 }
	 }
 };
	
	//results = JSON.parse(xhr.responseText);
	
	
}

function search (searchParam) {
	$("#results").load("LeftTableHeader.html");
	$("#favourites").load("LeftTableHeader.html");
	//searchParam = searchParam.replace(/ /g,'+');
 var Url = "https://api.github.com/search/repositories?q=" + searchParam;
	
 var xhr = new XMLHttpRequest();
			  xhr.open('Get', Url, true);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 200) {
		var results = JSON.parse(xhr.responseText);
		MakeLeftTable(results,searchParam);
		
	 }
 }
	return false;
}


function MakeLeftTable (searchResults,searchParam) {
	//$("#results").load("LeftTableHeader.html");
	var table = document.getElementById("results").innerHTML;
	var row = ""; 
	
	for (var i=0; i<10 && !(jQuery.isEmptyObject(searchResults.items[i])); i++) {
		row="";
		table += "<tr>";
	table += "<td>" + searchResults.items[i].full_name + "</td>";
		//var language = mainLanguage(searchResults.items[i].full_name);
		table += "<td>" + searchResults.items[i].language + "</td>";
		table += "<td id=\"tag" + i + "\"></td>";
		table += "<td id=\"favourite" + i + "\">";
		table+="<a id=\"add" + i + "\" href=\"#\" onclick=\"starRepo(\'" + searchResults.items[i].full_name + "\',\'" + searchParam + "\');return false;\">add</a>";
		 table+="</td></tr>";
		//table += "</tr>";
		row += "<tr>";
	row += "<td>" + searchResults.items[i].full_name + "</td>";
		//var language = mainLanguage(searchResults.items[i].full_name);
		row += "<td>" + searchResults.items[i].language + "</td>";
		row += "<td id=\"tags" + i + "\"></td>";
		row += "<td id=\"favourites" + i + "\">";
	
		starredRepo(searchResults.items[i].full_name,row, i, searchResults.items[i].tags_url,searchParam);
	}
	document.getElementById("results").innerHTML=table;
	for (var i=0; i<10 && !(jQuery.isEmptyObject(searchResults.items[i])); i++) {
	tags(searchResults.items[i].tags_url, i);	
	}
	
}