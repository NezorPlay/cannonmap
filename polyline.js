class Polyline {

    set name(name) {
        this.varname = name;
    }

    get name() {
        return this.varname;
    }

    set coords(coords) {
        this.varcoords = coords;
    }

    get coords() {
        return this.varcoords;
    }

    set map(map) {
        this.varmap = map;
    }

    get map() {
        return this.varmap;
    }

    set color(color) {
        this.varcolor = color;
    }

    get color() {
        return this.varcolor;
    }

    set lPolyline(lPolyline) {
        this.varlPolyline = lPolyline;
    }

    get lPolyline() {
        return this.varlPolyline;
    }

    constructor(marker1, marker2, map) {
        this.marker1 = marker1;
        this.marker2 = marker2;
        this.varmap = map;
    }

    compile() {
        
        //var coords =  [[48,-3],[50,5],[44,11],[48,-3]] ;     
        if (this.varcolor == null) {
            this.varcolor = "#9999ff";
        }

        let cords = [];
        cords.push(this.marker1.coords);
        cords.push(this.marker2.coords);

        //console.log("i"+this.marker1);

        this.varlPolyline = L.polyline(cords, {color: this.varcolor});
        this.varlPolyline.bindPopup(this.name);
    }

    draw() {
        this.compile();
        this.varlPolyline.addTo(this.varmap);
        this.varmap.fitBounds(this.varlPolyline.getBounds());
    }

    remove() {
        this.varmap.removeLayer(this.varlPolyline)
    }
}