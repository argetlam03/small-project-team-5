<?php


$inData = getRequestInfo(); 

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error)
{
    returnWithError( $conn->connect_error);
}
else
{

    $stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Phone = ?, Email = ? 
                            WHERE userId = ? AND ID = ?");
    $userId = $inData["userId"];
    $ID = $inData["ID"];
    $Name = $inData["Name"];
    $Phone = $inData["Phone"];
    $Email = $inData["Email"]; 

    if (!$Name || !$Phone || !$Email || !$userId || !$ID)
    {
        returnWithError("Missing required fields");
    }

    $stmt->bind_param("sssss",$Name, $Phone, $Email, $userId, $ID);

    if($stmt->execute())
    {
        if($stmt->affected_rows > 0)
        {
            echo 'Contact updated successfully';
        }
        else
        {
            returnWithError("No Records Found");
        }
    }
    else
    {
        returnWithError("Error executing query: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
    
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
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

?>