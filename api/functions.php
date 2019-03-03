<?php

function echoResponse ($code, $response = array()) {

    $http_status_codes = array(100 => 'Continue', 101 => 'Switching Protocols', 102 => 'Processing', 200 => 'OK', 201 => 'Created', 202 => 'Accepted', 203 => 'Non-Authoritative Information', 204 => 'No Content', 205 => 'Reset Content', 206 => 'Partial Content', 207 => 'Multi-Status', 300 => 'Multiple Choices', 301 => 'Moved Permanently', 302 => 'Found', 303 => 'See Other', 304 => 'Not Modified', 305 => 'Use Proxy', 306 => '(Unused)', 307 => 'Temporary Redirect', 308 => 'Permanent Redirect', 400 => 'Bad Request', 401 => 'Unauthorized', 402 => 'Payment Required', 403 => 'Forbidden', 404 => 'Not Found', 405 => 'Method Not Allowed', 406 => 'Not Acceptable', 407 => 'Proxy Authentication Required', 408 => 'Request Timeout', 409 => 'Conflict', 410 => 'Gone', 411 => 'Length Required', 412 => 'Precondition Failed', 413 => 'Request Entity Too Large', 414 => 'Request-URI Too Long', 415 => 'Unsupported Media Type', 416 => 'Requested Range Not Satisfiable', 417 => 'Expectation Failed', 418 => 'I\'m a teapot', 419 => 'Authentication Timeout', 420 => 'Enhance Your Calm', 422 => 'Unprocessable Entity', 423 => 'Locked', 424 => 'Failed Dependency', 424 => 'Method Failure', 425 => 'Unordered Collection', 426 => 'Upgrade Required', 428 => 'Precondition Required', 429 => 'Too Many Requests', 431 => 'Request Header Fields Too Large', 444 => 'No Response', 449 => 'Retry With', 450 => 'Blocked by Windows Parental Controls', 451 => 'Unavailable For Legal Reasons', 494 => 'Request Header Too Large', 495 => 'Cert Error', 496 => 'No Cert', 497 => 'HTTP to HTTPS', 499 => 'Client Closed Request', 500 => 'Internal Server Error', 501 => 'Not Implemented', 502 => 'Bad Gateway', 503 => 'Service Unavailable', 504 => 'Gateway Timeout', 505 => 'HTTP Version Not Supported', 506 => 'Variant Also Negotiates', 507 => 'Insufficient Storage', 508 => 'Loop Detected', 509 => 'Bandwidth Limit Exceeded', 510 => 'Not Extended', 511 => 'Network Authentication Required', 598 => 'Network read timeout error', 599 => 'Network connect timeout error');

    header('Content-Type: text/html;charset=UTF-8');
    header("HTTP/1.0 $code $http_status_codes[$code]");

    echo json_encode($response);

    die();
}

function getSelectData ($request, $slim_response, $args) {

    $db = new DB();
    $requestPOST = $request->getParsedBody();
    $data['totalData'] = $db->getDataCount();
    $data['totalFiltered'] =  $data['totalData'];
    
    if ( !empty($requestPOST['search']['value']) ) {
        $query =  $db->getSearchResult($requestPOST);
        $data['totalFiltered'] = $query['totalFiltered'];
        $data['query'] = $query['query'];
    }
    else {
        $data['query'] =  $db->getSelectData($requestPOST);
    }
       
    $json_data = createResponseArray($data);
    
    echoResponse(200, $json_data);
    
}


function createResponseArray($data) {

        $recordsData['records'] = array();
   
        foreach ($data['query']->fetchAll() as $row) { 
            $nestedData=array(); 
            $nestedData[] = $row["emp_no"];	
            $nestedData[] = $row["first_name"];
            $nestedData[] = $row["last_name"];   
            $nestedData[] = $row["birth_date"];
            $recordsData['records'][] = $nestedData;
        }
        
        $json_data = array(
            "draw"            => 0,   
            "recordsTotal"    => intval($data['totalData']),  
            "recordsFiltered" => intval($data['totalFiltered']), 
            "data"            => $recordsData['records']  
	);
        
        return $json_data;
}