function numbersonly(myfield, e, dec)
{
var key;
var keychar;

if (window.event)
   key = window.event.keyCode;
else if (e)
   key = e.which;
else
   return true;
keychar = String.fromCharCode(key);

// control keys
if ((key==null) || (key==0) || (key==8) ||
    (key==9) || (key==13) || (key==27) )
   return true;

// numbers
else if ((("0123456789").indexOf(keychar) > -1))
   return true;

// decimal point jump
else if (dec && (keychar == "."))
   {
   myfield.form.elements[dec].focus();
   return false;
   }
else
   return false;
}

function check_validity() {
	return true;
}

function generate_live_preview() {
	var image = base + '/files/images/preview-product-image.jpeg';
	var text_color = document.getElementById('design-text-color').value;
	var text = 'Someone in Paris, France purchased a <br><a style="font-size: 125%; color: #' + text_color + ';" href="#">Men\'s Locked Long-Sleeve shirt</a><br> 4 hours ago';
	var position = ( document.getElementById('design-image-position-right').checked == true ? 1 : 0 );
	var background = document.getElementById('design-background-color').value;
	var height = document.getElementById('design-image-height').value;	
	var text_size = document.getElementById('design-text-size').value;
	var image_border = document.getElementById('design-image-border').value;
	var box_border = document.getElementById('design-box-border').value;
	var box_padding = document.getElementById('design-box-padding').value;
	var avg_dist = '100px';

	var html = '';
	var image_html = '<img src="' + image + '" style="height: ' + height + 'px;">';

	if( position == 0 ) {
		html += '<td style="border:none; padding: 0px; vertical-align: middle">' + image_html + '</td>';
		html += '<td style="border:none; padding: ' + box_padding + 'px; color: #' + text_color + '; font-size: ' + text_size + 'px;">' + text + '</td>';
	} else {
		html += '<td style="border:none; padding: ' + box_padding + 'px; color: #' + text_color + '; font-size: ' + text_size + 'px; text-align: right;">' + text + '</td>';
		html += '<td style="border:none; padding: 0px">' + image_html + '</td>';
	}

	html = '<table style="border:none; padding: 0px;"><tr style="border:none; padding: 0px;">' + html + '</tr></table>';
	document.getElementById('design_preview').innerHTML = html;

	if( box_border != '' ) document.getElementById('design_preview').style.border = "1px solid #" + box_border;
	if( background != '' ) document.getElementById('design_preview').style.background = '#' + background;
	document.getElementById('design_preview').style.top = avg_dist;
	document.getElementById('design_preview').style.left = avg_dist;	
}

function toggle_hide_option(id) {
	ShopifyApp.Bar.loadingOn();
	http_get_request( base + '/?process=toggle_hiding&id=' + id + '&mysession=' + document.getElementById('session_id').value, 'hide_option_toggled', id );
}

function hide_option_toggled( response, id ) {
	ShopifyApp.Bar.loadingOff();
	document.getElementById('order_id_' + id).innerHTML = ( response == 1 ? 'Unhide' : 'Hide' );
	document.getElementById('order_id_' + id).classList.remove( ( response == 1 ? 'btn-danger' : 'btn-success' ) );
	document.getElementById('order_id_' + id).classList.add( ( response == 1 ? 'btn-success' : 'btn-danger' ) );
}

function paginate_orders( page ) {
	ShopifyApp.Bar.loadingOn();
	http_get_request( base + '/?process=show_orders&page=' + page + '&mysession=' + document.getElementById('session_id').value, 'orders_paginated' );
}

function orders_paginated( response ) {
	document.getElementById('orders').innerHTML = response;
	ShopifyApp.Bar.loadingOff();
}

function display_the_loading_message( clock ) {
	
	document.getElementById('the_loader_msg').style.top = ( parseInt( screen.height ) / 3 ) + 'px';
	document.getElementById('the_loader_msg').style.left = ( parseInt( document.getElementsByTagName('body')[0].clientWidth ) / 2 ) + 'px';
		
	if( clock == 1 ) {
		
		document.getElementById('the_loader_plot').classList.remove( 'hide' );
		document.getElementById('the_loader_msg' ).classList.remove( 'hide' );
	}
	else {
		
		document.getElementById('the_loader_plot').classList.add( 'hide' );
		document.getElementById('the_loader_msg' ).classList.add( 'hide' );
	}
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it
function drawChart( page, type ) {

	ShopifyApp.Bar.loadingOn();

	if( type == undefined ) type = 'monthly';
	if( page == undefined ) page = 1;
	
	var types = ['yearly', 'monthly', 'weekly', 'daily'];
	document.getElementById('chart_period_type').value = type;
	for( var i=0; i<types.length; i++) {
		if( type == types[i] ) {
			document.getElementById('chart-control-'+types[i]).classList.add('btn-success');
			document.getElementById('chart-control-'+types[i]).classList.remove('btn-info');
		} else {
			document.getElementById('chart-control-'+types[i]).classList.add('btn-info');
			document.getElementById('chart-control-'+types[i]).classList.remove('btn-success');
		}
	}

	http_get_request( base + '/?process=analytics&type=' + type + '&page=' + page + '&mysession=' + document.getElementById('session_id').value, 'drawTheChart', [page, type] );
}

function drawTheChart( response, params ) {

	var html = '';
	
	var rows = [];
	var analytics_data = JSON.parse( response );

	if( analytics_data.analysis != null ) {
		for( var i = 0; i < analytics_data['analysis'].length; i++ ) {
			rows[ rows.length ] = [ analytics_data['days'][i] + ' ', analytics_data['analysis'][i] ];
		}

	    var data = google.visualization.arrayToDataTable(rows);

		var options = {
		  title: 'Traffic',
          hAxis: {title: '',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
		};

		var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
		chart.draw(data, options);

		//show_recent_clicks( analytics_data['products'], 1 );
	} else document.getElementById('chart_div').innerHTML = "No data found";
}

function show_recent_clicks( page ) {
	ShopifyApp.Bar.loadingOn();
	http_get_request( base + '/?process=recent_clicks&page=' + page + '&mysession=' + document.getElementById('session_id').value, 'recent_clicks_shown', page );
}

function recent_clicks_shown( data, page ) {

	data = JSON.parse( data );
	var html = '<h5>Recent traffics</h5>';
	html += '<table class="table table-striped">';

	html += '<tr><th width="10%">Date</th><th width="80%">Product</th><th>Country</th></tr>';

	for( var i = 0; i < 20; i++ ) {
		if( data[i] != undefined ) {
			html += '<tr>';
				html += '<td>' + data[i]['date'] + '</td>';
				html += '<td>' + data[i]['handle'] + '</td>';
				html += '<td>' + data[i]['country'] + '</td>';
			html += '</tr>';
		}
	}
	html += '</table>';

	if( page > 1 || data.length >= 10 ) {
		html += '<nav><ul class="pager">';
			if( page > 1 ) html += '<li><a href="#" onclick="javascript: show_recent_clicks( ' + ( page - 1 ) + ' ); return false;">Previous</a></li>';
			if( data.length >= 10 ) html += '<li><a href="#" onclick="javascript: show_recent_clicks( ' + ( page + 1 ) + ' ); return false;">Next</a></li>';
		html += '</ul></nav>';
	}


	document.getElementById('chart_recent_clicks').innerHTML = html;

	ShopifyApp.Bar.loadingOff();
}

function add_new_review() {
	var content = document.getElementById( 'new_review_input' ).value;
	http_get_request( base + '/?process=add_review_content&mysession=' + document.getElementById('session_id').value + '&content=' + encodeURIComponent( content ), 'new_review_added' );
}

function new_review_added( response ) {
	document.getElementById('review_list_inputs').value = response;
	document.getElementById('new_review_input').value = '';
	document.getElementById('new_review').classList.add('hide');
	reload_reviews_list();
}

function new_review_input() {
	document.getElementById('new_review').classList.remove('hide');
}

function reload_reviews_list() {
	var reviews = document.getElementById('review_list_inputs').value;
	var the_review = '';
	var html = '';
	if( ( reviews.trim() != '' ) && ( reviews.trim() != 'null' ) ) {
		reviews = JSON.parse( reviews );
		html += '<table class="table table-striped">';
			html += '<tr><th width="90%">Review</th><th width="10%">Option</th></tr>';
			for( var i = 0; i < reviews.length; i++ ) 
			if( reviews[ i ].trim() != '' ) {
				html += '<tr>';

					the_review = reviews[ i ];
					the_review = the_review.split("\\").join("");

					html += '<td>' + the_review + '</td>';
					html += '<td><a href="#" onclick="javascript:delete_review(\'' + i + '\'); return false;" class="btn btn-danger"><i class="glyphicon glyphicon-remove"></i> Delete</a></td>';
				html += '</tr>';
			}
		html += '</table>';
	}

	document.getElementById('reviews_list').innerHTML = html;
}

function delete_review( i ) {
	http_get_request( base + '/?process=delete_review&mysession=' + document.getElementById('session_id').value + '&i=' + i, 'review_deleted' );
}

function review_deleted( response ) {
	document.getElementById('review_list_inputs').value = response;
	reload_reviews_list();
}

//Choose template
function upload_logo_image(image, preview_div, uploadUrl)
{
	upload_image_raw(image, preview_div, uploadUrl);
}

//Standard Javascript function for making a http get request with callback
function http_get_request( url, callback, params ) {
	
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			//callback with response
			window[callback](xmlhttp.responseText, params);
		}
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}

function http_post_request( url, data, callback, params ) {
	
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			//callback with response
			window[callback](xmlhttp.responseText, params);
		}
	}
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(data);
}

function upload_image_raw(image, preview_div, uploadUrl, callback) {
	
	if( preview_div != "" ) document.getElementById(preview_div).innerHTML = "<img src='"+base+"/files/images/loader.gif'>";
	
	// Get the selected files from the input.
	var files = image.files;
	
	// Create a new FormData object.
	var formData = new FormData();
	
	// Loop through each of the selected files.
	for (var i = 0; i < files.length; i++) {
	  var file = files[i];

	  // Check the file type.
	  /*if (!file.type.match('image.*')) {
		continue;
	  }*/

	  // Add the file to the request.
	  formData.append('photos[]', file, file.name);
	}	
	
	
	// Set up the request.
	var xhr = new XMLHttpRequest();
	
	// Open the connection.
	xhr.open('POST', uploadUrl, true);
	
	// Set up a handler for when the request finishes.
	xhr.onload = function () {
	  if (xhr.status === 200) {
		// File(s) uploaded.		
		if( preview_div != "" ) document.getElementById(preview_div).innerHTML = xhr.responseText;
		var responseText = xhr.responseText;
		
		if(callback != '' ) {			
			window[callback](preview_div, responseText);
		}

	  } else {
		alert('An error occurred!');
	  }
	};
	
	// Send the Data.
	xhr.send(formData);
	
	return false;
}