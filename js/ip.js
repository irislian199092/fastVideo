(function(){

	//快编登录地址
	var loginUrl='http://10.7.3.22:3000/login.html';
	//快编首页地址
	var enterUrl='http://10.7.3.22:3000/index.html';
	//快编数据服务地址
	var serverUrl='http://112.126.71.150:8090/fastcarve/api/';
	//快编字幕模板服务地址
	var subtitleServer='http://112.126.71.150:82/subtitle/';
	//人脸识别地址
	var faceUrl='http://123.57.12.42:8070/athena';
	//快编推流服务地址

	var signalingServer = "http://47.93.132.17:8888";
	//快编注册服务地址
	var registerServer = "http://47.93.132.17:8889";


	//var signalingServer = "http://10.7.3.77:8888";
	//var registerServer = "http://10.7.3.77:8889";

	//快编调试模式地址（非调试模式地址可不填）
	var debugSignalingServer='http://127.0.0.1:8888';
	var debugRegisterServerDebug= "http://127.0.0.1:8889";


	var isDebug=window.location.search.indexOf('debug')>-1?true:false;
	window.serverUrl=serverUrl;
	window.subtitleServer=subtitleServer;
	window.loginUrl=loginUrl;
	window.enterUrl=enterUrl;
	window.faceUrl=faceUrl;
	window.signalingServer=isDebug?debugSignalingServer:signalingServer;
	window.registerServer=isDebug?debugRegisterServerDebug:registerServer;
})();
