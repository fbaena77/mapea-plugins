var WMSServers = [
	{
		url: 'http://www.geoportalagriculturaypesca.es/geoide/sigpac/wms',
		name: 'SIGPAC'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
		name: 'Catastro'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=2002-01-01&',
		name: 'Catahist2002'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=2003-01-01&',
		name: 'Catahist2003'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=2004-01-01&',
		name: 'Catahist2004'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=2005-01-01&',
		name: 'Catahist2005'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=2006-01-01&',
		name: 'Catahist2006'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=2007-01-01&',
		name: 'Catahist2007'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=2008-01-01&',
		name: 'Catahist2008'
	},
	{
		url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=2009-01-01&',
		name: 'Catahist2009'
	},
	{
		url: 'http://www.ideandalucia.es/wms/dea100_divisiones_administrativas?',
		name: 'DPMT'
	},
	{
		url: 'http://www.ideandalucia.es/wms/dea100_hidrografia?',
		name: 'Hidrogra'
	},
	{
		url: 'http://www.ideandalucia.es/wms/dea100_divisiones_administrativas?',
		name: 'IDEAndaluciaDEA100'
	},
	{
		url: 'http://www.ideandalucia.es/wms/dea100_viario?',
		name: 'IDEDEA100RedViaria'
	},
	{
		url: 'http://www.ideandalucia.es/wms/mta10r_2001?',
		name: 'IDEMTA10R'
	},
	{
		url: 'http://www.ideandalucia.es/wms/mta10v_2007?',
		name: 'IDEAMTA10v_2007'
	},
	{
		url: 'http://www.ideandalucia.es/wms/mta100v_2005?',
		name: 'IDEMTA100v'
	},
	{
		url: 'http://www.ideandalucia.es/wms/ortofoto2009ene?',
		name: 'IDEOrtofoNE_2009'
	},
	{
		url: 'http://www.ideandalucia.es/wms/ortofoto2009eno?',
		name: 'IDEOrtofoNW_2009'
	},
	{
		url: 'http://www.ideandalucia.es/wms/ortofoto2008ese?',
		name: 'IDEOrtofoSE_2008'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Montes_Publicos_Andalucia?',
		name: 'MontePublico'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Ortofoto_Andalucia_1956?',
		name: 'Ortofotografías1956'
	},
	{
		url: 'http://www.ideandalucia.es/wms/ortofoto1998?',
		name: 'Ortofotografías1998'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Ortofoto_coloreada_Andalucia_2001?',
		name: 'Ortofotografías2002'
	},
	{
		url: 'http://www.ideandalucia.es/wms/ortofoto2004?',
		name: 'Ortofotografías2004'
	},
	{
		url: 'http://www.ideandalucia.es/wms/ortofoto2007?',
		name: 'Ortofotografías2007'
	},
	{
		url: 'http://www.ideandalucia.es/wms/dea100_patrimonio?service=wms&amp',
		name: 'PEPMF'
	},
	{
		url: 'http://www.idee.es/wms/PNOA-MR/PNOA-MR?',
		name: 'PNOAR'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Ortofoto_RGB_Andalucia_NW_2005?',
		name: 'PNOAN2005'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Ortofoto_RGB_Andalucia_NW_2007?',
		name: 'PNOAN2007'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Ortofoto_RGB_Andalucia_SW_2004?',
		name: 'PNOAS2004'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Ortofoto_RGB_Andalucia_SW_2006?',
		name: 'PNOAS2006'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Red_Natura_2000?',
		name: 'REDNATURA'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_RENPA?',
		name: 'RENPA'
	},
	{
		url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Inventario_VVPP?',
		name: 'VíasPecuarias'
	}
	];