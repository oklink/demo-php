<?php

require_once (dirname(__FILE__) . '/OKLink/OKLink.php');

// const API_KEY = "the apiKey is provided by OKLink ";
// const SECRET_KEY = "the secretKey is provided by OKLink ";

try {

	$coinType=1;  //1:OKD 2:BTC
	//OKLink DEMO 
	$client = new OKLinkClient(new OKLink_ApiKeyAuthentication(API_KEY, SECRET_KEY));

	//get ticker
	//$params = json_encode(array('symbol' => 'BTC'));
   	//$result = $client -> tickerApi($params);	
	//get country
	
	//$params = json_encode(array('country_id' => '40'));
	//$result = $client -> country($params);
	
	//getDetailInfo
	//$params = json_encode(array('country_id' => '143','pay_mode' =>'2'));
	//$result = $client -> detailInfo($params);
	
	//create remittance
    //$beneficiary=array('full_name'=>'jimmy.yu','mobile_number'=>'86,186000001','email'=>'b@test.com');
    //$remitter=array('full_name'=>'rldrich','mobile_number'=>'86,186000002','email'=>'a@test.com');
    //$detailInfo = array('bank_id'=>'69','bank_acc_number'=>'1232132212321','beneficiary'=>$beneficiary,"remitter"=>$remitter);
    //$params=array('country_id'=>'143','pay_mode'=>'2','transfer_network'=>'1','receive_amount'=>'1000','detail_info'=>json_encode($detailInfo),'is_create'=>'1');
    //$result = $client -> createRemittance(json_encode($params));
	
	//getRemittanceInfo
	//$params=array('id'=>'62k613XXJL1Cjm','type'=>'1');
	//$result = $client -> getRemitInfo(json_encode($params));
	
	//getPay info
	//$params=array('id'=>'8axbMcRsRZYLSk');
	//$result = $client -> getPayinfo(json_encode($params));
	//$aes256key = $result->pay_info->aes256key;
	//$pay_hex = $result->pay_info->pay_hex;
	//$salt= $result->pay_info->salt;
	
	//to Pay
	//$params=array('id'=>'the remmittance id','pay_hex'=>'should sign by SignByJs');
	//$result = $client -> pay(json_encode($params));
	
	//accept
	
	//$params=array('id'=>'the remmittance id');
	//$result = $client -> accept(json_encode($params));
	
	
	//to reject_info
	//$client -> getRejectInfo(json_encode($params)) ;
	
	//to reject
	//$client -> reject(json_encode($params)) ;
	
	//get refund info
	//$client ->getRefundInfo(json_encode($params)) ;
	
	//to refund
	//$client ->getRefund(json_encode($params)) 
	
	//get receive_info
	//$client -> getReceiveInfo(json_encode($params))
	
	//get appeal_receive
	//$client -> appealReceive(json_encode($params))
	
	//get userInfo
	//$client ->userInfo(json_encode($params));

} catch (Exception $e) {
	$msg = $e -> getMessage();
	error_log($msg);
}

