function getCatalogLayers(geoserverURL){
	return {
		"id": "root",
		"uuidgeoperfil": "TEST_Layers",
		"label": "Capas",
		"type": "folder",
		"visible": false,
		"isOpenOnStartUp": true,
		"active": true,
		"children": [{
			"id": "8c9b468e-cba8-47ab-a53b-6e59ea8f605f",
			"label": "VECTOR TEST FOLDER",
			"type": "folder",
			"visible": true,
			"isOpenOnStartUp": true,
			"active": true,
			"isBaseLayer": false,
			"opacity": 1,
			"children": [{
				"id": "SandboxLayer",
				"type": "layer",
				"active": true,
				"minResolution": null,
				"maxResolution": null,
				"isBaseLayer": false,
				"opacity": 1,
				"format": "text/plain",
				"mandatory": false,
				"exclusive": false,
				"identify": false,
				"readOnly":	true,
				"vector":	true,
				"formatType": "VEC",
				"geometryType":	"Polygon",
				"style": {
					"fillColor": "rgba(93, 95, 229, 0.2)",
					"strokeColor":"blue"
				},	
				"layerInfo": {
					"url": null,
					"name": "SandboxLayer",
					"label": "Vector Test Layer",
					"tiled": false,
					"displayInLayerSwitcher": true
				}
			}]
		},{
			"id": "8c9b468e-cba8-47ab-a53b-6e59ea8f605f",
			"label": "Catastro",
			"type": "folder",
			"visible": true,
			"isOpenOnStartUp": true,
			"active": true,
			"isBaseLayer": false,
			"opacity": 1,
			"children": [{
				"id": "CATASTRO",
				"type": "layer",
				"active": false,
				"minResolution": null,
				"maxResolution": null,
				"isBaseLayer": false,
				"opacity": 1,
				"format": "application/vnd.ogc.gml",
				"mandatory": false,
				"exclusive": false,
				"identify": false,
				"layerInfo": {
					"url": "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx",
					"name": "CATASTRO",
					"label": "Catastro",
					"tiled": false,
					"displayInLayerSwitcher": true
				}
			}]
		},{
			"id": "8c9b468e-cba8-47ab-a53b-6e59ea8f605f",
			"label": "SIGPAC 2019",
			"type": "folder",
			"visible": true,
			"isOpenOnStartUp": true,
			"active": true,
			"isBaseLayer": false,
			"opacity": 1,
			"children": [ {
				"id": "SIGPAC19_POLIGONOS",
				"type": "layer",
				"active": false,
				"minResolution": null,
				"maxResolution": null,
				"isBaseLayer": false,
				"opacity": 1,
				"format": "application/vnd.ogc.gml",
				"mandatory": false,
				"exclusive": false,
				"identify": true,
				"layerInfo": {
					"url": "http://www.geoportalagriculturaypesca.es/geoide/sigpac/wms",
					"name": "SIGPAC19_POLIGONOS",
					"label": "Polígonos SIGPAC 2019",
					"tiled": true,
					"displayInLayerSwitcher": true
				}
			},{
				"id": "SIGPAC19_PARCELAS",
				"type": "layer",
				"active": false,
				"minResolution": null,
				"maxResolution": null,
				"isBaseLayer": false,
				"opacity": 1,
				"format": "application/vnd.ogc.gml",
				"mandatory": false,
				"exclusive": false,
				"identify": true,
				"layerInfo": {
					"url": "http://www.geoportalagriculturaypesca.es/geoide/sigpac/wms",
					"name": "SIGPAC19_PARCELAS",
					"label": "Parcelas SIGPAC 2019",
					"tiled": true,
					"displayInLayerSwitcher": true
				}
			},{
				"id": "SIGPAC19_RECINTOS",
				"type": "layer",
				"active": false,
				"minResolution": null,
				"maxResolution": null,
				"isBaseLayer": false,
				"opacity": 1,
				"format": "application/vnd.ogc.gml",
				"mandatory": false,
				"exclusive": false,
				"identify": true,
				"layerInfo": {
					"url": "http://www.geoportalagriculturaypesca.es/geoide/sigpac/wms",
					"name": "SIGPAC19_RECINTOS",
					"label": "Recintos SIGPAC 2019",
					"tiled": true,
					"displayInLayerSwitcher": true
				}
			}]
		},{
			"id": "base",
			"label": "Capas base",
			"type": "folder",
			"visible": true,
			"isOpenOnStartUp": true,
			"active": true,
			"isBaseLayer": false,
			"opacity": 1,
			"children": [{
				"id": "TOPO_10r",
				"type": "layer",
				"active": false,
				"minResolution": null,
				"maxResolution": null,
				"isBaseLayer": false,
				"opacity": 1,
				"format": null,
				"mandatory": false,
				"exclusive": false,
				"identify": false,
				"layerInfo": {
					"url": "http://www.ideandalucia.es/wms/mta10r_2001?",
					"name": "TOPO_10r",
					"label": "Mapa Topográfico de Andalucía 1:10.000",
					"tiled": true,
					"displayInLayerSwitcher": true
				}
			},{
				"id": "OCA05_2013",
				"type": "layer",
				"active": false,
				"minResolution": null,
				"maxResolution": null,
				"isBaseLayer": false,
				"opacity": 1,
				"format": null,
				"mandatory": false,
				"exclusive": false,
				"identify": false,
				"layerInfo": {
					"url": "http://www.ideandalucia.es/wms/ortofoto2013?",
					"name": "OCA05_2013",
					"label": "Ortofoto 2013",
					"tiled": true,
					"displayInLayerSwitcher": true
				}
			}]
		}]
	}
}

function getCatalogServices(geoserverURL){
	return {
		"id": "root",
		"uuidgeoperfil": "TEST_WFS_Services",
		"label": "Servicios",
		"type": "folder",
		"visible": false,
		"isOpenOnStartUp": true,
		"active": true,
		"children": [{
			"id": "8c9b468e-cba8-47ab-a53b-6e59ea8f605f",
			"label": "SIGPAC 2019",
			"type": "folder",
			"isOpenOnStartUp": true,
			"children": [{
				"id": "SIGPAC19_RECINTOS",
				"type": "service",
				"description": "Recintos SIGPAC 2019",
				"url": "http://www.geoportalagriculturaypesca.es/geoide/sigpac/wfs",
				"srsName": "EPSG:25830",
				"featurePrefix": "",
				"featureTypes": ["SIGPAC19_RECINTOS"],
				"geomField": "THE_GEOM",
				"outputFormat": "gml3",
				"maxFeatures": 1
			}, {
				"id": "SIGPAC19_PARCELAS",
				"type": "service",
				"description": "Parcelas SIGPAC 2019",
				"url": "http://www.geoportalagriculturaypesca.es/geoide/sigpac/wfs",
				"srsName": "EPSG:25830",
				"featurePrefix": "",
				"featureTypes": ["SIGPAC19_PARCELAS"],
				"geomField": "SD_GEOM",
				"outputFormat": "gml3",
				"maxFeatures": 1
			}]
		}]
	}
}
