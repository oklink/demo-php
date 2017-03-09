
//解决ie10以下的浏览器不支持Int32Array的问题
if (typeof (Int32Array) == "undefined") {
	Int32Array = function(size) {
		if (size < 0 || Math.floor(size) != size) {
			throw "Invalid array length";
		}
		for ( var index = 0; index < size; index++) {
			this[index] = 0;
		}
		this.length = size;
	};
	
	Int32Array.prototype = new Array();
}

Binary = {
	stringToBytes : function(e) {
		for ( var t = [], n = 0; n < e.length; n++)
			t.push(e.charCodeAt(n));
		return t;
	},
	bytesToString : function(e) {
		for ( var t = [], n = 0; n < e.length; n++)
			t.push(String.fromCharCode(e[n]));
		return t.join("");
	}
};


/**
 * 密钥解密
 * @param encryptedStr 用户私钥密文
 * @param 用户密码
 * @return 私钥对象
 */
function decryptPrivateKey(encryptedStr,password,userSalt) {
	
	try{
		//加密私钥用的密码
		var passwordForPrivKey = Bitcoin.CryptoJS.MD5(password + userSalt).toString();
		var decrypt = Utils.AesDecrypt(encryptedStr, passwordForPrivKey);
		//解密出的私钥
		var privateKey = decrypt.toString(Bitcoin.CryptoJS.enc.Utf8);
		//console.log("PrivateKey:" + privateKey);
		if($.trim(privateKey).length == 0){
			console.log("decrypt PrivateKey empty.");
	    	return null;
		}
		return Bitcoin.ECPair.fromWIF(privateKey, Bitcoin.networks.bitcoin);
	} catch(e) {
		console.log("decrypt PrivateKey error." + e.toString());
    	return null;
	}
}


// 判断是否支持 window.crypto和地址解析。
function supportWindowCrypto() {
	try {
		var crypto = window.crypto;
		if (crypto == undefined) {
			//$("#borwserNotSupport").show();
			console.log("不支持随机数生成！");
			return false;
		}
		Bitcoin.address.fromBase58Check("4Kw2eM6jGkGCEPr4T9LUraRS3gyimPxHAr");
	} catch (e) {
		//$("#borwserNotSupport").show();
		console.log("不支持地址解析！");
		return false;
	}
	//$("#borwserSuggest").show();
	return true;
}

Utils = {
	stringToBytes : function(e) {
		return Binary.stringToBytes(unescape(encodeURIComponent(e)));
	},

	bytesToString : function(e) {
		return decodeURIComponent(escape(Binary.bytesToString(e)));
	},

	AesEncrypt : function(data, key) {
		return Bitcoin.CryptoJS.AES.encrypt(data, key);
	},

	AesDecrypt : function(encrytedData, key) {
		return Bitcoin.CryptoJS.AES.decrypt(encrytedData, key);
	},

	//格式化CST日期的字串
	formatCSTDate : function(strDate, format) {
		return formatDate(new Date(strDate), format);
	},

	//格式化日期,
	formatDate : function(date, format) {
		//补零
		var paddNum = function(num) {
			num += "";
			return num.replace(/^(\d)$/, "0$1");
		};

		//指定格式字符
		var cfg = {
			yyyy : date.getFullYear(), //年 : 4位
			yy : date.getFullYear().toString().substring(2), //年 : 2位
			M : date.getMonth() + 1, //月 : 如果1位的时候不补0
			MM : paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
			d : date.getDate(), //日 : 如果1位的时候不补0
			dd : paddNum(date.getDate()), //日 : 如果1位的时候补0
			hh : paddNum(date.getHours()), //时
			mm : paddNum(date.getMinutes()), //分
			ss : paddNum(date.getSeconds()) //秒
		};

		format || (format = "yyyy-MM-dd hh:mm:ss");
		return format.replace(/([a-z])(\1)*/ig, function(m) {
			return cfg[m];
		});
	},

	isValidCoinAddress : function(addr) {
		try {
			Bitcoin.Address.fromBase58Check(addr);
			return true;
		} catch (e) {
			return false;
		}
	},

	UnicodeToUTF8 : function(str) {
		var out, i, len, c;

		out = "";
		len = str.length;
		for (i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	},
	getBinaryIndex : function(value, bit) {
		var remainder = 0;
		for ( var i = 0; i < bit; i++) {
			var factor = value / 2;
			factor = parseInt(factor);
			remainder = value % 2;
			if (factor == 0) {
				if (i >= bit - 1)
					break;
				remainder = 0;

				break;
			}
			value = factor;
		}
		return remainder;
	},
	getNetwork : function(coinType) {
    	if(coinType==1) {
				return Bitcoin.networks.oktoken;
		}
		if(coinType==2){
				return Bitcoin.networks.bitcoin;
    	}
    }
};
function estimateFee(type) {
	return function(tx) {
		var network = networks[type];
		var baseFee = network.feePerKb;
		var byteSize = tx.toBuffer().length;

		var fee = baseFee * Math.ceil(byteSize / 1000);
		if (network.dustSoftThreshold == undefined)
			return fee;

		tx.outs.forEach(function(e) {
			if (e.value < network.dustSoftThreshold) {
				fee += baseFee;
			}
		});

		return fee;
	};
}
