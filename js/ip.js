(function(){
	var loginUrl='http://10.7.3.22:3000/login.html';		//快编登录地址
	var enterUrl='http://10.7.3.22:3000/index.html';  		//快编内容地址

	
	var serverUrl='http://112.126.71.150:8090/fastcarve/api/';	//快编数据服务地址
	var faceUrl='http://123.57.12.42:8070/athena';			//人脸识别地址
	var webrtcServer = "http://10.7.3.77";		 //底层服务

	
	window.serverUrl=serverUrl;
	window.loginUrl=loginUrl;
	window.enterUrl=enterUrl;
	window.faceUrl=faceUrl;
	window.webrtcServer=webrtcServer;

})();
