export function RouteXL_API_Connector() {
	
	this.tour = function(locations, success_callback, error_callback) {
		
		// Init the request object
		var httpRequest = new XMLHttpRequest();
		if (!httpRequest) {
			alert('Cannot create an XMLHttpRequest instance');
			return false;
		}
		
		// Set up the request and send it
		httpRequest.open('POST', "https://api.routexl.com/tour");
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.setRequestHeader ("Authorization", "Basic " + btoa("marcos_aquino:engenhari@S24"));
		var params = "locations=" + JSON.stringify(locations);
		httpRequest.send(params);
		
		// Receive the response
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					success_callback(httpRequest.responseText);
				} else {
					error_callback(httpRequest.responseText);
				}
			}
		};
	};
	
}