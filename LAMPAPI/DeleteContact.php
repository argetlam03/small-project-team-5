<?php
	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
	$id = $inData["id"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE userId = ? AND id = ?");
		$stmt->bind_param("ss", $userId, $id);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Contact Deleted");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
