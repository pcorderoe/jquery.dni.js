/*!
 * jQuery DNI v0.1 (http://plugins.espejozen.cl)
 * @author Patricio Cordero
 * @date 03/03/2015
 * @contact patricio@espejozen.cl
 */
if (typeof jQuery === 'undefined') { throw new Error('Jquery Comentarios require jQuery') }

;(function($){
	$.extend($.fn, {
		dni:function(pais,opciones){
			//Extiendo opciones
			this.opciones = $.extend($.fn.dni.opciones, opciones);
			this.dni = $.fn.dni;
			var dis = this;
			//Si el pais no es valido disparo el evento paisNoSoportado()
			if(!dis.dni.validaPais(pais)){
				dis.dni.opciones.paisNoSoportado(pais);
				this.opciones.target.addClass('readonly').attr('disabled',true);
				return false;
			}else{
				this.opciones.target.removeClass('readonly').removeAttr('disabled');
			}

			//Si el pais es valido le agrego el validador al objeto target usando los eventos configurados en opciones
			dis.opciones.target.die(dis.opciones.toggle).live(dis.opciones.toggle,function(e){
				if(dis.dni.validar(pais,this.value)){
					this.value = dis.dni.validaCHL.formateaRut(this.value);
					return dis.opciones.dniValido(this);
				}else return dis.opciones.dniInvalido(this);
			});
		}
	});
	$.extend($.fn.dni, {
		opciones:{
			target:null,
			paisNoSoportado: null,
			toggle:'change',
			dniValido:null,
			dniInvalido:null
		},
		validaPais: function(pais){
			var permitidos = ['CHL'];
			if(jQuery.inArray(pais,permitidos)>-1){
				return pais;
			}else return false;
		},
		validar: function(pais, identificador){
			switch(pais){
				case 'CHL': return $.fn.dni.validaCHL(identificador);
				default: return false;
			}
		},
		/*****************VALIDA RUT CHILENO****************/
		validaCHL: function(identificador){
			if(typeof identificador!=='string') return false;
			var cRut = $.fn.dni.validaCHL.limpiarFormato(identificador);
			if(cRut.length < 2) return $.fn.dni.opciones.dniInvalido(this);
			var cDv = cRut.charAt(cRut.length - 1).toUpperCase();
			var nRut = parseInt(cRut.substr(0, cRut.length - 1));
			if(nRut === NaN) return $.fn.dni.opciones.dniInvalido(this);
			return $.fn.dni.validaCHL.calculaDV(nRut).toString().toUpperCase() === cDv;
		}
		/*****************VALIDA RUT CHILENO****************/
	});
	/**
	 * RUT CHILENO
	 * Funciones anexas a la validacion de rut chileno
	 */
	$.extend($.fn.dni.validaCHL,{
		calculaDV: function(rut){
			var suma = 0;
			var mul = 2;
			if(typeof rut!=='number') return;
			rut = rut.toString();
			for(var i=rut.length -1;i >= 0;i--) {
				suma = suma + rut.charAt(i) * mul;
				mul = ( mul + 1 ) % 8 || 2;
			}
			switch(suma % 11) {
				case 1	: return 'k';
				case 0	: return 0;
				default	: return 11 - (suma % 11);
			}
		},
		limpiarFormato: function(value){
			return value.replace(/[\.\-]/g, "");
		},
		formateaRut: function(value){
			rutAndDv = $.fn.dni.validaCHL.divideRut(value);
			var cRut = rutAndDv[0]; var cDv = rutAndDv[1];
			if(!(cRut && cDv)) return cRut || value;
			var rutF = "";
			while(cRut.length > 3) {
				rutF = "." + cRut.substr(cRut.length - 3) + rutF;
				cRut = cRut.substring(0, cRut.length - 3);
			}
			return cRut + rutF + "-" + cDv;
		},
		divideRut: function(rut){
			var cValue = $.fn.dni.validaCHL.limpiarFormato(rut);
			if(cValue.length == 0) return [null, null];
			if(cValue.length == 1) return [cValue, null];
			var cDv = cValue.charAt(cValue.length - 1);
			var cRut = cValue.substring(0, cValue.length - 1);
			return [cRut, cDv];
		}
	});

}(jQuery));
