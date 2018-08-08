<?php
	class api {
		function __construct() {
			header("Access-Control-Allow-Origin: *");
			$this->mysqli = dbconnect();
		}

		function get_keys() {
			$public_key_bytes = openssl_random_pseudo_bytes(10);
            $public_key = uniqid().bin2hex($public_key_bytes);

            $private_key_bytes = openssl_random_pseudo_bytes(10);
            $private_key = uniqid().bin2hex($private_key_bytes);

            $this->mysqli->query("INSERT INTO nodes (private_key, public_key) VALUES ('$private_key', '$public_key')");
            echo $this->mysqli->error;
            $ret = array( 'private_key' => $private_key, 'public_key' => $public_key );
            echo json_encode( $ret );
		}

		function send() {
			$sender_private_key = $_REQUEST['sender_private_key'];
			$recipient_public_key = $_REQUEST['recipient_public_key'];
			$message = $_REQUEST['message'];
			$attachment_type = ( isset( $_REQUEST['attachment_type'] ) ? $_REQUEST['attachment_type'] : '' );
			$attachment = ( $attachment_type != '' ? $_REQUEST['attachment'] : '' );

			$sender_res = $this->mysqli->query("SELECT id FROM nodes WHERE private_key='$sender_private_key'");
			if( $sender_res->num_rows > 0 ) {
				$recipient_res = $this->mysqli->query("SELECT id FROM nodes WHERE public_key='$recipient_public_key'");
				if( $recipient_res->num_rows > 0 ) {
					$sender_arr = $sender_res->fetch_array(MYSQLI_ASSOC);
					$sender_id = $sender_arr['id'];
					$recipient_arr = $recipient_res->fetch_array(MYSQLI_ASSOC);
					$recipient_id = $recipient_arr['id'];

					$this->mysqli->query("INSERT INTO messages (sender, receiver, message, attachment_file_type, attachment, status) VALUES ('$sender_id', '$recipient_id', '" . $this->mysqli->real_escape_string( $message ) . "', '$attachment_type', '" . $this->mysqli->real_escape_string( $attachment ) . "', '0')" );
					if( $this->mysqli->error ) {
						$ret = array('status' => '102', 'message' => 'Not supported');
					} else {
						$ret = array('status' => '103', 'message' => 'Successfully sent');
					}
				} else {
					$ret = array('status' => '101', 'message' => 'Recipient not found');
				}
			} else {
				$ret = array('status' => '100', 'message' => 'Sender not found');
			}
			echo json_encode( $ret );
		}

		function fetch() {
			$recipient_private_key = $_REQUEST['recipient_private_key'];
			$sender_public_key = $_REQUEST['sender_public_key'];
			$res = $this->mysqli->query("SELECT id FROM nodes WHERE private_key='$recipient_private_key'");
			if( $res->num_rows > 0 ) {
				$arr = $res->fetch_array(MYSQLI_ASSOC);
				$recipient_id = $arr['id'];
				$sender_res = $this->mysqli->query("SELECT id FROM nodes WHERE public_key='$sender_public_key'");
				if( $sender_res->num_rows > 0 ) {
					$sender_arr = $sender_res->fetch_array(MYSQLI_ASSOC);
					$sender_id = $sender_arr['id'];
					$message_res = $this->mysqli->query("SELECT messages.id, messages.created_at, messages.message, messages.attachment_file_type, messages.attachment FROM messages WHERE messages.sender='$sender_id' AND messages.receiver='$recipient_id' AND status=0 ORDER BY id");
					echo $this->mysqli->error;
					while( $row = $message_res->fetch_array(MYSQLI_ASSOC) ) {
						$ret_messages[] = array('created_at' => $row['created_at'], 'message' => $row['message'], 'attachment_type' => $row['attachment_file_type'], 'attachment' => $row['attachment']);
						$this->mysqli->query("UPDATE messages SET message='', attachment='', status=1 WHERE id='" . $row['id'] . "'");
					}
					$ret = array('status' => '106', 'message' => count( $ret_messages ) . ' message found', 'messages' => $ret_messages);
				} else {
					$ret = array('status' => '105', 'message' => 'Failed to recognize sender');
				}
			} else {
				$ret = array('status' => '104', 'message' => 'Failed to recogize you');
			}

			echo json_encode( $ret );
		}

		function api_method() {
			//Silence is awesome
		}

		function __destruct() {
		}
	}
?>