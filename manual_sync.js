var __file = 0;	
var __chkflag = 0;	//for show check box	1:show	0:not
var __str = "";
var __str_parent = "";


var __move = 0;   /* 是否要移動  1:移動true 0: 移動false */
var __source_path = 0; /*移動資料的來源路徑*/
var __source_type = 0;  /*移動資料的來源型態 Folder/檔案    */

var __contextmenu = 0;   /*push right button -> file path*/
var __contextmenu_type = 0 /*push right button-> file type*/
var __path = 0;
var __read;

var __first = 0;
function get_read()
{
	return __read;
}
$(document).ready(function(){	
	

if (parent.HD_Status(0) == 0)
{
	$("#id_up").removeClass("button").addClass("button_display");
	$("#id_upload").removeClass("button").addClass("button_display");
	$("#id_donwload").removeClass("button").addClass("button_display");
	$("#id_refresh").removeClass("button").addClass("button_display");
}	
	
	
$('#tree_container').fileTree_webfile({ root: '/mnt/HD' ,cmd: 'cgi_read_open_tree', script:'/cgi-bin/folder_tree.cgi',function_id:'webfile'}, function(file) { });        



		$("#id_up").click(function(){				
		
			if($("#id_up").hasClass("button"))
			{
				var v = $("#id_now_path").html();
				var o = $("#id_now_path").html();
					var num = __str.lastIndexOf("/");				
					__str  = __str.substr(0,num);							
					__str = unescape(__str);				
					
					
						v = v.substr(0,v.length -1);
						
			
					var num = v.lastIndexOf("/");
						
					var new_path = $("#id_now_path").html().substr(0,num+1);
					
					
					if (o != "Volume_1/" && o != "Volume_2/")
					{
						$("#id_now_path").html(new_path);
					}	
	
						$('#tree_container').fileTree_webfile({ cmd: 'cgi_read_open_tree', script:'/cgi-bin/folder_tree.cgi',function_id:'webfile'}, function(file) { });        
						$('#tree_container').fileTree_webfile({ cmd: 'cgi_read_open_tree', script:'/cgi-bin/folder_tree.cgi',function_id:'webfile'}, function(file) { });        
			}		
				
		});

		$("#id_upload").click(function(){	
			if($("#id_upload").hasClass("button"))	parent.upload();					
		});
		
		$("#id_donwload").click(function(){	
			if($("#id_donwload").hasClass("button"))
			{	
				 	var path = $('.trSelected td:eq(0) span',"#flex1").html() 
				 	var name = $('.trSelected span:eq(1)',"#flex1").html() 				 	
				 	var type = $('.trSelected td:eq(2) div',"#flex1").html() 
				 					 	
					if (path == null)
					{							
							//parent.jAlert("Please select download file.",parent._T('_common','error'));			
							parent.jAlert( _T('_wfs','msg2'), _T('_common','error'));  
							return;
					}
					var size =  $('.trSelected td:eq(1) div',"#flex1").html()  	
		      		//alert(size.substr(0,size.length-2));
		      		if (size.substr(0,size.length-2)*100 > 200 && size.substr(size.length-2,2) == "GB")
		      		{
		        		//alert("The download file size must be less than 2 GB");	
		        		parent.jAlert( _T('_wfs','msg1'), _T('_common','error'));              			              		
		      			return;
		      		}
			 					 
			 			var over = parent.$("#overlay").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});
						over.load();		
						
						setTimeout("parent.download_file(\""+path+"\",\""+type+"\",\""+name+"\")",500);			 			
        }
		
		});
		
		$("#id_refresh").click(function(){	
			if($("#id_refresh").hasClass("button")) jQuery("#flex1").flexReload();    
		});
		
			$("#tree_container").resizable({
		handles:"n, e,"	
	});
	
	$("#id_create_dir").click(function(){	
	
				parent.create_dir();					
		});
	

	$(".customerRow").contextMenu({ menu: 'myMenu' }, 
       																function(action, el, pos) { contextMenuWork(action, el, pos); });					       																     																		       											
							      																
	$("#tree_container A").contextMenu1({ menu: 'myMenu1' }, 
       																function(action, el, pos) { contextMenuWork1(action, el, pos); });	
		
	
	
	setTimeout(init_table,700);	
	language();
	
});


function init_table()
{
	var w;
	w = $(window).width() - 670;
	
	if (w < 100 ){w=100;}
        var ww;
        ww = $(window).width() - 240;
        if (ww < 0 ) ww = 100;
		 //get share list
  $("#flex1").flexigrid({        
		url: '/cgi-bin/webfile_mgr.cgi',    
		dataType: 'xml',
		cmd: 'cgi_folder_content',
		colModel : [
			{display: _T('_device','name') , name : 'name', width :  w, sortable : false, align: 'left'},		  
		  {display: _T('_wfs','size') , name : 'size', width : 80, sortable : false, align: 'left'},
		  {display: _T('_wfs','type') , name : 'type', width : 100, sortable : false, align: 'left'},
		  {display: _T('_wfs','modified') , name : 'modify_time', width : 200, sortable : false, align: 'left'}		  
		  ],
		usepager: true,
		useRp: true,
		rp: 10,
		showTableToggleBtn: true,		
//		width: $(window).width() - 240,
	        width: ww,
		height: 240,
		errormsg: _T('_common','connection_error'),
		nomsg: _T('_common','no_items'),
		singleSelect:true,		
		async:true,
		used_dir:'/var/ccc/',
		id:'id1'
  });
  
  	
	parent.dialog_copy_init(); 
	parent.dialog_move_init();
	parent.dialog_rename_init();
	parent.dialog_properties_init();
	
	if ($(window).height()-50 > 350)
 		$("#tree_container").css('height',$(window).height()-50 + "px");
 		
 	jScrollPane_resize("#my_scroll");	
	$('#my_scroll').jScrollPane({showArrows:true, scrollbarWidth: 15, arrowSize: 16});	  
 		
 	
}
function detail(v)
{
	v.href = "#"
	return false;
}


// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS.
var IE = document.all?true:false

// If NS -- that is, !IE -- then set up for mouse capture
if (!IE) document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0
var dragEnd_tempX = 0;

// Main function to retrieve mouse x-y pos.s

function getMouseXY(e) {
  if (IE) { // grab the x-y pos.s if browser is IE
    tempX = event.clientX + document.body.scrollLeft
    tempY = event.clientY + document.body.scrollTop
  } else {  // grab the x-y pos.s if browser is NS
    tempX = e.pageX
    tempY = e.pageY
  }  
  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0}
  if (tempY < 0){tempY = 0}  
  // show the position values in the form named Show
  // in the text fields named MouseX and MouseY
//  document.Show.MouseX.value = tempX
//  document.Show.MouseY.value = tempY

 
  return true
}
	 function contextMenuWork(action, el, pos) {

        switch (action) {
            case "Download":
                {                           		
                	  parent.download_file_main();       
                    break;
                }
            case "Copy":
              {                 	              	
              		parent.copy();              		
                  break;
	              }
   
            case "Move":
                {                    		
                		parent.move();                    
                    break;
                }
						case "Delete":
                {        
                	if (__read == "yes")
									{
										parent.jAlert( _T('_wfs','msg7'),_T('_common','error'));			
										return;
									}		     
                	var len = $('.trSelected',"#flex1").length;                
                	var flag = confirm("Are you sure you want to delete the selected file(s)?")
                	if (flag == true)
                	{
                	//	var str = "path:"+__contextmenu +"\n" + "type:"+__contextmenu_type;
                		//alert(str);
                	//	var _data = "cmd=cgi_del&path="+__contextmenu+"&type="+__contextmenu_type;
										 	
												if (len > 1)
			                	{
					                	$('.trSelected').each(function(index){
						                		var path = $(this).find("span").html();
						                		var type = $(this).find("td:eq(2) div").html();
						                		var name = $(this).find("span:eq(1)").html();						                		
					                			del_file(path,type);
					                	});
					              }
					              else 
					              {
					              	path = __contextmenu;
					              	type = __contextmenu_type;
					              	del_file(path,type);
					              }	  	
              		
              		jQuery("#flex1").flexReload();    
                	}
                    break;
                }
            case "Rename":
                {         
                		parent.rename();           
                    break;
                }
            case "Properties":
              {          
									parent.properties();        		          
                  break;
              }    
        }

   }
   
function contextMenuWork1(action, el, pos)
{	
		switch (action) 
		{
					case "Move":
					{     
							if (__read == "yes")
							{
								parent.jAlert(  _T('_wfs','msg7'),_T('_common','error'));			
								return;
							}
							
							__source_path=__source_path.replace(/&nbsp;/g,' ');
							__source_path=__source_path.replace(/&amp;/g,'&');	

							var _data = "cmd=cgi_move&path="+encodeURIComponent(__path)+"&source_path="+encodeURIComponent(__source_path)+"&type="+__source_type;
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
											
												jQuery("#flex1").flexReload();  
								dragEnd_tempX = 0;								
								__source_path = 0;	
						disable_menu();
						break;
						 break;
					}	
					case "Copy":
					{  											
							__source_path=__source_path.replace(/&nbsp;/g,' ');
							__source_path=__source_path.replace(/&amp;/g,'&');					
							
							var _data = "cmd=cgi_cp&path="+encodeURIComponent(__path)+"&source_path="+encodeURIComponent(__source_path)+"&type="+__source_type;
							//alert(_data);
							 				$.ajax({
														type:"POST",
														async:false,
														cache:false,
														url:"/cgi-bin/webfile_mgr.cgi",
														data:_data,
														success:function(data){	
													//		alert(data);														
														}
													});
											
												jQuery("#flex1").flexReload();  
								dragEnd_tempX = 0;								
								__source_path = 0;	
						disable_menu();
						break;
						   
					}	
					
		} 
}

function disable()
{
	$("#tree_container LI A").disableContextMenu("contextMenu1"); 
}

function del_file(path,type)
{
	if (__read == "yes")
	{
		parent.jAlert(  _T('_wfs','msg7'),_T('_common','error'));			
		return;
	}
	
	path=path.replace(/&nbsp;/g,' ');
	path=path.replace(/&amp;/g,'&');
	
	var _data = "cmd=cgi_del&path="+encodeURIComponent(path)+"&type="+type;

	$.ajax({
				type:"POST",
				async:false,
				cache:false,
				url:"/cgi-bin/webfile_mgr.cgi",
				data:_data,
				success:function(data){																						
							$('#tree_container').fileTree_webfile({ cmd: 'cgi_read_open_tree', script:'/cgi-bin/folder_tree.cgi',function_id:'webfile'}, function(file) { });        
						  $('#tree_container').fileTree_webfile({ cmd: 'cgi_read_open_tree', script:'/cgi-bin/folder_tree.cgi',function_id:'webfile'}, function(file) { });        																												
				}
			});
}


function init()
{
//	$("#tree_container LI A").contextMenu1({ menu: 'myMenu1' }, 
//       																function(action, el, pos) { contextMenuWork1(action, el, pos); });			

	$("#tree_container LI A").contextMenu1({ menu: 'myMenu1' }, 
       																function(action, el, pos) { contextMenuWork1(action, el, pos); });			
}
function enable_menu()
{	
	$("#tree_container LI A").enableContextMenu();
}
function disable_menu()
{
	$("#tree_container LI A").disableContextMenu();		
}

