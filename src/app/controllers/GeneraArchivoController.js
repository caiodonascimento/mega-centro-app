(function(){
	angular
  	.module('app')
  	.controller('GeneraArchivoController', [
			'movimientoService', '$stateParams', '$state', 'storageService',
  		GeneraArchivoController
  	]);
  function GeneraArchivoController(movimientoService, stateParams, state, localStorage) {
		var vm = this;
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.loading = true;
		vm.arrayData = [];
		vm.dataList = [];
		vm.encabezados = {
			'planCuenta': 'Código Plan de Cuenta',
			'deber': 'Monto al Debe Moneda Base',
			'haber': 'Monto al Haber Moneda Base',
			'descripcion': 'Descripción Movimiento',
			'monedaAdicional': 'Equivalencia Moneda',
			'monedaAdicionalDeber': 'Monto al Debe Moneda Adicional',
			'monedaAdicionalHaber': 'Monto al Haber Moneda Adicional',
			'condicionVenta': 'Código Condición de Venta',
			'vendedor': 'Código Vendedor',
			'ubicacion': 'Código Ubicación',
			'conceptoCaja': 'Código Concepto de Caja',
			'instrumentoFinanciero': 'Código Instrumento Financiero',
			'cantidadFinanciera': 'Cantidad Instrumento Financiero',
			'detalleGasto': 'Código Detalle de Gasto',
			'cantidadConceptoGasto': 'Cantidad Concepto de Gasto',
			'centroCosto': 'Código Centro de Costo',
			'tipoConciliacion': 'Tipo Docto. Conciliación',
			'numeroConciliacion': 'Nro. Docto. Conciliación',
			'codigoAuxiliar': 'Código Auxiliar',
			'tipoDocumento': 'Tipo Documento',
			'numeroDocumento': 'Nro. Documento',
			'fechaEmision': 'Fecha Emisión Docto.(DD/MM/AAAA)',
			'fechaVencimiento': 'Fecha Vencimiento Docto.(DD/MM/AAAA)',
			'tipoReferencia': 'Tipo Docto. Referencia',
			'numeroReferencia': 'Nro. Docto. Referencia',
			'numeroCorrelativo': 'Nro. Correlativo Interno',
			'monto1': 'Monto 1 Detalle Libro',
			'monto2': 'Monto 2 Detalle Libro',
			'monto3': 'Monto 3 Detalle Libro',
			'monto4': 'Monto 4 Detalle Libro',
			'monto5': 'Monto 5 Detalle Libro',
			'monto6': 'Monto 6 Detalle Libro',
			'monto7': 'Monto 7 Detalle Libro',
			'monto8': 'Monto 8 Detalle Libro',
			'monto9': 'Monto 9 Detalle Libro',
			'montoSumaLibro': 'Monto Suma Detalle Libro',
			'grabeLibro': 'Graba el detalle de libro (S/N) (Opcional. por defecto S)',
			'documentoNulo': 'Documento Nulo (S/N) (Opcional. por defecto N)',
			'flujoEfectivo': 'Código flujo efectivo 1 (Opcional)',
			'montoFlujo1': 'Monto flujo 1 (Opcional)',
			'flujoEfectivo2': 'Código flujo efectivo 2 (Opcional)',
			'montoFlujo2': 'Monto flujo 2 (Opcional)',
			'flujoEfectivo3': 'Código flujo efectivo 3 (Opcional)',
			'montoFlujo3': 'Monto flujo 3 (Opcional)',
			'flujoEfectivo4': 'Código flujo efectivo 4 (Opcional)',
			'montoFlujo4': 'Monto flujo 4 (Opcional)',
			'flujoEfectivo5': 'Código flujo efectivo 5 (Opcional)',
			'montoFlujo5': 'Monto flujo 5 (Opcional)',
			'flujoEfectivo6': 'Código flujo efectivo 6 (Opcional)',
			'montoFlujo6': 'Monto flujo 6 (Opcional)',
			'flujoEfectivo7': 'Código flujo efectivo 7 (Opcional)',
			'montoFlujo7': 'Monto flujo 7 (Opcional)',
			'flujoEfectivo8': 'Código flujo efectivo 8 (Opcional)',
			'montoFlujo8': 'Monto flujo 8 (Opcional)',
			'flujoEfectivo9': 'Código flujo efectivo 9 (Opcional)',
			'montoFlujo9': 'Monto flujo 9 (Opcional)',
			'flujoEfectivo10': 'Código flujo efectivo 10 (Opcional)',
			'montoFlujo10': 'Monto flujo 10 (Opcional)',
			'numeroCuotaPago': 'Número Cuota de Pago (Opcional)'
		};
		vm.dataList = [];
		function init() {
			movimientoService.getTransactionsWithChileanAccount(vm.empresa, vm.year, vm.month)
			.then(function(result) {
				vm.dataList = result.map(function(value){
					return {
						'planCuenta': value.originAccount.chileanAccount.account,
						'deber': value.liabilities > 0 ? value.liabilities : '',
						'haber': value.liabilities < 0 ? value.liabilities*-1 : '',
						'descripcion': value.account
					};
				});
				console.log(vm.dataList);
				vm.arrayData = result;
				vm.loading = false;
			})
		}
		if (stateParams.idEmpresa && stateParams.year) {
			vm.empresa = stateParams.idEmpresa;
			vm.year = stateParams.year;
			vm.month = stateParams.month;
			vm.fileName = 'ARCHIVO-' + stateParams.idEmpresa + '-' + stateParams.year;
			init();
		} else {
			state.go('home.genera-archivo', {}, {location: 'replace'});
		}
		vm.volver = volver;
		function volver() {
			state.go('home.genera-archivo', {
				empresa: stateParams.idEmpresa,
				year: stateParams.year,
				month: stateParams.month
			});
		}
  }
})();
