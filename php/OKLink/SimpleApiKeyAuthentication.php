<?php

class OKLink_SimpleApiKeyAuthentication extends OKLink_Authentication {
	private $_apiKey;

	public function __construct($apiKey) {
		$this -> _apiKey = $apiKey;
	}

	public function getData() {
		$data = new stdClass();
		$data -> apiKey = $this -> _apiKey;
		return $data;
	}

}
