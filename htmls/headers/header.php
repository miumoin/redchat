<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="content-type" content="text/html;charset=utf-8" />
        <meta name='description' content='<?php echo DESCRIPTION; ?>'/>
        <meta name='keywords' content='<?php echo KEYWORDS; ?>'/>
		<title>Lately</title>
		<link rel="stylesheet" type="text/css" href="<?php echo BASE; ?>/files/css/style.css"/>
		<script> var base = '<?php echo BASE; ?>'; </script>
		<script type='text/javascript' src='<?php echo BASE; ?>/files/js/jquery-1.9.1.min.js'></script>		
        <script type="text/javascript" src="<?php echo BASE; ?>/files/js/javascripts.js"></script>

		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="<?php echo BASE ?>/files/css/bootstrap-datepicker3.min.css">
		
		<!-- Theme files -->
	    <link href="<?php echo BASE ?>/files/theme/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE ?>/files/theme/css/style.css" rel="stylesheet">
		<!-- Theme files ends -->

		<link rel="stylesheet" href="<?php echo BASE ?>/files/css/pick-a-color-1.2.3.min.css">

		<!-- Latest compiled and minified JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
		<script src="<?php echo BASE ?>/files/js/bootstrap-datepicker.min.js"></script>
		
		<script>
		    $(function(){
				
				$('#from_orders').datepicker({
					format: 'yyyy-mm-dd'
				});
				
				$('#to_orders').datepicker({
					format: 'yyyy-mm-dd'
				});
			
			});
		</script>

		<!--Load the AJAX API-->
	    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	    <script type="text/javascript">

	      // Load the Visualization API and the corechart package.
	      google.charts.load('current', {'packages':['corechart']});

	      // Set a callback to run when the Google Visualization API is loaded.
	      google.charts.setOnLoadCallback(drawChart);
	      
	    </script>		
		
    </head>

    <body class="shopify_background">

    	<div id="wrapper">
		    <nav class="navbar navbar-custom" role="navigation" style="border-radius: 0px; background-color: #ffffff;">			
		        <div class="navigation">			
		            <div class="navbar-header page-scroll">
		                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-main-collapse">
		                    <i class="fa fa-bars"></i>
		                </button>
		                <a class="navbar-brand" href="http://ecomisoft.com" target="_blank">
		                    <img src="<?php echo BASE ?>/files/theme/img/logo.png" alt="" width="150" height="40" />
		                </a>
		            </div>

		            <!-- Collect the nav links, forms, and other content for toggling -->
		            <div class="collapse navbar-collapse navbar-right navbar-main-collapse" style="margin-right: 0px;">
					  <ul class="nav navbar-nav">
						<li class="active">Double-OP</li>
					  </ul>
		            </div>
		            <!-- /.navbar-collapse -->
		        </div>
		        <!-- /.container -->
		    </nav>
		</div>

		<div id="the_loader_plot" class="hide"></div>
		<div id="the_loader_msg" class="hide"><span class="throbber-loader"></span></div>

