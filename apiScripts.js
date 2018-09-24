var apiKey="32ab3a807edd3ad0a0299f09d768102e6fea1440";


function starRepo (repo) {
 var Url = "https://api.github.com/user/starred/" + repo;
 var xhr = new XMLHttpRequest();
			  xhr.open('Put', Url, true);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 204) {
		var response1 = "starred";
		document.getElementById("origin").innerHTML = response1;
		document.getElementById("url").innerHTML = response1.url;
	 }
 }
}
function starredRepo (repo, row) {
 var Url = "https://api.github.com/user/starred/" + repo;
 var xhr = new XMLHttpRequest();
			  xhr.open('Get', Url, true);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 204) {
		document.getElementById("favourites").innerHTML += row;
	 }
 }
}

function unstarRepo (repo) {
 var Url = "https://api.github.com/user/starred/" + repo;
 var xhr = new XMLHttpRequest();
			  xhr.open('Delete', Url, true);
			 xhr.setRequestHeader( 'Content-Type',   'application/json' );
 
	xhr.setRequestHeader("Authorization", "token " + apiKey); 	
 	xhr.send();
 	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
	 if (xhr.readyState == 4 && xhr.status == 204) {
		var response1 = "unstarred";
		document.getElementById("origin").innerHTML = response1;
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
			 document.getElementById("tags" + tagNumber).innerHTML = "-";
		 }
		 else
		 {
			 document.getElementById("tag" + tagNumber).innerHTML = tags[0].name;
			 document.getElementById("tags" + tagNumber).innerHTML = tags[0].name;
		 }
	 }
 };
	
	//results = JSON.parse(xhr.responseText);
	
	
}

function search (searchParam) {
	$("#results").load("LeftTableHeader.html");
	$("#favourites").load("LeftTableHeader.html");
	searchParam = searchParam.replace(/ /g,'+');
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
		MakeLeftTable(results);
		
	 }
 }
	return false;
}


function MakeLeftTable (searchResults) {
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
		table += "<td id=\"favourite" + i + "\"></td>";
		table += "</tr>";
		row += "<tr>";
	row += "<td>" + searchResults.items[i].full_name + "</td>";
		//var language = mainLanguage(searchResults.items[i].full_name);
		row += "<td>" + searchResults.items[i].language + "</td>";
		row += "<td id=\"tags" + i + "\"></td>";
		row += "<td id=\"favourites" + i + "\"></td>";
	row += "</tr>";
		starredRepo(searchResults.items[i].full_name,row);
	}
	document.getElementById("results").innerHTML=table;
	for (var i=0; i<10; i++) {
	tags(searchResults.items[i].tags_url, i);	
	}
	
}