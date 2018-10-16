var apiKey = "InsertAPIKEY";


//function that stars desired repo from the list of search results
//  if you wish to use this function without a search param replace the field with ""
//  uses a put request
function starRepo(repo, searchparam) {
    var Url = "https://api.github.com/user/starred/" + repo;
    var xhr = new XMLHttpRequest();
    xhr.open('Put', Url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.setRequestHeader("Authorization", "token " + apiKey);
    xhr.send();
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 204) {
            search(searchparam);
        }
    }
}

//function that performs a get request to check if repo is starred
// request reponse is 404 if not found and 204 otherwise
// Also, function updates the favourites table with the results
function starredRepo(repo, row, index, tagUrl, searchparam) {
    var Url = "https://api.github.com/user/starred/" + repo;
    var xhr = new XMLHttpRequest();
    xhr.open('Get', Url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.setRequestHeader("Authorization", "token " + apiKey);
    xhr.send();
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 204) {
            row += "<a id=\"remove" + index + "\" href=\"#\" onclick=\"unstarRepo(\'" + repo + "\',\'" + searchparam + "\');return false;\">Remove</a>";
            row += "</td></tr>";
            document.getElementById("favourites").innerHTML += row;
            document.getElementById("favourite" + index).innerHTML = "";
            tags(tagUrl, index);
        }
    }
}


// function to perfom delete request to remove a repo from the favourites lists (unstarres the repo)
//   this function also redoes the searching and builds the table to update the local and check for any
//   other updates from someone not using this UI.
function unstarRepo(repo, searchparam) {
    var Url = "https://api.github.com/user/starred/" + repo;
    var xhr = new XMLHttpRequest();
    xhr.open('Delete', Url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.setRequestHeader("Authorization", "token " + apiKey);
    xhr.send();
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 204) {
            search(searchparam);
        }
    }
}


//checks to see what tag is associated with a repo and uses tagNumber to put it in the right spot
// in the table (function could return after table was built)   
function tags(tagUrl, tagNumber) {
    var Url = tagUrl;
    var xhr = new XMLHttpRequest();
    xhr.open('Get', Url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.setRequestHeader("Authorization", "token " + apiKey);
    xhr.send();
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var tags = JSON.parse(xhr.responseText);


            if (jQuery.isEmptyObject(tags)) {
                document.getElementById("tag" + tagNumber).innerHTML = "-";
                if ($('#tags' + tagNumber).length) {
                    document.getElementById("tags" + tagNumber).innerHTML = "-";
                }
            } else {
                document.getElementById("tag" + tagNumber).innerHTML = tags[0].name;
                if ($('#tags' + tagNumber).length) {
                    document.getElementById("tags" + tagNumber).innerHTML = tags[0].name;
                }
            }
        }
    };

}

//makes the call to the api to get the search results based on the searchParam
function search(searchParam) {
    $("#results").load("LeftTableHeader.html");
    $("#favourites").load("LeftTableHeader.html");
	
    var Url = "https://api.github.com/search/repositories?q=" + searchParam;

    var xhr = new XMLHttpRequest();
    xhr.open('Get', Url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.setRequestHeader("Authorization", "token " + apiKey);
    xhr.send();
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var results = JSON.parse(xhr.responseText);
            makeTables(results, searchParam);

        }
    }
    return false;
}

//creates the structure for the tables and calls the functions to make further api calls
//  to add info to the tables    
function makeTables(searchResults, searchParam) {
    //$("#results").load("LeftTableHeader.html");
    var table = document.getElementById("results").innerHTML;
    var row = "";

    for (var i = 0; i < 10 && !(jQuery.isEmptyObject(searchResults.items[i])) && !($("#tag9").length); i++) {
        row = "";
        table += "<tr>";
        table += "<td><a id = \"name\" href=\"" + searchResults.items[i].html_url + "\">" + searchResults.items[i].full_name + "</a></td>";
		
        table += "<td>" + searchResults.items[i].language + "</td>";
        table += "<td id=\"tag" + i + "\"></td>";
        table += "<td id=\"favourite" + i + "\">";
        table += "<a id=\"add" + i + "\" href=\"#\" onclick=\"starRepo(\'" + searchResults.items[i].full_name + "\',\'" + searchParam + "\');return false;\">Add</a>";
        table += "</td></tr>";

        row += "<tr>";
        row += "<td><a id = \"name\" href=\"" + searchResults.items[i].html_url + "\">" + searchResults.items[i].full_name + "</a></td>";

        row += "<td>" + searchResults.items[i].language + "</td>";
        row += "<td id=\"tags" + i + "\"></td>";
        row += "<td id=\"favourites" + i + "\">";

        starredRepo(searchResults.items[i].full_name, row, i, searchResults.items[i].tags_url, searchParam);
    }
    document.getElementById("results").innerHTML = table;
    for (var i = 0; i < 10 && !(jQuery.isEmptyObject(searchResults.items[i])); i++) {
        tags(searchResults.items[i].tags_url, i);
    }

}