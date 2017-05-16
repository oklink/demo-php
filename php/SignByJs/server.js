var express = require('express');
var Bitcoin = require('./bitcoinjsok.min.js');
var bodyParser = require('body-parser'); 
var app = express();
app.use(express.static('public'));
var server = app.listen(8080,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Node Server start http://%s:%s',host,port);
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/sign', function(req,res){
     
   var txHex = req.body.txHex;
   var coinType = req.body.coinType;
   var aes256key = req.body.aes256key;
   var paymentPasswd = req.body.paymentPasswd;
   var salt = req.body.salt;
   var redeemScript = req.body.redeemScript;
   if(!txHex){
        res.send("txHex is empty！");
       return ;		
   }
   if(!coinType){
	res.send("coinType is empty！");
        return; 
   }
   if(!aes256key){
	res.send("aes256key is empty！");
       return;		
   }
   if(!paymentPasswd){
	res.send("paymentPasswd is empty！");
        return ;		
   }
   if(!salt){
	res.send("salt is empty！");
       return;
   }
   res.send(signTools(txHex,coinType,aes256key,paymentPasswd,salt,redeemScript));  

});

function AesDecrypt(encrytedData, key) {
   return Bitcoin.CryptoJS.AES.decrypt(encrytedData, key);
 }

function AesEncrypt (data, key) {
   return Bitcoin.CryptoJS.AES.encrypt(data, key);
}

function getNetwork(coinType) {
        if(coinType==1) {
            return Bitcoin.networks.oktoken;
        }
        if(coinType==2){
            return Bitcoin.networks.bitcoin;
        }
}
function decryptPrivateKey(encryptedStr,password,userSalt) {

        try{
                //加密私钥用的密码
                var passwordForPrivKey = Bitcoin.CryptoJS.MD5(password + userSalt).toString();
                var decrypt = AesDecrypt(encryptedStr, passwordForPrivKey);
                //解密出的私钥
                var privateKey = decrypt.toString(Bitcoin.CryptoJS.enc.Utf8);
                //console.log("PrivateKey:" + privateKey);
                if(!privateKey){
                        console.log("decrypt PrivateKey empty.");
                return null;
                }
                return Bitcoin.ECPair.fromWIF(privateKey, Bitcoin.networks.bitcoin);
        } catch(e) {
                console.log("decrypt PrivateKey error." + e.toString());
        return null;
        }
}
function signTools(txhex,coinType,aes256key,paymentPasswd,salt,redeemScript){
 
    var network = getNetwork(coinType);
    var tx = Bitcoin.Transaction.fromHex(txhex)
    var txBuilder = Bitcoin.TransactionBuilder.fromTransaction(tx, network);
	
	var privateKey = decryptPrivateKey(aes256key, paymentPasswd,salt);
		if(!privateKey){
			return "Error Payment password.";
		}
		
		//设置私钥网络
		privateKey.network = txBuilder.network;
        var rs = null;
		if(redeemScript){
		    rs = Bitcoin.script.fromHex(redeemScript)
		}
		//遍历输入并签名
		if(coinType == 1){
		   tx.ins.forEach(function (input,index) {
			  txBuilder.sign(index, privateKey, rs, null, input.script);
		   })
		} else {
		   tx.ins.forEach(function (input,index) {
				txBuilder.sign(index, privateKey, rs);
		   })
		}
		if(rs==null){
		   return txBuilder.build().toHex();
		}else{
		   return txBuilder.buildIncomplete().toHex();
		}
			
}
