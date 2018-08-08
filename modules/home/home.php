<?php
	class home {
		public function __construct() {
			//Executes when the class is initiated
			$this->mysqli = dbconnect();
			$this->var = "this is variable 1";
		}

		public function home_method() {
			echo "This is happening by default";
		}

		public function process_test() {
			echo "Hi there";
		}

		public function step1() {
			echo "this is step 1<br>";
		}

		public function step1_step2() {
			display_html( 'headers/header_main' );

			$res = $this->mysqli->query("SELECT id, data FROM table1");
			while( $row = $res->fetch_array( MYSQLI_ASSOC ) ) {
				echo $row['id'] . ' - ' . $row['data'] . '<br>';
			}

			display_html( 'home/step1', array( 'abc' => 'array index 1', 'def' => 'array index 2' ) );

			display_html( 'footers/footer_main' );
		}

		public function step1_step2_page() {
			echo "this is the page<br>";

		}

		public function step1_step2_page_1() {
			global $break;
			echo "this is the page 1<br>";
		}

		function __destruct() {
			echo "Destructing home class";
		}
	}
?>
