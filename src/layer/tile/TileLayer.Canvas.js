L.TileLayer.Canvas = L.TileLayer.extend({
	options: {
		async: false
	},

	redraw: function () {
		for (var i in this._tiles) {
			var tile = this._tiles[i];
			this._redrawTile(tile);
		}
	},

	_redrawTile: function (tile) {
		this.drawTile(tile, tile._tilePoint, tile._zoom);
	},

	_resetTile: function (tile) {
		if (tile.tileImg) {
			delete tile.tileImg;
		}
	},

	_createTileProto: function () {
		this._canvasProto = L.DomUtil.create('canvas', 'leaflet-tile');
		this._tileImg = L.DomUtil.create('img', 'leaflet-tile');
		this._tileImg.galleryimg = 'no';

		var tileSize = this.options.tileSize;
		this._canvasProto.width = tileSize;
		this._canvasProto.height = tileSize;
	},

	_createTile: function () {
		var tile = this._canvasProto.cloneNode(false);
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		return tile;
	},


	_tileOnLoad: function (e) {
		var layer = this._layer;

		this.className += ' leaflet-tile-loaded';
		layer.fire('tileload', {tile: this});

		layer._tilesToLoad--;
		if (!layer._tilesToLoad) {
			layer.fire('load');
		}
	},

	_imgOnLoad: function (e) {
		var tile = this._tile;
		var layer = tile._layer;

		tile.className += ' leaflet-tile-loaded';
		layer._redrawTile(tile);
		layer.fire('tileload', {tile: this, url: this.src});

		layer._tilesToLoad--;
		if (!layer._tilesToLoad) {
			layer.fire('load');
		}
	},

	_loadTile: function (tile, tilePoint, zoom) {
		tile._layer = this;
		tile._tilePoint = tilePoint;
		tile._zoom = zoom;

		this.drawTile(tile, tilePoint, zoom);

		if (this._url) {
			var url = this.getTileUrl(tilePoint, zoom);
			var tileImg = this._tileImg.cloneNode(false);
			tileImg._tile = tile;
			tileImg.onselectstart = tile.onmousemove = L.Util.falseFn;
			tileImg.onload = this._imgOnLoad;
			tileImg.onerror = this._tileOnError;
			tileImg.src = url;
			tile.tileImg = tileImg;
		}
		else {
			if (!this.options.async) {
				this.tileDrawn(tile);
			}
		}
	},

	drawTile: function (tile, tilePoint, zoom) {
		// override with rendering code
	},

	tileDrawn: function (tile) {
		this._tileOnLoad.call(tile);
	}
});
