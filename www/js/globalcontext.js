function getInstancer() {
	this.getObject = function(objectName) {
		var o = eval("new "+objectName+"()");
		return o;
	}
};


function Anywhere() {
	this.getWSAnywhere_context = function() {
		return "http://www.anywhere.cl/fides/ws1/"; //prod
		//return "http://www.anywhere.cl/wsprogestionchilebi/";
		//return "http://192.168.100.14:8090/fides/ws1/"; //LOCAL PANCHO  
		//return "http://192.168.1.5:8080/wsprogestionchilebi/"; 
	};

	this.getWSAnywjere_contextEjeCore = function() { 
		return "http://www.anywhere.cl/fides/ws2/"; // prod  
		//return "http://192.168.100.14:8080/fides/ws2/"; // LOCAL PANCHO
		//return "http://localhost:8080/wsprogestionchilebi2/"; 
		//return "http://localhost:8090/web/";
	};
	
	this.getAnywhere_context = function() {
		return "http://www.anywhere.cl/fides/ws1/"; //prod
		//return "http://www.anywhere.cl/wsprogestionchilebi/";
		//return "http://192.168.1.6:8080/progestionchilebi/";
		//return "http://localhost:8080/fides/ws1/";

	}; 
	

}


function Config() {
	/*	Clustered:
	 * 	INDICA SI EL PROGRAMADA ESTA CLUSTERIZADO POR LOCAL,
	 *  2015-05-07,
	 *  A la fecha existe un problema cuando estÃ¡ clusterizado, ya que demora mucho tiempo al hacer 1 peticiÃ³n por cada posibilidad.  
	 *  Sin embargo, de igual manera funciona.
	 * */
	
	this.clustered = false; //Ya no aplica
	this.wInitCache = function() {
		return true;
	};
	
	this.wCache = function() {
		return true;
	};
	
	this.dropDatabasesOnInit = function() {
		return false;
	};
	
	this.isOnlyOneRequest = function() {
		return true;
	};
	
	this.getIdSender = function() {
		return "456543884918";
	};
	
	this.getCompanyName = function() {
		return "Progesti&oacute;n";
	};
	
	this.getStaticUsuario = function() {
		return "";
	};
	
	this.getStaticClave = function() {
		return "";
	};
	
	this.getUnicClient = function() {
		/* 6  Mars
		 * 13 Burstbee
		 * 14 MarsTT
		 * 17 Agrosuper
		 * 21 P&G
		 * 23 Mars Choco
		 * 24 Kimberly Clark
		 * * cualquiera
		 * */
		return "*";
	};
	
	this.getMethodStorage = function() {
		/*
		 * html5,WindowLocalStorage
		 * */
		
		return "WindowLocalStorage";
		//return "html5";
	}
}

function ConfigPostLogin() {
	this.solicitarIngresoInOutObligatorio = function(javascriptFunc) {
		var cluster = new Cluster();
		cluster.getModulos(function(modulos) {
			var haveInOut = false;
			$.each(modulos, function(k,v) {
				if(v.idproducto == "4") {
					haveInOut = true;
				}
			});
			
			if(javascriptFunc != null) {
				var f = eval(javascriptFunc);
				f(haveInOut);
			}
		});
	 
		 
	};
}

function Cluster() {

	
	this.getClientes = function(funcJavascript) {
		var map = new MapSQL("dataSQL");
		map.get("cluster",function(o) {
			var jsonCluster = null;
			
			try {
				jsonCluster = JSON.parse(o.data);
			}
			catch(e) {
				jsonCluster = {};
			}
			
			if(funcJavascript != null) {
				if( jsonCluster.clientes != null) {
					if( jsonCluster.clientes.length >= 1) {
						var f = eval(funcJavascript);
						f(jsonCluster.clientes[0]);		
					}
				}
			}				
		});
	};
	
	this.getModulos = function(funcJavascript) {
		var map = new MapSQL("dataSQL");
		map.get("cluster",function(o) {
			var jsonCluster = null;
			
			try {
				jsonCluster = JSON.parse(o.data);
			}
			catch(e) {
				jsonCluster = {};
			}
			
			if(funcJavascript != null) {
				if( jsonCluster.modulos != null) {
					if( jsonCluster.modulos.length >= 1) {
						var f = eval(funcJavascript);
						f(jsonCluster.modulos);		
					}
				}
			}				
		});
	}
	
 
}

function InOutUtils() {
	InOutUtils.prototype.isInside = function(functionIsInside) {
		if(functionIsInside == null) return;
		  
	
			//console.log("getUsuario!!!!");
			
			var success = function(data,status,jqXHR) {
 			
				var funcReturn = eval(functionIsInside);
				
				var version = new Version();
				version.getVersions(function(versions) {
					var map = new MapSQL("PRESENCIA");
					map.get("idregistro", function(value1) {		
						map.get("horaingreso", function(value2) {	
							if(value1 != null && value1.data != null) {
								console.log("return YES, IT IS INSIDE");
								FunctionTool.evalFunction(funcReturn,true, { idregistro : value1.data , horaingreso : value2.data } , versions);
							}
							else {
								console.log("return NO, NO IS INSIDE");
								FunctionTool.evalFunction(funcReturn,false, { idregistro : "0" , horaingreso :  "" } , versions);
							}
						});
						
					})
				});

			};
			
			var eje = new AnywhereManager();
		 
			var p = {
					success : success,
					error : success
			}
 
			
			eje.getClaseWeb(true, "anywhere_movil_restanywhere", "Presencia", "get", p ,success);
			
		  
		
	};
	
	InOutUtils.prototype.setInside = function(idregistro) {
		console.log(idregistro);
		
		var map = new MapSQL("PRESENCIA");
		map.add("idregistro", idregistro);	
		
		var seconds = 0;
		var minutes = 0;
		var hour = 0;
		try {
			seconds = new Date().getSeconds();
			minutes =new Date().getMinutes();
			hour = new Date().getHours();
		}
		catch(e) {
			console.log(e);
		}
		
		map.add("horaingreso", hour+":"+minutes+":"+seconds);
	}
	
	InOutUtils.prototype.setOut = function() {
		var map = new MapSQL("PRESENCIA");
		map.delAll();	
	}
}
 
function IposPagerUtil() {
	this.init = function() {
		
	}
	
	
}

function Validar() {
 
	this.validarEmail = function(email) {
			expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		    if ( !expr.test(email) )
		      return false;
		    else
		      return true;
	};
	
	this.revisarDigito = function ( dvr )
	{	
		dv = dvr + ""	
		if ( dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k'  && dv != 'K')	
		{		
			return false;	
		}	
		return true;
	}

	this.revisarDigito2 = function( crut )
	{	
		largo = crut.length;	
		if ( largo < 2 )	
		{		
			return false;	
		}	
		if ( largo > 2 )		
			rut = crut.substring(0, largo - 1);	
		else		
			rut = crut.charAt(0);	
		dv = crut.charAt(largo-1);	
		this.revisarDigito( dv );	

		if ( rut == null || dv == null )
			return 0	

		var dvr = '0'	
		suma = 0	
		mul  = 2	

		for (i= rut.length -1 ; i >= 0; i--)	
		{	
			suma = suma + rut.charAt(i) * mul		
			if (mul == 7)			
				mul = 2		
			else    			
				mul++	
		}	
		res = suma % 11	
		if (res==1)		
			dvr = 'k'	
		else if (res==0)		
			dvr = '0'	
		else	
		{		
			dvi = 11-res		
			dvr = dvi + ""	
		}
		if ( dvr != dv.toLowerCase() )	
		{			
			return false	
		}

		return true
	}

	this.validarRut = function (texto)
	{	
		var tmpstr = "";	
		for ( i=0; i < texto.length ; i++ )		
			if ( texto.charAt(i) != ' ' && texto.charAt(i) != '.' && texto.charAt(i) != '-' )
				tmpstr = tmpstr + texto.charAt(i);	
		texto = tmpstr;	
		largo = texto.length;	

		if ( largo < 2 )	
		{		
			return false;	
		}	

		for (i=0; i < largo ; i++ )	
		{			
			if ( texto.charAt(i) !="0" && texto.charAt(i) != "1" && texto.charAt(i) !="2" && texto.charAt(i) != "3" && texto.charAt(i) != "4" && texto.charAt(i) !="5" && texto.charAt(i) != "6" && texto.charAt(i) != "7" && texto.charAt(i) !="8" && texto.charAt(i) != "9" && texto.charAt(i) !="k" && texto.charAt(i) != "K" )
	 		{				
				return false;		
			}	
		}	

		var invertido = "";	
		for ( i=(largo-1),j=0; i>=0; i--,j++ )		
			invertido = invertido + texto.charAt(i);	
		var dtexto = "";	
		dtexto = dtexto + invertido.charAt(0);	
		dtexto = dtexto + '-';	
		cnt = 0;	

		for ( i=1,j=2; i<largo; i++,j++ )	
		{		
 	
			if ( cnt == 3 )		
			{			
				dtexto = dtexto + '.';			
				j++;			
				dtexto = dtexto + invertido.charAt(i);			
				cnt = 1;		
			}		
			else		
			{				
				dtexto = dtexto + invertido.charAt(i);			
				cnt++;		
			}	
		}	

		invertido = "";	
		for ( i=(dtexto.length-1),j=0; i>=0; i--,j++ )		
			invertido = invertido + dtexto.charAt(i);	

		 

		if ( this.revisarDigito2(texto) )		
			return true;	

		return false;
	}
	
}

function SaveUtils() {
	this.consoleLog = true;
	
	this.getDefValue = function(object) {
		var length = null;
		var type = "text";
		
		try {
			/*MAPEA LOS TIPOS*/
			if($(object).attr("type") != null) {
				type = $(object).attr("type");
				
				if("text" == type) {
					if($(object).attr("data-role") == "date") {
						type = $(object).attr("data-role");
					}
				}
				else if("hidden" == type) {
					type = "text";
				}
				else if("radio" == type) {
					type = "text";
				}
			}
			
			/*MAPEA LOS LARGOS*/
			if(type == "text" ) {
				if($(object).attr("maxlength") != null) {
					length = $(object).attr("maxlength");
				}
				else {
					length = "250";
				}
			}
			
			/*retorna el objeto*/
			if( $(object).attr("type") == "radio") {
				return {"value"  		:$(object).is(':checked')? $(object).val() : null, 
					    "data-length" 	:length,
					    "data-type" 	:type }; 
			}
			else {
				return {"value"  		:$(object).val() , 
					    "data-length" 	:length,
					    "data-type" 	:type }; 	
			}   
		}
		catch(e) {
			//$("#errorContainer").html($("#errorContainer").html() + "<br/>" + e);
		}
	};
	
	this.simpleOrList = function(json, name, iterateObject, print) {
		var saveUtil = this;
		//02-06-2018
		//no funciona con no obligatorio aún
		
		if(name != null) {
			if(json[name] != null) {
					var o = saveUtil.getDefValue( $(iterateObject) );
					if(o.value != null) {
						if(!Array.isArray(json[name])) {
							if(json[name].value == null) {
								json[name] = o;	
							}
							else {
								var tmp = JSON.parse(JSON.stringify(json[name]));
								json[name] = [];
								json[name].push(tmp);
								
								json[name].push(o);
							}
						}
						else {
							json[name].push(o);
						}
					}
					else {
						console.log("nada");
					}
			}
			else {
				var o = saveUtil.getDefValue( $(iterateObject) );

				if(print && name == "gato_id_producto" ){
					console.log(o);	
				}
				json[name] = o;	
 
			}
		}
		

		return json;
	}
	
	this.transponeFilas = function(json, transformBoolean) {
		console.log("[transportandoFila]");
 
		/*
		 * Transpone todas las filas que comienzan con "g_row" y las transforma en columnas,
		 * la idea es pasar los parametros en forma de columna.
		 * */
		var cols = {} //nombre de columnas
		var vars = []; //	
		
		/*OBTIENE LAS VARIABLES QUE CON g_row*/
		jQuery.each(json, function(k,v) {
			if(k != null) {
				if( k.indexOf("g_row_") >= 0) {
					vars.push(k);
				}
			}
		});
		
		/*OBTIENE LOS NOMBRES DE COLUMNAS*/
		jQuery.each(vars, function(k,v) {
			//console.log(json[v].value);
			cols[json[v].value] = JSON.parse(JSON.stringify(json[v]))	;
		});
		
		/*POR CADA VARIABLE*/
		jQuery.each(vars, function(k,v) {
			/*POR CADA COLUMNA*/
			var jVar = JSON.parse(JSON.stringify(json[v]));
			var value = String(jVar.value);
 
			for (var key in cols) {
				if(key != null && key != "null") {
					if(json["gato_"+key] == null) {
						json["gato_"+key] = [];
					}
					
					var newJSON = JSON.parse(JSON.stringify(cols[value]));
					
	 				if( value == key) {
	 					newJSON=
						json["gato_"+key].push(newJSON);
					}
					else {
						newJSON.value = "";
						json["gato_"+key].push(newJSON);
					}
				}
			}
		});
		
 
	}
	
	this.getCorrectName = function(obj) {
		var name = $(obj).attr("name");
		if(name.indexOf("[") != -1) {
			name = name.replace(name.substring(name.indexOf("["),name.indexOf("]")+1),"");	
		}
		return name;
	}
	
	this.serializePage = function(idContextHtml, objAnywhere, json) {
		//console.log(json);
		
		if(json == null) {
			json = {};
		}
		
		//console.log(json);
		
		var saveUtil = this;
		
		try {
			if(objAnywhere != null) {
				json["cliente"]  = objAnywhere.getCliente();
				json["cadena"]   = objAnywhere.getCadena();
				json["local"]    = objAnywhere.getLocal();
				json["categoria"]= objAnywhere.getCategoria();
				json["producto"] = objAnywhere.getProducto();
			}
			
			
			/*para textos*/
			//console.log("cantidad de input[type=text]:"+$("#"+idContextHtml+" input[type=text]").length);
			$("#"+idContextHtml+" input[type=hidden]").each(function(){
				var name = saveUtil.getCorrectName($(this));
				json = saveUtil.simpleOrList(json, name, $(this), true);
			});
 			
			/*Para radios*/
			$("#"+idContextHtml+" input[type=radio]").each(function(){
				var name = saveUtil.getCorrectName($(this));
				json = saveUtil.simpleOrList(json, name, $(this));
			});

			
			/*para textos*/
			//console.log("cantidad de input[type=text]:"+$("#"+idContextHtml+" input[type=text]").length);
			$("#"+idContextHtml+" input[type=text]").each(function(){
				var name = saveUtil.getCorrectName($(this));
				json = saveUtil.simpleOrList(json, name, $(this));
			});
			
			/*para numeros*/
			//console.log("cantidad de input[type=number]:"+$("#"+idContextHtml+" input[type=number]").length);
			$("#"+idContextHtml+" input[type=number]").each(function(){
				var name = saveUtil.getCorrectName($(this));
				json = saveUtil.simpleOrList(json, name, $(this));
			});
			
			/*para fechas*/
			//console.log("cantidad de input[type=number]:"+$("#"+idContextHtml+" input[type=number]").length);
			$("#"+idContextHtml+" input[type=date]").each(function(){
				var name = saveUtil.getCorrectName($(this));
				json = saveUtil.simpleOrList(json, name, $(this));
			});
			
			
			/*para textareas*/
			//console.log("cantidad de textarea:"+$("#"+idContextHtml+" textarea").length);
			$("#"+idContextHtml+" textarea").each(function(){
				var name = saveUtil.getCorrectName($(this));
				json = saveUtil.simpleOrList(json, name, $(this));
			});
			
			/*para select*/
			//console.log("cantidad de selects:"+$("#"+idContextHtml+" select").length);
			$("#"+idContextHtml+" select").each(function(){
				var name = saveUtil.getCorrectName($(this));
				json = saveUtil.simpleOrList(json, name, $(this));
			});
			
			//console.log(json);
			saveUtil.transponeFilas(json, true);
		}
		catch(e) {
			//$("#errorContainer").html($("#errorContainer").html() + "<br/>" + e);
		}
		
		//console.log(json);
		return json;
	};
}


function Logger() {
	
	this.logStr = {};
	this.linea = 1;
	
	this.log = function(msg) {
		 
		this.logStr["linea"+this.linea] = {};
		this.logStr["linea"+this.linea]["msg"] = msg
		this.linea++;
	};
	
	this.logFunction = function(funcName,params,respuesta) {
		 
		this.logStr["linea"+this.linea] = {};
		this.logStr["linea"+this.linea]["function"]  = funcName
		this.logStr["linea"+this.linea]["params"]	 = params
		this.logStr["linea"+this.linea]["respuesta"] = respuesta
		this.linea++;
	};
	
	this.download = function() {
		//console.log("[download] logger.txt");
		this.saveAs(JSON.stringify(this.logStr), "logger.txt");
	};
	
	this.sendToSenver = function() {
		var any = new Anywhere();
		var vUrl = any.getWSAnywhere_context() + "EjeCoreI?claseweb=cl.imasd.any.web.Logger";
		var login = new Login();
		var localJson = this.logStr;
		
		login.getUsuario(function(usuario) {
			$.ajax({ 
				type: "POST",
				dataType:"json",
				url: vUrl,
				timeout:8000,
				async: true,
				data: { "json" : JSON.stringify(localJson) , usuario : JSON.stringify(usuario)  },
				crossDomain : true,
			 
				success: function(data) {
					 console.log("[@@@@Sended to server]");
				},
				 
			});
		});
		
	};
	
	this.saveAs = function(textToWrite, fileNameToSaveAs ) {
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
 

		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if (window.webkitURL != null)
		{
			// Chrome allows the link to be clicked
			// without actually adding it to the DOM.
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}
		else
		{
			// Firefox requires the link to be added to the DOM
			// before it can be clicked.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = destroyClickedElement;
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}

		downloadLink.click();
		 
	}
	
}

function GeoGlobal() {
	this.refreshGeo = function(javascriptXY, javascriptPoint) {
		var options = { enableHighAccuracy: true, timeout: 180000, maximumAge: 0 };
		
		var onSuccess = function onSuccess(position) {
			posLatitud = position.coords.latitude;
			posLongitud = position.coords.longitude;
			
			if(javascriptXY != null) {
				var f = eval(javascriptXY);
				f(posLatitud, posLongitud);
			}
			
			var geocoder = new google.maps.Geocoder();
			var latlng = new google.maps.LatLng(posLatitud,posLongitud);
			geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						pointAddress = results[0].formatted_address;
						
						if(javascriptPoint != null) {
							var f = eval(javascriptPoint);
							f(pointAddress);
						}
					} 
				 
				} 
				 
			});
			
			
		};
		
		var onError = function onError(err) {
			 
		};
		
		if (navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	    }
	 
		
	}
	
}

function DeviceInfo() {
	
	 
	
	this.getDeviceInfo = function(getServerVersion,func) {
		console.log("getDeviceInfo 1.1");
		
		
		
		
		var info = {};
	 
		setTimeout(function() {
			 try { info["model"]  		= device.model 		} catch(e) { info["model"] = "-Error-" };
			    try { info["cordova"]	= device.cordova 	} catch(e) { info["cordova"] = "-Error-" };
			    try { info["platform"]  = device.platform 	} catch(e) { info["platform"] = "-Error-" };
			    try { info["uuid"]  	= device.uuid 		} catch(e) { info["uuid"] = "-Error-" };
			    try { info["version"]  	= device.version 	} catch(e) { info["version"] = "-Error-" };
			    
			    try {
			    	info["app_version"] = AppVersion.version;
				    info["app_build"] = AppVersion.build;	
			    }
			    catch(e) {
			    	info["app_version"] = e.message;
				    info["app_build"] = e.message;
			    	console.log(e);
			    }
			    
			    if(getServerVersion) {
			    	var login = new Login();
					login.getUsuario(function(usuario) {
						var any = new Anywhere();
						$.ajax({ 
							type: "POST",
							dataType:"json",
							url: any.getWSAnywjere_contextEjeCore() + "EjeCoreI",
							timeout:8000,
							async: false,
							data: { "claseweb":"cl.imasd.view.sencha.anywhere.Conf", 
									"modulo":"anywhere_movil_restanywhere",
									"thing":"VersionApp",
									"accion":"get",
									"info": "["+JSON.stringify(info)+"]",
									"usuario": JSON.stringify(usuario)
							},
							crossDomain : true,
							success: function(data) {
								
								info["app_version_server"] = data.data[0].app_version_server;
							    info["app_build_server"] = data.data[0].app_build_server;
							    
							    var f = func;
							    f(info);
							},
							error : function() {
								info["app_version_server"] = info["app_version"];
							    info["app_build_server"] = info["app_build"];
							    
							    var f = func;
							    f(info);
							}
						});
					});
			    	 
			    }
			    else {
			    	 var f = func;
					 f(info);
			    }
			    
			    
		},1000);
	
	}
}

function Log() {
	this.showLog = function() {
	
		var popupMsg = new MasterPopup();
		popupMsg.alertPopup("Acualizando", $("#hiddenLog").val() );
		
	}
	
	this.addLog = function(txt) {
	
		$("#hiddenLog").val(  $("#hiddenLog").val() + "<br/>" + txt);
		
	}
};


function Version() {
	
	this.setThisVersion = function(lastVersion, funcJavascript) {
 
		var map = new MapSQL();
		map.del("getThisVersion", function() {
			map.add("getThisVersion",lastVersion, funcJavascript);
		});
	};
	
	this.getVersions = function(funcJavascript) {
		var oVersion = new Version();
		oVersion.getThisVersion(function(localThisVersion) {
			var oVersion = new Version();
			oVersion.getLastVersion(function(lastVersion) {
				var f = eval(funcJavascript);
				var json = {};
				json["thisVersion"] = localThisVersion.data;
				json["lastVersion"] = lastVersion;
				
				f(json);
			});
		});
	};
	
	this.getThisVersion = function(funcJavascript) {
		var map = new MapSQL();
		map.get("getThisVersion", function(valor) {
			if(valor == null) {
				valor = -1;
			}
			
			var f = eval(funcJavascript);
			f(valor);
		});
	};	
	
	this.getLastVersion = function(funcJavascript) {
		var retValue = -1;
		try {
			
			var login = new Login();
			login.getUsuario(function(usuario) {
				var any = new Anywhere();
				//var vUrl = any.getWSAnywhere_context() +"dispatcher?m=getVersion&c=Version&usuario="+JSON.stringify(usuario);
				var vUrl = any.getWSAnywjere_contextEjeCore() +"EjeCoreI";
				var localLastVersion = -1;
				
				$.ajax({ 
					type: "POST",
					dataType:"json",
					url: vUrl,
					timeout:8000,
					async: false,
					data: { "claseweb":"cl.imasd.view.sencha.anywhere.Conf", 
							"modulo":"anywhere_movil_restanywhere",
							"thing":"Version",
							"accion":"get",
							"idusuario":JSON.stringify(usuario)  },
					crossDomain : true,
					beforeSend : function() {
						$.mobile.loading("show");
					},
					success: function(data) {
						
						if(data.success == true) {
							localLastVersion = data.data[0].idmodeloActual;
						}	
					},
					error: function() {
						
					},
					complete: function() {
						$.mobile.loading("hide");
					}
				});
				
				var f = eval(funcJavascript);
				f(localLastVersion);
				
			});
			
			
		}
		catch(e) {
			console.log(e);
		}

		console.log("retValue:"+retValue);
		return retValue;
	};
	
}


function Parametros() {
	this.loadParametros = function(id, javascriptMethod) {
		var any = new Anywhere();
		var vUrl = any.getWSAnywhere_context() +"services/p2s/querys/parametros/"+id;
		
		var caller = new ServerCaller();
		caller.call({ 
			type: "GET",
			dataType:"json",
			url: vUrl ,
			async: false,
			crossDomain : true,
			success: function(data) {
				if(javascriptMethod != null && javascriptMethod != 'indefined') {
					var f = eval(javascriptMethod);
					f(data);
				}
			}
		
		});
	};
}

function JsTool() {
	this.getUrlParameter = function(sParam) {

		    var sPageURL = window.location.search.substring(1);
		    var sURLVariables = sPageURL.split('&');
		    
		    for (var i = 0; i < sURLVariables.length; i++) {
		        var sParameterName = sURLVariables[i].split('=');
		        
		        if (sParameterName[0] == sParam) {
		            return sParameterName[1];
		        }
		    }
	};
	
	this.onlyNumbers = function(input) {
		//$(input).val($(input).val().replace(/[^1-9\.]/g,''));
	};
}

function AnywhereManager() {
	var any = new Anywhere();
	
	AnywhereManager.prototype.clearCache = function() {
		var caller = new ServerCaller();
		caller.clearCache();
	};
	
	AnywhereManager.prototype.login = function(async, usuario , clave,  funcJavascript) {
		console.log("[AnywhereManager.login.begin] v.2015.09.2");
		
		
		/*
		    var vUrl = any.getWSAnywhere_context() + "dispatcher";
			var params = { "m" : "access" , "c" : "Login" ,rutPer : usuario, clave : clave };
		*/
		var vUrl = any.getWSAnywjere_contextEjeCore() + "EjeCoreI";

		var params = { "claseweb" : "cl.imasd.view.sencha.anywhere.Conf" ,
				       "modulo" : "anywhere_movil_restanywhere",
				       "thing" : "Login",
				       "accion":"get",
				       rutPer : usuario, 
				       clave : clave };
		
		var dataReturn = null;
		$.ajax({ 
			type: "GET",
			dataType:"json",
			url: vUrl ,
			async: false,
			data: params,
			crossDomain : true,
			cache: false,
			success: function(data) {
				console.log("[AnywhereManager.login.begin] success ");
				
				if(funcJavascript != null) {
					var funcSuccesLocal = eval(funcJavascript);
					dataReturn = funcSuccesLocal(data);
				}
			},
			error: function(error) {
				console.log("[Globalcontext.callServer.ajaxError]"+error+"  "+vUrl+" "+JSON.stringify(params));
				throw new Error("[Globalcontext.callServer.ajaxError]"+error+"  "+vUrl+" "+JSON.stringify(params));
			}
		});
		return dataReturn;
		console.log("[AnywhereManager.login.end]");
	};
	
	AnywhereManager.prototype.getConsultaTareasIn = function(/*async,*/ idCliente , idCadena, idLocal, idUsuario, funcJavascript) {
		console.log("[AnywhereManager.ConsultaTareasIn.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		/*
		if(async) {
				   this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", 
						   {m: "ConsultaTareasIn" , 
					   		c: "SaveHelper", 
					   		idCliente : idCliente, 
					   		idCadena : idCadena,
					   		idLocal : idLocal,
					   		idUsuario : idUsuario}, funcJavascript);
		}
		else {*/
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "services/alertasvarias/ConsultaTareasIn", 
					{idCliente : idCliente, 
		   			idCadena : idCadena,
		   			idLocal : idLocal,
		   			idUsuario : idUsuario});
		/*}*/	
		
		console.log("[AnywhereManager.ConsultaTareasIn.end]");
	};	
	
	
	AnywhereManager.prototype.getPerfilacion = function(async, funcJavascript) {
		//console.log("[AnywhereManager.getPerfilacion.begin]");
		/*
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "services/p2s/querys/perfilacionlogin/"+idUsuario, {},funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "services/p2s/querys/perfilacionlogin/"+idUsuario, {});
		}
		*/
		//console.log("[AnywhereManager.getPerfilacion.end]");
	};
	
	AnywhereManager.prototype.getClientes = function (async, funcJavascript) {
		//console.log("[AnywhereManager.getClientes.begin]");
		/*
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
				   this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getClientesFromUsuario", c: "UsuarioCliente", idusuario : idUsuario }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getClientesFromUsuario", c: "UsuarioCliente", idusuario : idUsuario });
		}
		*/
		//console.log("[AnywhereManager.getClientes.end]");
		
	};
	
	AnywhereManager.prototype.ipos_getCadenas = function(async, idCliente, funcJavascript) {
		console.log("[AnywhereManager.ipos_getCadenas.begin]");
		/*
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {"m": "getCadenaFromUsuario", "c": "UsuarioCliente", "idusuario" : idUsuario, "idcliente": idCliente }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {"m": "getCadenaFromUsuario", "c": "UsuarioCliente", "idusuario" : idUsuario, "idcliente": idCliente });
		}
		*/
		console.log("[AnywhereManager.ipos_getCadenas.end]");
	};
	
	AnywhereManager.prototype.ipos_getCadenasTT = function(async, idCliente, idRegion, idComuna, funcJavascript) {
		console.log("[AnywhereManager.ipos_getCadenasTT.begin]");
		
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {"m": "getCadenaFromClienteRegionComuna", "c": "UsuarioCliente", "idusuario" : idUsuario, "idcliente": idCliente, "idregion" : idRegion, "idcomuna": idComuna }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context()  + "dispatcher", {"m": "getCadenaFromClienteRegionComuna", "c": "UsuarioCliente", "idusuario" : idUsuario, "idcliente": idCliente, "idregion" : idRegion, "idcomuna": idComuna });
		}
		
		console.log("[AnywhereManager.ipos_getCadenasTT.end]");
	};
	
	AnywhereManager.prototype.ipos_getLocales = function(async, idCliente, idCadena, funcJavascript) {
		console.log("[AnywhereManager.ipos_getLocales.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getLocalesFromUsuario", c: "UsuarioCliente", idusuario : idUsuario , idcliente: idCliente, idcadena: idCadena }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getLocalesFromUsuario", c: "UsuarioCliente", idusuario : idUsuario , idcliente: idCliente, idcadena: idCadena });
		}
		
		console.log("[AnywhereManager.ipos_getLocales.end]");
	};
	
	AnywhereManager.prototype.ipos_getLocalesTT = function(async, idCliente, idRegion , idComuna, idCadena, funcJavascript) {
		console.log("[AnywhereManager.ipos_getLocalesTT.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getLocalFromClienteRegionComunaCadena", c: "UsuarioCliente", "idusuario" : idUsuario , "idcliente" : idCliente, "idcadena" : idCadena, "idregion":idRegion, "idcomuna" : idComuna }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher" , {m: "getLocalFromClienteRegionComunaCadena", c: "UsuarioCliente", "idusuario" : idUsuario , "idcliente" : idCliente, "idcadena" : idCadena, "idregion":idRegion, "idcomuna" : idComuna });
		}
		
		console.log("[AnywhereManager.ipos_getLocalesTT.end]");
	};
	
	AnywhereManager.prototype.ipos_getRegiones = function(async, idCliente,  funcJavascript) {
		console.log("[AnywhereManager.ipos_getRegiones.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getRegionFromCliente", c: "UsuarioCliente", idusuario : idUsuario , idcliente: idCliente }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getRegionFromCliente", c: "UsuarioCliente", idusuario : idUsuario , idcliente: idCliente });
		}
		
		console.log("[AnywhereManager.ipos_getRegiones.end]");
	};
	
	AnywhereManager.prototype.ipos_getComunas = function(async, idCliente, idRegion, funcJavascript) {
		console.log("[AnywhereManager.ipos_getComunas.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getComunaFromClienteRegion", c: "UsuarioCliente", idusuario : idUsuario , idcliente: idCliente, idregion: idRegion }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getComunaFromClienteRegion" , c: "UsuarioCliente", idusuario : idUsuario , idcliente: idCliente, idregion: idRegion });
		}
		
		console.log("[AnywhereManager.ipos_getComunas.end]");
	};
	
	AnywhereManager.prototype.ipos_getDistribuidores = function(async, idCliente, idRegion,idComuna,idCadena, funcJavascript) {
		console.log("[AnywhereManager.ipos_getDistribuidores.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getDistribuidorFromClienteRegionComunaCadena", c: "UsuarioCliente", idusuario : idUsuario , idcliente: idCliente, idregion: idRegion, idcomuna: idComuna, idcadena: idCadena }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getDistribuidorFromClienteRegionComunaCadena" , c: "UsuarioCliente", idusuario : idUsuario , idcliente: idCliente, idregion: idRegion, idcomuna: idComuna, idcadena: idCadena });
		}
		
		console.log("[AnywhereManager.ipos_getDistribuidores.end]");
	};
	
	AnywhereManager.prototype.ipos_getCategorias = function(async, idCliente, funcJavascript, idGrupo) {
		console.log("[AnywhereManager.ipos_getCategorias.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
				   this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getCategoriaFromUsuario", c: "UsuarioCliente", "padreparametro":idGrupo, idcliente: idCliente }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getCategoriaFromUsuario", c: "UsuarioCliente" , "padreparametro":idGrupo, idcliente: idCliente });
		}
		
		console.log("[AnywhereManager.ipos_getCategorias.end]");
	};
	
	AnywhereManager.prototype.ipos_getProductos = function(async, idCliente, idLocal, idCategoria, funcJavascript) {
		console.log("[AnywhereManager.ipos_getProductos.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		console.log("[ipos_getProductos]");
		if(async) {
				   this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {"idlocal": idLocal, m: "getProductoFromUsuario", c: "UsuarioCliente", idcliente: idCliente, "idcategoria" : idCategoria }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {"idlocal": idLocal, m: "getProductoFromUsuario", c: "UsuarioCliente" , idcliente: idCliente, "idcategoria": idCategoria });
		}
		
		console.log("[AnywhereManager.ipos_getProductos.end]");
	};
	
	AnywhereManager.prototype.ipos_getPromociones = function(async, idCliente, idCadena, funcJavascript) {
		console.log("[AnywhereManager.ipos_getPromociones.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
				   this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getPromocionesFromUsuario", c: "UsuarioCliente", idcliente: idCliente, idcategoria: idCadena }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getPromocionesFromUsuario", c: "UsuarioCliente" , idcliente: idCliente, idcategoria: idCadena });
		}
		
		console.log("[AnywhereManager.ipos_getProductos.end]");
	};
	
	
	AnywhereManager.prototype.imarket_getCompetidores= function(async, idCliente , funcJavascript) {
		console.log("[AnywhereManager.imarket_getCompetidores.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
				   this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getData", c: "Competidor", idcliente : idCliente }, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getData", c: "Competidor", idcliente : idCliente });
		}
		
		console.log("[AnywhereManager.imarket_getCompetidores.end]");
	};
	
	AnywhereManager.prototype.imarket_getCategoriaCompetidores= function(async, idCliente , funcJavascript) {
		console.log("[AnywhereManager.imarket_getCategoriaCompetidores.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
				   this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getCategoriaCompetidoresFromCliente", c: "UsuarioCliente", idcliente: idCliente}, funcJavascript) ;
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getCategoriaCompetidoresFromCliente", c: "UsuarioCliente", idcliente: idCliente}) ;
		}
		
		console.log("[AnywhereManager.imarket_getCategoriaCompetidores.end]");
	};
	
	AnywhereManager.prototype.imarket_getProductosCompetidores= function(async, idCompetencia , idCategoria, funcJavascript) {
		console.log("[AnywhereManager.imarket_getProductosCompetidores.begin]");
		var idUsuario = sessionStorage.getItem("rutT");
		
		if(async) {
				   this.loadFromServer_Async(any.getWSAnywhere_context() + "dispatcher", {m: "getProductoFromCompetidor" , c: "UsuarioCliente", idcompetencia: idCompetencia, idcategoria : idCategoria}, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "dispatcher", {m: "getProductoFromCompetidor" , c: "UsuarioCliente", idcompetencia: idCompetencia, idcategoria : idCategoria});
		}
		
		console.log("[AnywhereManager.imarket_getProductosCompetidores.end]");
	};	
	
	AnywhereManager.prototype.generator_getListaFormularios= function(async, funcJavascript) {
		console.log("[AnywhereManager.generator_getListaFormularios.begin]");
		
		if(async) {
			   this.loadFromServer_Async(any.getWSAnywhere_context() + "services/p2s/querys/listadoformulario", {}, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "services/p2s/querys/listadoformulario", {});
		}
		
		console.log("[AnywhereManager.generator_getListaFormularios.end]");
	};
	
	AnywhereManager.prototype.generator_getFormularios= function(async, idForm, funcJavascript) {
		console.log("[AnywhereManager.generator_getFormularios.begin]");
		
		if(async) {
			       this.loadFromServer_Async(any.getWSAnywhere_context() + "services/p2s/querys/camposformulario/" + idForm + "/" + idForm, {}, funcJavascript);
		}
		else {
			return this.loadFromServer_Sync(any.getWSAnywhere_context() + "services/p2s/querys/camposformulario/" + idForm + "/" + idForm, {});
		}
		
		console.log("[AnywhereManager.generator_getFormularios.end]");
	};
	
	AnywhereManager.prototype.getClaseWeb = function (async, modulo, thing, accion, parameters, funcJavascript) {
		
		console.log("[AnywhereManager.getClaseWeb.begin]");
		var login = new Login();
		login.getUsuario(function(usuario) {
			var params = {claseweb: "cl.imasd.view.sencha.anywhere.Conf", idusuario : JSON.stringify(usuario), "modulo": modulo, "thing": thing , "accion": accion};
			if(parameters != null){
 				 for (var key in parameters) {
					 params[key] = parameters[key];
				 }
 			}
			var anyCaller = new AnywhereManager();
			var any = new Anywhere();
			
			if(async) {
					   anyCaller.loadFromServer_Async(any.getWSAnywjere_contextEjeCore()+ "EjeCoreI",params , funcJavascript);
			}
			else {
				return anyCaller.loadFromServer_Sync(any.getWSAnywjere_contextEjeCore() + "EjeCoreI", params);
			}
			
			console.log("[AnywhereManager.getClaseWeb.end]");
		});
	};
	
	AnywhereManager.prototype.saveClaseWeb = function (async, modulo, thing, accion, parameters, funcJavascript) {
		console.log("[AnywhereManager.getClaseWeb.begin]");
 
		var login = new Login();
		login.getUsuario(function(usuario) {
			var map  = new MapSQL("PRESENCIA");
			map.get("idregistro",function(value) {

				var params = {claseweb: "cl.imasd.view.sencha.anywhere.Conf", 
						idusuario : JSON.stringify(usuario), 
						"modulo": modulo, 
						"thing": thing , 
						"accion": accion,
						"idPresenciaVigente": value.data};
				
				//console.log(parameters);
				if(parameters != null){
					 for (var key in parameters) {
						 params[key] = parameters[key];
					 }
				}
				
 
				params["success"] =  parameters["success"]  ;
				params["error"] =    new Function("("+String(parameters["error"])+")");
				
				
				var any = new Anywhere();
				
				if(async) {/*
					params["modulo"] = "anywhere_movil_restanywhere";
					params["thing"] = "AnySave";
					params["modulo"] = "add";
					*/
				
					
					var objCalleador = new AnywhereManager();
					
					objCalleador.save(
						any.getWSAnywjere_contextEjeCore()+ "EjeCoreI",
						params );

					//anyCaller.loadFromServer_Async(any.getWSAnywjere_contextEjeCore()+ "EjeCoreI",params , funcJavascript, "POST");
				}
				else {
					return anyCaller.loadFromServer_Sync(any.getWSAnywjere_contextEjeCore() + "EjeCoreI", params, null, "POST");
				}
			});
		});
	};
	
	AnywhereManager.prototype.loadFromServer_Async = function(vUrl, params, funcJavascript, type) {
		if(funcJavascript == null) {
			funcJavascript = function(data) {};
		}
		this.callServer(vUrl, params, true, funcJavascript, type);
	};
	
	AnywhereManager.prototype.loadFromServer_Sync = function(vUrl, params, nulo, type) {
		var funcJavascript = null;
		if(funcJavascript == null) {
			funcJavascript = function(data) { return data;};
		}
		return this.callServer(vUrl, params, false,  funcJavascript);
	};
	
	AnywhereManager.prototype.checkSavesPendientes = function(urlRedirect, functionJavascript) {
		var stack = localStorage.getItem("idSaves");
		if(stack != null && stack != undefined && this.getSavesPendientes() > 0 ) {			
			stack = JSON.parse(stack);			
			
			var popup = new MasterPopup();
			popup.confirmPopup("Guardar"
					, "Se ha encontrado "+this.getSavesPendientes()+" registro(s) pendiente(s) por informar, \u00BFDesea hacerlo ahora?.</div>"
					, { "funcYes": function() {
						var mng = new AnywhereManager();
						mng.sendSavesToServer(urlRedirect, functionJavascript);		
						popup.closePopup();
					  }});

		}
	};
	
	
	AnywhereManager.prototype.resetStorage = function() {
		localStorage.clear();
	};
	
	AnywhereManager.prototype.sendSavesToServer = function(urlRedirect, functionJavascript) {
		
		if(localStorage.getItem("idSaves") != null) {
			var popup = new MasterPopup();
			popup.bloqPopup("Actualizando", "Informando registros<br/>", {"callbackopen": function() {
				
				var f = function() {
	
						var oks = 0;
						var mal = 0;
						
						var stack = JSON.parse(localStorage.getItem("idSaves"));
						
						try {
					
							$.each(stack, function(k,v) {
								console.log("[KEY "+k+"]");
								try {
									//console.log("[KEY "+k+" 1]");
									var newSave = localStorage.getItem(k);
									//var popupNewSave = new MasterPopup();
									//popupNewSave.alertPopup("New Save", newSave);
									
									if(newSave != null) {
										//console.log("[KEY "+k+" 2]");
										newSave = JSON.parse(newSave);
										newSave.async = false;
										
										var gc = new AnywhereManager();
										var ok = gc.saveMaster(newSave);
										//console.log("[KEY "+k+" 4]");
										if(ok) {
											oks += 1;
											var mngLocal = new AnywhereManager();
											//console.log("[KEY "+k+" 5]");
											mngLocal.deleteSavePendiente(k);
										}
										else {
											mal += 1;
										}
										//console.log("[KEY "+k+" 5]");
									}else {
										localStorage.removeItem(k);
									}
									
								}catch(e) {
									var popupError = new MasterPopup();
									popupError.alertPopup("Actualizando", "Ha ocurrido un error desconocido <br/>"+e);
								}
										
								console.log("[END KEY "+k+"]");
							});
						} 
						catch(e) {
							console.log(e);
						}
						finally {
	
							var popupMsg = new MasterPopup();
							popupMsg.alertPopup("Actualizando", "Registros cargados:"+oks+" <br/> Registros pendientes:"+mal+" <br/>",{"funcYes":  function() {
							   if(functionJavascript != null){
								   var func =  eval(functionJavascript);
								   func();
								}
							}});
	
							popup.closePopup();	
							checkSaves();
						}
						
						console.log("TERMINÓ sendSavesToServer");
				};
				
				//FunctionTool.evalFunction(f);
				window.setTimeout( f, 2000);
				
			}});

			
		}
		
	};
	
	AnywhereManager.prototype.deleteSavePendiente = function(key) {
		var keys = localStorage.getItem("idSaves");
		console.log("[TRYING DELETE]"+key);
		if( keys != null) {
			keys = JSON.parse(keys);
			console.log("[KEY BEFORE]"+keys);
			delete keys[key];
			localStorage.setItem("idSaves", JSON.stringify(keys));
			localStorage.removeItem(key); 
			
			console.log("[KEY AFTER]"+keys);
		}
	};
	
	AnywhereManager.prototype.getSavesPendientes = function() {
		var cant = 0;
		var keys = localStorage.getItem("idSaves");
		console.log("[GETSAVES PENDIENTES ]"+keys);
		
		if(keys != null) {
			var stack = JSON.parse(keys);
			$.each(stack, function(k,v) {
				cant = cant + 1;
			});
		}
		
		console.log("[GETSAVES PENDIENTES ]"+keys);
		
		return cant;
	};
	
	AnywhereManager.prototype.save = function(vUrl, params, sucess, error, complete, async) {
		var versionAqui = "Anywhere.save v2.0.1 ";
		//console.log(params);
		console.log(" "+versionAqui+" "+vUrl);

		
		if(async == null) {
			async = true;
		}


		
		/*
		if( sucess !== null) {
			params["success"] = new Function("("+String(sucess)+")");	
		}
		if( error !== null) {
			params["error"] = new Function("("+String(error)+")");
		}
		if( complete !== null) {
			params["complete"] = new Function("("+String(complete)+")");
		}
		*/
		
		var s = params["success"];
		var e = params["error"];
		var c = params["complete"];
		

		
		var data = JSON.parse(JSON.stringify(params));
		data.success= null;
		data.error= null;
		data.complete= null;
		
		var newSave = {"type": "POST",
					   "async": async,
					   "url": vUrl ,
					   "data": params,
					   "success": s,
					   "error" : e,
					   "complete": c};
		
		var version = new Version();
		console.log(versionAqui+" getting version");

		
		version.getLastVersion(function(lastVersion){
			if( lastVersion == -1) {//-1 = SIN SESIÓN
				console.log(versionAqui+" SIN SESION");
				//console.log(params);
				try {
					var stack = localStorage.getItem("idSaves");
					if(stack == null || stack == undefined) {
						stack = JSON.stringify({});
					}
					
					try {
						stack = JSON.parse(stack);
					}catch(e) {
						stack = JSON.stringify({});
						stack = JSON.parse(stack);
					}
					
					var newId = "idSaves_" +Math.random();
					stack[newId] =  "";
					
					localStorage.setItem(newId	  ,JSON.stringify(newSave));
					localStorage.setItem("idSaves",JSON.stringify(stack));
					
					//console.log(" SIN SESION  11");
					//console.log(params);
					
					if(params.success != null) {
						//console.log(" SIN SESION AAA11 22");
						params.success({"dataFalsa":"dataFalsa"});
					}
	
					if(params.complete != null) { 
						/*
						var func2 = eval(params.complete);
						func2();*/
					}
				}
				catch(e) {
					console.log(e);
				}
			}
			else {
				console.log(versionAqui+" CON SESION");
				//console.log(newSave);
				var gc = new AnywhereManager();
				gc.saveMaster(newSave);
				
			}
		})
		
		
		
	};
	
	AnywhereManager.prototype.saveMaster = function(newSave) {
		var instance = Math.random();
		console.log("[AnywhereManager.saveMaster] "+instance); 
		 
		var data = JSON.parse(JSON.stringify(newSave));
		data.success= null;
		data.error= null;
		data.complete= null;
 
		var ok = false;
				
		try {
			$.ajax({ 
				type: newSave["type"] ,
				dataType:"json",
				url: newSave["url"],
				async: newSave["async"],
				data: data.data,
				cache: false,
				crossdomain:true,
				success: function(datam,am,bm) {
					console.log("IN [AnywhereManager.saveMaster.success] "+newSave.url+" "+instance);

					console.log(typeof newSave.success);
					if("function" == typeof newSave.success) {
						newSave.success(datam,am,bm);
					}
 
					ok = true;
					console.log("OUT [AnywhereManager.saveMaster.success] "+newSave.url+" "+instance);
				},
				error: function(jqXHR,  textStatus,  errorThrown ) {
					
					console.log("IN [AnywhereManager.saveMaster.error]"+JSON.stringify(jqXHR)+" "+JSON.stringify(textStatus)+" "+JSON.stringify(errorThrown));
					console.log(typeof newSave.error)
					console.log(typeof newSave.error)
					if("function" == typeof newSave.error) {
						newSave.error( jqXHR,  textStatus,  errorThrown );
					}
				
					/*
					if(newSave.error != null) {
						//console.log(newSave.error);
						newSave.error(jqXHR,  textStatus,  errorThrown );
					}
					*/
	
					ok = false;
					console.log("OUT [AnywhereManager.saveMaster.error]"+JSON.stringify(jqXHR)+" "+JSON.stringify(textStatus)+" "+JSON.stringify(errorThrown));
					
				},
				complete: function(jqXHR,  textStatus,  errorThrown) {
					/*
					console.log("IN [AnywhereManager.saveMaster.complete]"+textStatus+"  "+newSave.url);
					
					if(newSave.complete != null) {
						//console.log(newSave.complete);
						newSave.complete(jqXHR,  textStatus,  errorThrown);
					}
	
					console.log("OUT [AnywhereManager.saveMaster.complete]"+textStatus+"  "+newSave.url);
					*/
				}
			});
		}
		catch(e) {
			console.log("[AnywhereManager.saveMaster.catch]"+e+"  "+newSave.url+" "+instance);
			ok = false;

		}
		
		return ok;
	};
	
	AnywhereManager.prototype.callServer = function(vUrl, params, async , funcJavascript, type) {
		console.log("[Globalcontext.callServer] "+vUrl+" ");
		var dataReturn = null;
		if(type == null) {
			type = "GET";
		}
		
		try {
			var log = new Log();
			log.addLog("CALLING SERVER");
			
			params.success = funcJavascript;
			var data = params;
			
			var fsucess = params.success;
			var ferror = params.error;
			var fcomplete = params.complete;
			
			params.success = null;
			params.error = null;
			params.complete = null;
			
			var caller = new ServerCaller();
			caller.call({ 
				type: type,
				dataType:"json",
				url: vUrl ,
				async: async,
				data: params,
				crossDomain : true,
				cache: false,
				success: function(data,a,b) {
					
					if(fsucess != null) {
						var f = eval(fsucess);
						dataReturn = f(data,a,b);
					}
 
				},
				error: function(error,a,b,c) {
					if(ferror != null) {
						var f = eval(ferror);
						f(error,a,b,c);
					}
					//console.log("[Globalcontext.callServer.ajaxError]"+error+"  "+vUrl+" "+JSON.stringify(params));
					//throw new Error("[Globalcontext.callServer.ajaxError]"+error+"  "+vUrl+" "+JSON.stringify(params));
				},
				complete : function(a,b,c,d) {
					if(fcomplete != null) {
						var f = eval(fcomplete);
						f(a,b,c,d);
					}
				}
			});
		}
		catch(e) {
			//console.log("[Globalcontext.callServer.catch]"+e+"  "+vUrl+" "+JSON.stringify(params));
			throw new Error("[Globalcontext.callServer.catch]"+e+"  "+vUrl+" "+JSON.stringify(params));

		}
		
		return dataReturn;
	};
	
	AnywhereManager.prototype.makeId = function()  {
		console.log("[MasterPopup.makeid]");
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 20; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	};
}


function AnySave() {
	
	
	AnySave.prototype.pointAddress = null;
	this.stockImage = 'Sin Imagen';
	AnySave.prototype.posLatitud = null;
	AnySave.prototype.posLongitud = null;
	
	this.saveInt = false;
	this.nombreModulo = "nn";
	this.formularioID = null;
	this.message = null;
	
	
	var f = function(lat, long, poin) {
		console.log(lat, long, poin);
		$(".btn_home").each(function() {
			//console.log(this);
			$(this).addClass("ui-icon-carat-l").removeClass("ui-icon-home").removeClass("ui-icon-delete");
		});      
		
	}
	
	AnySave.prototype.listeners = [f];
	var check = function() {
		var geo = new GeoGlobal();
		geo.refreshGeo(function(lat, lo) {
			AnySave.prototype.posLatitud = lat;
			AnySave.prototype.posLongitud = lo;
			//console.log(AnySave.prototype.posLatitud + ","+ AnySave.prototype.posLongitud);
			
			if(AnySave.prototype.posLatitud !== null && 
			   AnySave.prototype.posLongitud !== null && 
			   AnySave.prototype.pointAddress !== null) {
				AnySave.prototype.onGeo(AnySave.prototype.posLatitud, AnySave.prototype.posLongitud,AnySave.prototype.pointAddress );
			}
		}, function(point) {
			AnySave.prototype.pointAddress = point;
			//console.log(AnySave.prototype.pointAddress);
			
			if(AnySave.prototype.posLatitud !== null && 
			   AnySave.prototype.posLongitud !== null && 
			   AnySave.prototype.pointAddress !== null) {
				AnySave.prototype.onGeo(AnySave.prototype.posLatitud, AnySave.prototype.posLongitud,AnySave.prototype.pointAddress );
			}
		}); 
	}
	
	check();
	setInterval(function() {
		check();
	},5000);
	
	
	AnySave.prototype.onGeo = function(lat, long, point) {
		$.map(AnySave.prototype.listeners, function(o) {
			var f = o;
			f(lat, long, point);
		});
	}
	
	AnySave.prototype.addListenerGeo = function(func) {
		
		if(func != null) {
			var f = eval("("+String(func)+")");
			AnySave.prototype.listeners.push(f);
		}
	}

	AnySave.prototype.getLatitud = function() {
		return AnySave.prototype.posLatitud;
	}
	
	AnySave.prototype.getLongitud = function() {
		return AnySave.prototype.posLongitud;	
	}
	
	AnySave.prototype.getPoint = function() {
		return AnySave.prototype.pointAddress;	
	}

	AnySave.prototype.save = function(params) {
		console.log("save v10.0.0 saveInt="+this.saveInt);
		if(params == null) {
			params = {};
		}
		
		if(params.objAnywhere != null) {
			if(!params.objAnywhere.isReady()) {
				var mp = new MasterPopup();
				mp.alert("Espere un momento.");
			}
		}
		
		if((this.saveInt == false)) {
			this.saveInt = true;
			if(params == null) {
				params = {};
			}
			if(params.formName == null) {
				params.formName = "formSend";
			}
			
			this.nombreModulo = params.nombreModulo;
			this.formularioID = params.formularioID;
			this.saveTwo(params);
		}
	}

	AnySave.prototype.saveTwo = function(params) {
		console.log("saveTwo v9.0.0");
		
		 if ($('#'+params.formName).validate({
			 	errorPlacement: function(error, element) {
					if ($(element).is('select')) {
						error.insertAfter($(element).parent());
					}
					else {
						error.insertAfter(element);
					}
				}
			 }).form() == true) {
			 
			 if( fotosObligatoriasCargadas() ) {
				 this.saveThree(params);	 
			 }
			 else {
				 this.saveInt = false;
			 }
		 }
		 else {
			 var popup = new MasterPopup();
			 popup.alertPopup(nombreModulo, "Debes completar todos los datos en rojo");
			 this.saveInt = false;
		 } 
		 
	}



	AnySave.prototype.saveThree = function(params) {
		console.log("AnySave.saveThree v9.0.0");
		
		if(!this.checkRadios()) {
			quiebreSaveInit = false;
			return;
		}
		
		var saveUtil = new SaveUtils();
		var params = saveUtil.serializePage(params.formName, params.objAnywhere, params);
		params["formulario_id"]    = this.formularioID;
		params["formulario_alias"] = this.nombreModulo;
		params["latitud"]     = AnySave.prototype.posLatitud;
		params["longitud"]    = AnySave.prototype.posLongitud;
		params["point"]   	  = AnySave.prototype.pointAddress;
		params["fotoUno"] = $("#hiddenFotoUno").val();
		params["fotoDos"] = $("#hiddenFotoDos").val();
		params["fotoTres"] = $("#hiddenFotoTres").val();
		params["fotoCuatro"] = $("#hiddenFotoCuatro").val();
		params["objAnywhere"] = null;
		
		var s = eval("("+String(params["success"])+")")
		params["success"] = s;
		//console.log(params);
		
		var success2 = function(data,status,jqXHR, o) { 
			var mensajeSave = null;

			if(data != null) {
				var any = new AnySave();
				any.setLastData(JSON.stringify(data));
				
				
				if(data.success == true) {
					mensajeSave = "Informaci&oacute;n enviada correctamente";	
				}
				else {
					mensajeSave = "La informaci&oacute;n enviada no pudo ser procesada";	
				}
				if(data.dataFalsa == "dataFalsa") {
					mensajeSave = "Alerta sin conexi&oacute;n a Internet. Su informaci&oacute;n ser&aacute; guardada en el celular y apenas cuente con Internet usted debe reenviarla (ir al men&uacute; principal)";
				}
				
				var popup = new MasterPopup();
				popup.alertPopup(params.formulario_alias, mensajeSave, {"funcYes":  function() {
				   $.mobile.changePage( "index.html", { transition: "flip"} );
				}});
				
			}

			console.log("Aqui");
 
			console.log("Aqui 2");
		}
		
		//params["success"] = success2;
		
		this.saveInt = false;
		var anySave = new AnywhereManager();
		anySave.saveClaseWeb(true, "anywhere_movil_restanywhere", "AnySave", "add", params);
		
		if($("#"+params["formName"]).length != null) {
			$("#"+params["formName"])[0].reset();
		}
	}
	
	AnySave.prototype.checkRadios = function() {
		var ok = true;
		
		var namesRadio = {};
		$("input[type=radio]").each(function() {
			if( $(this).hasClass( "required" ) ) {
				namesRadio[$(this).attr("name")] = "";
			}
		});
		
		$.each(namesRadio, function(k,v) {	
			if( $('input[name='+k+']:checked').val() == null) {
				ok = false;
				
				if($("#msg_"+k).length == 0){
					var radio = $('input[type=radio][name='+k+']').parent();
					
					radio.change(function() {
						$("#msg_"+k).remove();
					});
					
					radio.parent().append("<b id='msg_"+k+"' style='color:red;'>Este campo es obligatorio</b>");
					
					//$('input[type=radio][name='+k+']')[1].append("<b id='msg_"+k+"'>Este campo es obligatorio</b>");	
				}
				
			}
		});
		
		return ok;
	}
	
	AnySave.prototype.setLastData = function(data){
		if($("#lastMessageSave").length > 0) {
			$("#lastMessageSave").remove();
		}
		
		$("body").append("<input type='hidden' id='lastMessageSave' value='"+data+"' />");
	}
	
	AnySave.prototype.getLastData = function(){
		return $("#lastMessageSave").val();
	}
	
	
	
	
}

function FunctionTool() {
	
}

FunctionTool.evalFunction = function(func,a,b,c) {
	if(func!=null) {
		//console.log("evalFunction()");
		if(typeof func == 'function') {
			var f = func;
			f(a,b,c);
		}
	}
};
 
function Activity() {
	Activity.prototype.getActivityLastVisita = function(selector, numberOfLastVisit) {
		return Activity.prototype.getActivity(selector, 1);
	}
	
	Activity.prototype.getActivityThisVisita = function(selector, numberOfLastVisit) {
		return Activity.prototype.getActivity(selector, 0);
	}
	
	
	Activity.prototype.getActivity = function(selector, numberOfLastVisit) {
			var login = new Login();
			
			login.getUsuario(function(usuario) {
				var any = new Anywhere();
				var user = new 
				$.ajax({ 
					type: "GET",
					dataType:"json",
					url: any.getWSAnywjere_contextEjeCore() + "EjeCoreI",
					data: {
						claseweb: "cl.imasd.view.sencha.anywhere.Conf",
						modulo: "anywhere_movil_restanywhere",
						thing:"Activity",
						accion:"get",
						usuario: JSON.stringify(usuario),
						numberOfLastVisit: numberOfLastVisit
					
					},
					dataType:"json",
					crossDomain : true,
					success : function(data) {
						console.log(data);
						
					 	try {
							 
							
					 
							var html =  "<table align='middle' border='1' data-role='table'  data-mode='reflow' class='ui-responsive table-stroke'>"
						
							$.map(data.data, function(m) {
								html+="   <tr> ";
								if(m.type=="data") {
									html+=" 		<td>" + m.name + "</td>";
									html+=" 		<td>" + m.value + "</td>";
								}
								else if(m.type=="msg") {
									html+=" 		<td colspan='2'>" + m.name + "</td>";
								}
								
								html+="   </tr> ";
							});
							html+="</table> ";
						
							console.table(html);
							$(selector).append(html);
						}
						catch(e){
							console.log(e);
						}
					}
				});
			});
		}
}

function App() {
	
}
 App.exit = function() {
	 try {
		 if (navigator.app) {
		    navigator.app.exitApp();
		 } else if (navigator.device) {
		    navigator.device.exitApp();
		 } else {
		    window.close();
		 }
	 }
	 catch(e){
		 console.log(e);
	 }
 }