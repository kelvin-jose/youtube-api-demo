    
$(document).ready(function () {

	var URL = 'https://www.googleapis.com/youtube/v3/search';  // Youtube API
	var key = "YOUR API KEY HERE";  // API Key

	var options = {}
	var toBeSorted = []

    /**
    This is an event handler. When the user selects/clicks the search
    button, this handler is triggered. 
    **/
	$('#form').on('submit', function (e) { // Handling search form submit
		e.preventDefault(); // Prevent form from submitting

		options = { // Options specified for data retrieval
			part: 'snippet',
			key: key,
			type: "video",
			maxResults: 30,
			q: encodeURIComponent($("#query").val()).replace(/%20/g, "+")
		}
        
		$('input[type="radio"]').prop("checked", false);
		loadVideos(); // Call to function
	});

    // Used to clear screen for rewriting
	function clearScreen() { 
		$('main').empty();
	}
    
    /**
    This function sends request to Youtube API with options and recieves
    a JSON object as return value. Sufficient data is extracted and pushed
    to an array called toBeSorted. Finally the array is passed to another
    function to display on the screen.
    **/
	function loadVideos() { // Getting data from API
		toBeSorted = []
		$.getJSON(URL, options, function (data) {
			for (var i = 0; i < data.items.length; i++)
				toBeSorted.push(data.items[i].snippet)
			resultsLoop(toBeSorted);
		});
	}

    /**
    This function takes an array as parameter. First the screen will be
    flushed off. Then data is written to the screen iteratively.
    **/
	function resultsLoop(data) { // Writing results to screen
		clearScreen();
		document.getElementById('menu').style.display = 'block';
		var count = 0;
		$.each(data, function (i, item) {
			var title = item.title;
			var desc = item.description.substring(0, 100);
			var publishedDate = item.publishedAt;
			var thumbnail = item.thumbnails.medium.url;
			var vid = item.thumbnails.default.url;
			vid = vid.substring(vid.indexOf("vi/") + 3, vid.indexOf("/default.jpg"));

			$('main').append(`  
                        <div class="container py-3">
                            <div class="card">
                                <div class="row ">
                                    <div class="col-md-4">
                                        <img src="${thumbnail}" alt="Card image">
                                    </div>
                            <div class="col-md-8 px-3">
                                <div class="card-block px-3">
                                    <h4 class="card-title">${title}</h4>
                                        <p class="card-text">${publishedDate}</p>
                                        <p class="card-text">${desc}</p>
                            <a href="https://www.youtube.com/watch?v=${vid}" class="btn btn-primary" target="_blank">Play ></a>
                        </div></div></div></div></div>
							`);
		});

	}
    
    /**
    This function does sorting based on a property, here we sort using
    either name or published date. Based on the property value, the array
    of data will be sorted and returned. Sorting is done descendingly.
    **/
	function dynamicSort(property) { 
		var sortOrder = 1;           
		if (property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (b, a) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}
    
    /**
    This is an event handler. As soon as the user selects an option to sort
    by either name or date, this handler will be triggered. After sorting,
    results will be dislayed.
    **/
	$('input[type="radio"]').on('change', function (e) { 
		var property = $("input[name='my-radio']:checked").val();
		toBeSorted.sort(dynamicSort(property));
		resultsLoop(toBeSorted);
	});
    
});

