<?php
require_once (dirname(__FILE__) . '/Base.php');

class OKLinkClient extends RequestBase {

	//构造函数
	function __construct($authentication) {
		parent::__construct($authentication);
	}

	//get ticker info
	public function tickerApi($params = null) {
		return $this -> post("/api/v2/ticker.do", $params);
	}
	//get country info
	public function country($params = null) {
		return $this -> post("/api/v2/country.do", $params);
	}
	//get detail info
	public function detailInfo($params = null) {
		return $this -> post("/api/v2/detail_info.do", $params);
	}
	//create remittance
	public function createRemittance($params = null) {
		return $this -> post("/api/v2/create_remittance.do", $params);
	}
	//get remittance info
	public function getRemitInfo($params = null) {
		return $this -> post("/api/v2/remittance_info.do", $params);
	}
	//get pay info
	public function getPayinfo($params = null) {
		return $this -> post("/api/v2/pay_info.do", $params);
	}
	//to pay
	public function pay($params = null) {
		return $this -> post("/api/v2/pay.do", $params);
	}
	//to pay
	public function remittanceList($params = null) {
		return $this -> post("/api/v2/remittance_list.do", $params);
	}
	//to accept
	public function accept($params = null) {
		return $this -> post("/api/v2/accept.do", $params);
	}
	//to reject_info
	public function getRejectInfo($params = null) {
		return $this -> post("/api/v2/reject_info.do", $params);
	}
	//to reject
	public function reject($params = null) {
		return $this -> post("/api/v2/reject.do", $params);
	}
	//get refund info
	public function getRefundInfo($params = null) {
		return $this -> post("/api/v2/refund_info.do", $params);
	}
	//to refund
	public function getRefund($params = null) {
		return $this -> post("/api/v2/refund.do", $params);
	}

	//get receive_info
	public function getReceiveInfo($params = null) {
		return $this -> post("/api/v2/receive_info.do", $params);
	}
	//get appeal_receive
	public function appealReceive($params = null) {
		return $this -> post("/api/v2/appeal_receive.do", $params);
	}
	//get userInfo
	public function userInfo($params = null) {
		return $this -> post("/api/v2/user_info.do", $params);
	}
						
}
