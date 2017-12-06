PLAYER.subJsonTem=function(id,player_w,player_h,project_w,project_h){

    if(id=== "subtitle_01"){
        return
        {
            "id":"subtitle_01",
            "name":'subtitle_01', 
            "duration":2000,               
            "trimIn":0,                         
            "trimOut":2000,
            "abs":{
                left_value:parseInt(1400/project_w*player_w),
                top_value:parseInt(40/project_h*player_h)
            },                                       
            "pixel":[
                {
                    "x1": parseInt(1400/project_w*player_w),                      
                    "y1": parseInt(40/project_h*player_h),                       
                    "width": parseInt(300/project_w*player_w),                       
                    "height": parseInt(285/project_h*player_h),                       
                    "attr":{
                        "type":'images',
                        "url":'http://112.126.71.150:82/FastCarve/s1_01.png'
                    },
                    "attrID":'attrID_'+PLAYER.genNonDuplicateID(12)
                },
                {
                    "x1": parseInt(1400/project_w*player_w),                      
                    "y1": parseInt(360/project_h*player_h),                                       
                    "attr":{
                        "type":"fade",
                        "text":'NAME',
                        "fontFamily": 'PingFang Heavy',       
                        "fontSize":parseInt(54/project_h*player_h),                
                        "fillStyle":'#ffffff',    
                        "textAlign":'left',
                        "fadeInTime":1000,
                        "fadeOutTime":1000
                    },
                    "attrID":'attrID_'+PLAYER.genNonDuplicateID(12)
                },
                {
                    "x1": parseInt(1400/project_w*player_w),                      
                    "y1": parseInt(410/project_h*player_h),                                       
                    "attr":{
                        "type":"fade",
                        "text":'hellp',
                        "fontFamily":'PingFang Regular',       
                        "fontSize":parseInt(40/project_h*player_h),          
                        "fillStyle":'#ffffff',    
                        "textAlign":'left',
                        "fadeInTime":1000,
                        "fadeOutTime":1000
                    },
                    "attrID":'attrID_'+PLAYER.genNonDuplicateID(12)
                }
            ]    
        }
    }
    else if(id=== "subtitle_02"){
        return 
        {
            "id":"subtitle_02",
            "name":'subtitle_02', 
            "duration":2000,               
            "trimIn":0,                         
            "trimOut":2000, 
            "top":0,                                         
            "pixel":[
                {
                    "x1": parseFloat(550/project_w*player_w),                      
                    "y1": parseFloat(415/project_h*player_h),                                       
                    "attr":{
                        "type":"fade",
                        "text":'NAME',
                        "fontFamily": 'PingFang Medium',       
                        "fontSize":parseFloat(74/project_h*player_h),                
                        "fillStyle":'#ffffff',    
                        "textAlign":'left',
                        "fadeInTime":1000,
                        "fadeOutTime":1000
                    } 
                },
                {
                    "x1": parseFloat(550/project_w*player_w),                      
                    "y1": parseFloat(515/project_h*player_h),                                       
                    "attr":{
                        "type":"fade",
                        "text":'hellp',
                        "fontFamily":'造字工房力黑(非商用)常规体',       
                        "fontSize":parseFloat(112/project_h*player_h),                
                        "fillStyle":'#ffffff',    
                        "textAlign":'left',
                        "fadeInTime":1000,
                        "fadeOutTime":1000
                    } 
                }
            ]    
        };
    }
    /*"subtitle_02":{
        "id":"subtitle_02",
        "name":'subtitle_02', 
        "duration":2000,               
        "trimIn":0,                         
        "trimOut":2000, 
        "top":0,                                         
        "pixel":[
            {
                "x1": parseFloat(550/project_w*player_w),                      
                "y1": parseFloat(415/project_h*player_h),                                       
                "attr":{
                    "type":"fade",
                    "text":'NAME',
                    "fontFamily": 'PingFang Medium',       
                    "fontSize":parseFloat(74/project_h*player_h),                
                    "fillStyle":'#ffffff',    
                    "textAlign":'left',
                    "fadeInTime":1000,
                    "fadeOutTime":1000
                } 
            },
            {
                "x1": parseFloat(550/project_w*player_w),                      
                "y1": parseFloat(515/project_h*player_h),                                       
                "attr":{
                    "type":"fade",
                    "text":'hellp',
                    "fontFamily":'造字工房力黑(非商用)常规体',       
                    "fontSize":parseFloat(112/project_h*player_h),                
                    "fillStyle":'#ffffff',    
                    "textAlign":'left',
                    "fadeInTime":1000,
                    "fadeOutTime":1000
                } 
            }
        ]    
    },
    "subtitle_03":{
        "id":"subtitle_03",
        "name":'subtitle_03', 
        "duration":2000,               
        "trimIn":0,                         
        "trimOut":2000,
        "top":0,                                            
        "pixel":[
            {
                "x1": parseFloat(75/project_w*player_w),                      
                "y1": parseFloat(818/project_h*player_h),                       
                "width": parseFloat(710/project_w*player_w),                       
                "height": parseFloat(150/project_h*player_h),                       
                "attr":{
                    "type":'images',
                    "url":'http://112.126.71.150:82/FastCarve/s3_01.png'
                }
            },
            {
                "x1": parseFloat(94/project_w*player_w),                      
                "y1": parseFloat(745/project_h*player_h),                                       
                "attr":{
                    "type":"fade",
                    "text":'NAME',
                    "fontFamily": 'PingFang Heavy',       
                    "fontSize":parseFloat(102/project_h*player_h),               
                    "fillStyle":'#ffffff',    
                    "textAlign":'left',
                    "fadeInTime":1000,
                    "fadeOutTime":1000
                } 
            },
            {
                "x1": parseFloat(94/project_w*player_w),                      
                "y1": parseFloat(875/project_h*player_h),                                       
                "attr":{
                    "type":"fade",
                    "text":'hellp',
                    "fontFamily":'PingFang Regular',       
                    "fontSize":parseFloat(102/project_h*player_h),          
                    "fillStyle":'#ffffff',    
                    "textAlign":'left',
                    "fadeInTime":1000,
                    "fadeOutTime":1000
                } 
            }
        ]    
    },*/

};