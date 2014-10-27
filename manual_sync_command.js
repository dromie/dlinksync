var HDD_INFO_ARRAY = new Array();
var __file = 0; 
var __chkflag = 0;  //for show check box  1:show  0:not

var __read;




function copy()
{	
	var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
	over.load();
		
	$('#tree_container_copy').fileTree({ root: '/mnt/HD/' ,cmd: 'cgi_generic_open_tree', script:'/cgi-bin/folder_tree.cgi',formname:'form',textname:'text_id'}, function(file) { });        	
		
	
	$("#sDiag_rename").hide();
	$("#sDiag_move_tree").hide();
	$("#sDiag_upload").hide();
	$("#sDiag_properties").hide();
	$("#sDiag_create_dir").hide();
	$("#sDiag_tree").show();
		//$("#shareDiag_title").html("Copy : Select Path");
		$("#shareDiag_title").html(_T('_wfs','copy')+" : "+_T('_remote_backup','msg22'));
	
}
function move()
{	
	__read = mainFrame.get_read();
	if (__read == "yes")
	{
		jAlert( _T('_wfs','msg7'),_T('_common','error'));			
		return;
	}		
	
	var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
	over.load();	
	$('#tree_container_move').fileTree({ root: '/mnt/HD/' ,cmd: 'cgi_generic_open_tree', script:'/cgi-bin/folder_tree.cgi',formname:'form',textname:'text_id'}, function(file) { });        
	$("#sDiag_rename").hide();
	$("#sDiag_tree").hide();
	$("#sDiag_upload").hide();
	$("#sDiag_properties").hide();
	$("#sDiag_create_dir").hide();
	$("#sDiag_move_tree").show();
	//$("#shareDiag_title").html("Move : Select Path");
	$("#shareDiag_title").html(_T('_wfs','move')+" : "+_T('_remote_backup','msg22'));
}	
function rename()
{
	__read = mainFrame.get_read();
	if (__read == "yes")
	{
		jAlert( _T('_wfs','msg7'),_T('_common','error'));			
		return;
	}		
	
	var name = mainFrame.$('.trSelected td:eq(0) span:eq(1)',"#flex1").html();

	name=name.replace(/&nbsp;/g,' ');
	name=name.replace(/&amp;/g,'&');
	
	$("#f_rename").val(name);
	
	var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
	over.load();
	$("#sDiag_rename").show();
	$("#sDiag_tree").hide();
	$("#sDiag_upload").hide();
	$("#sDiag_move_tree").hide();
	$("#sDiag_properties").hide();
	$("#sDiag_create_dir").hide();	
	$("#shareDiag_title").html("Rename :");
}

function create_dir()
{
	var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
	over.load();
	$("#sDiag_create_dir").show();
	$("#sDiag_rename").hide();
	$("#sDiag_tree").hide();
	$("#sDiag_upload").hide();
	$("#sDiag_move_tree").hide();
	$("#sDiag_properties").hide();	
	$("#shareDiag_title").html("Create Dir :");
}

function upload()
{
	__read = mainFrame.get_read();
	if (__read == "yes")
	{
		jAlert( _T('_wfs','msg7'),_T('_common','error'));			
		return;
	}		
	
	var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
	over.load();
	
	document.form_upload.fileToUpload.value = "";
	$("#sDiag_upload").show();
	$("#sDiag_rename").hide();
	$("#sDiag_tree").hide();
	$("#sDiag_move_tree").hide();
	$("#sDiag_properties").hide();
	$("#sDiag_create_dir").hide();
	$("#shareDiag_title").html(_T('_wfs','upload')+" : ");
}

function properties()
{
	var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
	over.load();
	
	
	$("#sDiag_properties").show();
	$("#sDiag_upload").hide();
	$("#sDiag_rename").hide();
	$("#sDiag_tree").hide();
	$("#sDiag_move_tree").hide();
	$("#sDiag_create_dir").hide();
	$("#shareDiag_title").html(_T('_wfs','properties')+" : ");
			
	var name = mainFrame.$('.trSelected td:eq(0) span:eq(1)',"#flex1").html();
	var path = mainFrame.$('.trSelected span',"#flex1").html();
	var type = mainFrame.$('.trSelected td:eq(2) div',"#flex1").html();

	path=path.replace(/&nbsp;/g,' ');
	path=path.replace(/&amp;/g,'&');

		$.ajax({
		type: "POST",
		async: false,
		cache: false,
		url: "/cgi-bin/webfile_mgr.cgi",
		data: "cmd=cgi_get_properties&path="+encodeURIComponent(path),	
		dataType: "xml",
		success: function(xml){
			$(xml).find('status').each(function(){
			
				var change_time = $(this).find('change_time').text();	
				var modify_time = $(this).find('modify_time').text();	
				var access_time = $(this).find('access_time').text();	
				var owner = $(this).find('owner').text();
				var group = $(this).find('group').text();
				var permission = $(this).find('permission').text();				
								$("#p_name").html(name);
								$("#p_path").html(chg_path1(path));
								$("#p_type").html(type);

								$("#p_change_time").html(change_time);
								$("#p_modify_time").html(modify_time);
								$("#p_access_time").html(access_time);
	
								//rwx
								var owner_r = permission.substr(0,1);
								var owner_w = permission.substr(1,1);
								var owner_x = permission.substr(2,1);
								
								if (owner_r == "r") {owner_r = "<input id='owner_r' type='checkbox' checked >Read"} else {owner_r = "<input id='owner_r' type='checkbox'  >Read"} ;
								if (owner_w == "w") {owner_w = "<input id='owner_w' type='checkbox' checked >Write"} else {owner_w = "<input id='owner_w' type='checkbox'  >Write"};
								if (owner_x == "x") {owner_x = "<input id='owner_x' type='checkbox' checked >Execute"} else {owner_x = "<input id='owner_x' type='checkbox'  >Execute"};
								
								$("#p_permission_owner").html(owner_r+owner_w+owner_x);
									
								var owner_r = permission.substr(3,1);
								var owner_w = permission.substr(4,1);
								var owner_x = permission.substr(5,1);
									
								if (owner_r == "r") {owner_r = "<input id='user_r' type='checkbox' checked >Read"} else {owner_r = "<input id='user_r' type='checkbox'  >Read"} ;
								if (owner_w == "w") {owner_w = "<input id='user_w' type='checkbox' checked >Write"} else {owner_w = "<input id='user_w'  type='checkbox'  >Write"};
								if (owner_x == "x") {owner_x = "<input id='user_x' type='checkbox' checked >Execute"} else {owner_x = "<input id='user_x'  type='checkbox'  >Execute"};	
								
								$("#p_permission_user_group").html(owner_r+owner_w+owner_x);
								//$("#p_permission_owner").html(permission.substr(0,3));
								
								var owner_r = permission.substr(6,1);
								var owner_w = permission.substr(7,1);
								var owner_x = permission.substr(8,1);
									
								if (owner_r == "r") {owner_r = "<input id='other_r' type='checkbox' checked >Read"} else {owner_r = "<input id='other_r' type='checkbox'  >Read"} ;
								if (owner_w == "w") {owner_w = "<input id='other_w' type='checkbox' checked >Write"} else {owner_w = "<input id='other_w' type='checkbox'  >Write"};
								if (owner_x == "x") {owner_x = "<input id='other_x' type='checkbox' checked >Execute"} else {owner_x = "<input id='other_x'  type='checkbox'  >Execute"};	
								$("#p_permission_others").html(owner_r+owner_w+owner_x);		
								
								$("#p_owner").html(owner);
								$("#p_group").html(group);
											
			});
		},
		 error:function(xmlHttpRequest,error){   
  		 }
	});	

	
}
function do_query_HD_Mapping_Info()
{
	HDD_INFO_ARRAY = new Array();
	
	$.ajax({
		type: "POST",
		async: false,
		cache: false,
		url: "/cgi-bin/remote_backup.cgi",
		data: "cmd=cgi_get_HD_Mapping_Info",	
		dataType: "xml",
		success: function(xml){
			$(xml).find('item').each(function(){
			
				var info = $(this).find('data').text();	//Volume_1:/mnt/HD/HD_a2 
				
				HDD_INFO_ARRAY.push(info);
				
			});
		},
		 error:function(xmlHttpRequest,error){   
  		 }
	});	
}
function dialog_copy_init()
{
			$("#a_copy_ok").click(function(){			
				
				if (copy_file_main() == 1 ) return;
				$("#sDiag_tree").hide();
				$("#shareDiag").hide();
				
					
			});									
}
function dialog_move_init()
{
		$("#a_move_ok").click(function(){			
			if (move_file_main() == 1) return;
				$("#sDiag_tree").hide();
				$("#shareDiag").hide();
					
					
			});									
}
function dialog_rename_init()
{
	$("#a_rename_ok").click(function(){
		
			if (rename_file_main() == 1) return;
			$("#sDiag_rename").hide();
				$("#shareDiag").hide();
	});
	
	$("#a_create_folder_ok").click(function(){
		
			if (create_dir_main() == 1) return;
			$("#sDiag_create_dir").hide();
				$("#shareDiag").hide();
	});
	
}


function dialog_properties_init()
{
		$("#a_properties_ok").click(function(){
		
	__read = mainFrame.get_read();
	if (__read == "yes")
	{
		jAlert( _T('_wfs','msg7'),_T('_common','error'));			
		return;
	}		
			change_properties();
			$("#sDiag_properties").hide();
				$("#shareDiag").hide();
				var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
		over.close();		
	});
}

function copy_file_main()
{
	if (document.forms[0].text_id.value == "undefined")	 
	 {	 		
	 		jAlert(_T('_wfs','msg6'),_T('_common','error'));			
	 		return 1;
	}
		var len = mainFrame.$('.trSelected',"#flex1").length;
		
		if (len >= 1)
		{
			//多選
			
						mainFrame.$('.trSelected').each(function(index){
              		var path = $(this).find("span").html();
              		var type = $(this).find("td:eq(2) div").html();
              		var name = $(this).find("span:eq(1) ").html();               		
            			copy_file(path,type);
            });
		}
//		else
//		{
//			//按右鍵				
//				var path = mainFrame.__contextmenu;
//				var type = mainFrame.__contextmenu_type;
//				copy_file(path,type);
//		}		
		
		mainFrame.jQuery("#flex1").flexReload();  
		var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
		over.close();
}
function copy_file(path,type)
{
	 	path=path.replace(/&nbsp;/g,' ');
		path=path.replace(/&amp;/g,'&');
	 
		var _data = "cmd=cgi_cp&local=1&path="+encodeURIComponent(document.forms[0].text_id.value)+"&source_path="+encodeURIComponent(path)+"&type="+type;
		
		$.ajax({
					type:"POST",
					async:false,
					cache:false,
					url:"/cgi-bin/webfile_mgr.cgi",
					data:_data,
					success:function(data){		
					//	alert(data);													
					}
				});
			
}

function move_file_main()
{
		if ($("#id_now_path").val() == "")
	//if (document.forms[0].text_id.value == "undefined")	 
	 {	 		
	 		//jAlert("Please choice save upload file path.",_T('_common','error'));			
	 		jAlert( _T('_wfs','msg2'),_T('_common','error'));			
	 		return 1;
	}
		var len = mainFrame.$('.trSelected',"#flex1").length;
		
		if (len >= 1)
		{
			//多選
						mainFrame.$('.trSelected').each(function(index){
              		var path = $(this).find("span").html();
              		var type = $(this).find("td:eq(2) div").html();
              		var name = $(this).find("span:eq(1) ").html(); 
            			move_file(path,type);
            });
		}
//		else
//		{
//			//按右鍵				
//				var path = mainFrame.__contextmenu;
//				var type = mainFrame.__contextmenu_type;					
//				move_file(path,type);
//		}		
		
		mainFrame.jQuery("#flex1").flexReload();  
		var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
		over.close();
}
function move_file(path,type)
{
	 	path=path.replace(/&nbsp;/g,' ');
		path=path.replace(/&amp;/g,'&');
	 
		var _data = "cmd=cgi_move&local=1&path="+encodeURIComponent(document.forms[0].text_id.value)+"&source_path="+encodeURIComponent(path)+"&type="+type;
	//	alert(_data);
	
		$.ajax({
					type:"POST",
					async:false,
					cache:false,
					url:"/cgi-bin/webfile_mgr.cgi",
					data:_data,
					success:function(data){															
					}
				});
				
}

function download_file_main()
{
		var len = mainFrame.$('.trSelected',"#flex1").length;
		
		if (len >= 1)
		{
			//多選
						mainFrame.$('.trSelected').each(function(index){
              		var path = $(this).find("span").html();
              		var type = $(this).find("td:eq(2) div").html();
              		var name = $(this).find("span:eq(1) ").html();      
              		var size = $(this).find("td:eq(1) div").html();        	
              		//alert(size.substr(0,size.length-2));
              		if (size.substr(0,size.length-2)*100 > 200 && size.substr(size.length-2,2) == "GB")
              		{
	              		//alert("The download file size must be less than 2 GB");	              			              		
	              		jAlert( _T('_wfs','msg1'), _T('_common','error'));
              			return;
              		}
            			var over = $("#overlay").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
									over.load();		
									
									setTimeout("download_file(\""+path+"\",\""+type+"\",\""+name+"\")",500);
									
            });
		}
	
}
function download_file(path,type,name)
{
	var oBrowser = new detectBrowser();
	var browser;	
	
	if (oBrowser.isIE)
	{
		browser = "ie"
	}	
	else
				browser = "f"

	var v = name;	
	v=v.replace(/&nbsp;/g,' ');     
	v=v.replace(/&amp;/g,'&');    
	
	var t = path;	
	t=t.replace(/&nbsp;/g,' ');     
	t=t.replace(/&amp;/g,'&');        

	var tt = t;
	var index = t.lastIndexOf("/");	
	t = t.substr(0,index);	
	
	
	var _data = "cmd=cgi_compress&path="+encodeURIComponent(t) + "&type="+type + "&name="+ encodeURIComponent(v);		

	$.ajax({
					type:"POST",
					async:false,
					cache:false,
					url:"/cgi-bin/webfile_mgr.cgi",
					data:_data,
					success:function(data){		
						
							var over = $("#overlay").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});		
							over.close();			
																								
												mainFrame.document.form_download.path1.value = tt;				
												if (type == "Folder")
													mainFrame.document.form_download.path.value = t;											
												else	
													mainFrame.document.form_download.path.value = tt;											
    	 	                mainFrame.document.form_download.type.value = type;
    	 	                if (browser == "ie")
											 		mainFrame.document.form_download.name.value = encodeURIComponent(v);
											 	else	
											 		mainFrame.document.form_download.name.value = v;
											 	mainFrame.document.form_download.browser.value = browser;											 
											 	mainFrame.document.form_download.submit();
				}
	});
	

		
			
}
//判斷是否用IE瀏覽器
function detectBrowser()
 { 
  var sAgent = navigator.userAgent.toLowerCase();
  this.isIE = (sAgent.indexOf("msie")!=-1); //IE6.0-7
  this.isFF = (sAgent.indexOf("firefox")!=-1);//firefox
  this.isSa = (sAgent.indexOf("safari")!=-1);//safari
  this.isOp = (sAgent.indexOf("opera")!=-1);//opera
  this.isNN = (sAgent.indexOf("netscape")!=-1);//netscape
  this.isMa = this.isIE;//marthon
  this.isOther = (!this.isIE && !this.isFF && !this.isSa && !this.isOp && !this.isNN && !this.isSa);//unknown Browser
 }
function rename_file_main()
{
	
	var name = mainFrame.$('.trSelected td:eq(0) span:eq(1)',"#flex1").html();
	var path = mainFrame.$('.trSelected span',"#flex1").html();
	var type = mainFrame.$('.trSelected td:eq(2) div',"#flex1").html();
	
	var new_name = $("#f_rename").val();
	var new_name =new_name.replace(/ /g,'');


	if (new_name == "" && $("#f_rename").val().length != 0)
	{
		//	jAlert("Can't input blank characters.",_T('_common','error'));		
			jAlert(_T('_wfs','msg4'),_T('_common','error'));				 
			return 1;
	}	
	
	if ($("#f_rename").val() == "" ) 
	{
		//jAlert("Please input name.",_T('_common','error'));	
		jAlert(_T('_wfs','msg5'),_T('_common','error'));		
		return 1;
	}
	var ret = $("#f_rename").val();
	var flag=Chk_Folder_Name(ret);
	if(flag==1)	//function.js
	{
		//alert('The file name must not include the following characters: \\ / : * ? " < > | ')		
		jAlert( _T('_backup','msg4'), _T('_common','error'));
		
		return 1;
	}
	else if(flag==2)
	{
		//alert("Not a valid file name.")		
		jAlert( _T('_backup','msg5'), _T('_common','error'));
		return 1;	
	}
	
	if(ret.length > 226)
	{
		//alert("file name length should be 1-226.");		
		jAlert( _T('_backup','msg2')+ "226", _T('_common','error'));
		return 1;
	}
	
	var num = path.lastIndexOf("/");				
	var new_path = path.substr(0,num+1)+$("#f_rename").val();			

	
	path=path.replace(/&nbsp;/g,' ');
	path=path.replace(/&amp;/g,'&');
	
	new_path=new_path.replace(/&nbsp;/g,' ');
	new_path=new_path.replace(/&amp;/g,'&');
	
		var _data = "cmd=cgi_rename&path="+encodeURIComponent(new_path)+"&source_path="+encodeURIComponent(path)+"&type="+type;
//		alert(_data);
	
		$.ajax({
					type:"POST",
					async:false,
					cache:false,
					url:"/cgi-bin/webfile_mgr.cgi",
					data:_data,
					success:function(data){			
						//alert(data);	
						mainFrame.jQuery("#flex1").flexReload();  											
						//reload tree
						mainFrame.$('#tree_container').fileTree_webfile({ cmd: 'cgi_read_open_tree', script:'/cgi-bin/folder_tree.cgi',function_id:'webfile'}, function(file) { });        
						mainFrame.$('#tree_container').fileTree_webfile({ cmd: 'cgi_read_open_tree', script:'/cgi-bin/folder_tree.cgi',function_id:'webfile'}, function(file) { });        										
					}
				});
			
		
		var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
		over.close();		
		
}


	function ajaxFileUpload()
	{
			if ($("#fileToUpload").val() == 0)
			{
				//jAlert("Please choice file.",_T('_common','error'));		
				jAlert( _T('_wfs','msg6'), _T('_common','error'));			
				return;
			}
			if (mainFrame.__str == "/mnt/HD")
			{				
				//jAlert("Please choice save upload file path.",_T('_common','error'));	
				jAlert( _T('_wfs','msg3'), _T('_common','error'));		
				return;
			}
			
			var overlayObj=$("#overlay").overlay({expose: '#000',api:true,closeOnClick:false,closeOnEsc:false});
		overlayObj.load();
			
//		$("#loading")
//		.ajaxStart(function(){
//			$(this).show();
//		})
//		.ajaxComplete(function(){
//			$(this).hide();
//		});
		//alert(mainFrame.__str);
		//mainFrame.__str = decodeURIComponent(mainFrame.__str);
	//	alert(encodeURIComponent(mainFrame.__str));	
		
		$.ajaxFileUpload
		(
			{								
				url:'/cgi-bin/webfile_mgr.cgi',
				secureuri:false,
				fileElementId:'fileToUpload',		
				cmd:'cgi_upload',		
				filePath:mainFrame.__str,
				success: function (data, status)
				{
					mainFrame.jQuery("#flex1").flexReload();  	
					var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
					over.close();		
					overlayObj.close();
				},
				error: function (data, status, e)
				{
					alert(e);
				}
			}
		)
		
		return false;

	}
//function create_dir_main()
//{
////		var name = mainFrame.$('.trSelected td:eq(0) div:eq(1)',"#flex1").html();
////	var path = mainFrame.$('.trSelected span',"#flex1").html();
////	var type = mainFrame.$('.trSelected td:eq(2) div',"#flex1").html();
//	
//	var path = mainFrame.$("#id_now_path").val();
//	if (path == "")
//	{
//		jAlert("Please choice create folder path.",_T('_common','error'));		
//		return 1
//	}
//	if ($("#f_name").val() == "" ) 
//	{
//		jAlert("Please input name",_T('_common','error'));		
//		return 1;
//	}
//	var ret = $("#f_name").val();
//	var flag=Chk_Folder_Name(ret);
//	if(flag==1)	//function.js
//	{
//		alert('The folder name must not include the following characters: \\ / : * ? " < > | ')		
//		return 1;
//	}
//		else if(flag==2)
//		{
//			alert("Not a valid folder name.")		
//			return 1;	
//		}
//		
//		if(ret.length > 226)
//		{
//			alert("folder name length should be 1-226.");		
//			return 1;
//		}
//	
//
//	path=path.replace(/&nbsp;/g,' ');
//	path=path.replace(/&amp;/g,'&');
//
//	var _data = "cmd=cgi_create_dir&path="+encodeURIComponent(path)+"&name="+$("#f_name").val();
//	
//		alert(_data);
//		
//		return;
//	
//		$.ajax({
//					type:"POST",
//					async:false,
//					cache:false,
//					url:"/cgi-bin/webfile_mgr.cgi",
//					data:_data,
//					success:function(data){			
//						//alert(data);	
//						mainFrame.jQuery("#flex1").flexReload();  											
//					}
//				});
//			
//		
//		var over = $("#shareDiag").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
//		over.close();	
//}
function chg_path1(path)
{
	var new_path="";
	
	for(k=0;k<HDD_INFO_ARRAY.length;k++)
	{
		var str=HDD_INFO_ARRAY[k].split(":");	//Volume_1:/mnt/HD/HD_a2d
		
		if(path.indexOf(str[1])!=-1)
		{
			if(path==str[1])
				new_path = str[0];
			else
				new_path=str[0]+ path.substring(13,path.length);
		}
	}
	
	new_path=new_path.replace(/\s/g,'&nbsp;');
	return new_path;
}
function change_properties()
{
	var r = 0,w = 0,x = 0;
	var owner = 0;
	var user = 0;
	var other = 0;
	if ($("#owner_r").attr("checked") == true) r = 4;
	if ($("#owner_w").attr("checked") == true) w = 2;
	if ($("#owner_x").attr("checked") == true) x = 1;	
	owner = r + w +x;
	
	r = 0,w = 0,x = 0; 
	if ($("#user_r").attr("checked") == true) r = 4;
	if ($("#user_w").attr("checked") == true) w = 2;
	if ($("#user_x").attr("checked") == true) x = 1;
	user = r+w+x;
	
	r = 0,w = 0,x = 0; 
	if ($("#other_r").attr("checked") == true) r = 4;
	if ($("#other_w").attr("checked") == true) w = 2;
	if ($("#other_x").attr("checked") == true) x = 1;
	other = r+w+x;
	
	var permission = owner.toString()+user.toString()+other.toString();	
	
	var path = mainFrame.$('.trSelected span',"#flex1").html();
	var type = mainFrame.$('.trSelected td:eq(2) div',"#flex1").html();
	
	path=path.replace(/&nbsp;/g,' ');
	path=path.replace(/&amp;/g,'&');
	
	var _data = "cmd=cgi_change_permision&path="+encodeURIComponent(path)+"&type="+type+"&permission="+permission;
	
		$.ajax({
					type:"POST",
					async:false,
					cache:false,
					url:"/cgi-bin/webfile_mgr.cgi",
					data:_data,
					success:function(data){			
											
					}
				});
	
	
}