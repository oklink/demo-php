<?php

class OKLink_Rpc {
	private $_requestor;
	private $authentication;

	public function __construct($requestor, $authentication) {
		$this -> _requestor = $requestor;
		$this -> _authentication = $authentication;
	}

	public function request($method, $url, $params) {
		// $url = OKCoinBase::API_BASE . $url;
		// Initialize CURL
		$ch = curl_init();
		// $curl = curl_init();
		$curlOpts = array();

		// Headers
		$headers = array('User-Agent: OKLinkPHP/v2','Content-Type: application/json; charset=utf-8');

		//GET USER APIKEY
		$auth = $this -> _authentication -> getData();

		$NONCE = time();
		$s = hash_hmac('sha256',$NONCE.$url.$params,  $auth -> apiKeySecret, true);
		$SIGNATURE =  bin2hex($s);
		array_push($headers,"NONCE: ".$NONCE);
		array_push($headers,"KEY: ".$auth->apiKey);
		array_push($headers,"SIGNATURE: ".$SIGNATURE);
		// Get the authentication class and parse its payload into the HTTP header.

		// HTTP method
		$method = strtolower($method);
		if ($method == 'get') {
			curl_setopt($ch, CURLOPT_HTTPGET, 1);
			if ($params != null) {
				$queryString = http_build_query($params);
				$url .= "?" . $queryString;
			}
		} else if ($method == 'post') {
	
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		}

		// CURL options
		curl_setopt($ch, CURLOPT_URL, substr(RequestBase::WEB_BASE, 0, -1) . $url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

		// Do request
		$response = $this -> _requestor -> doCurlRequest($ch);
		// Decode response
		try {
			$body = $response['body'];
			$json = json_decode($body);
		} catch (Exception $e) {
			echo "Invalid response body" . $response['statusCode'] . $response['body'];
		}
		if ($json === null) {
			echo "Invalid response body" . $response['statusCode'] . $response['body'];
		}
		if (isset($json -> error)) {
			throw new OKLink_Exception($json -> error, $response['statusCode'], $response['body']);
		} else if (isset($json -> errors)) {
			throw new OKLink_Exception(implode($json -> errors, ', '), $response['statusCode'], $response['body']);
		}

		return $json;
	}

}
