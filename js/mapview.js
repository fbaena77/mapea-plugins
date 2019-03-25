var mapajs, 
	geoserverURL = null;

var app = {
	initialize: function() {
		mapajs = M.map({
			container: 'mapjs',
			controls: ['scale', 'scaleline', 'mouse', 'overviewmap'],
			layers: [new M.layer.WMS({
				url: 'http://www.ideandalucia.es/wms/ortofoto2016?',
				name: 'ortofotografia_2016_rgb',
				legend: 'ortofotografia_2016_rgb',
				transparent: true,
				tiled: true
			})]
		});

		this.configureMap();
	},
	configureMap: function(){
	
		/** Config variables here **/
		M.config.panels.TOOLS = [];
		this.addPluginsToMap();
	},
	addPluginsToMap: function(){
		/**Edition Plugin**/
		var editionBarPlugin = new M.plugin.Edition({
			config: {
				position: M.ui.position.TL,
				orientation: 'vertical' //horizontal
			}
		});

		mapajs.addPlugin(editionBarPlugin);

		/**Catalog Plugin**/
		var catalogPlugin = new M.plugin.Catalog({
			advLS: {
				apiRestUrl: null,
				user: null,
				layers: getCatalogLayers(geoserverURL),
				cqlFilter: null,
				wmsServers: WMSServers,
				enableTOCFile: true,
				enableCatalog: false,
				color: '#497b92',
			},
			WFSManager: {
				apiRestUrl: null,
				user: null,
				services: getCatalogServices(geoserverURL),
				cqlFilter: null,
				wfsServers: WFSServers,
				enableTOCFile: false,
				enableCatalog: false,
				color: '#497b92',
			},
			config: {
				position: M.ui.position.TR,
				opened: true,
				color: '#497b92',
				width: 'NORMAL'
			}
		});

		mapajs.addPlugin(catalogPlugin);
	}
};
