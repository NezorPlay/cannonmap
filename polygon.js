class Polygon {

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

    set lPolygon(lPolygon) {
        this.varlPolygon = lPolygon;
    }

    get lPolygon() {
        return this.varlPolygon;
    }

    constructor(coords, map) {
        this.varcoords = coords;
        this.varmap = map;
    }

    compile() {
        
        //var coords =  [[48,-3],[50,5],[44,11],[48,-3]] ;     
        if (this.varcolor == null) {
            this.varcolor = "#9999ff";
        }
        this.varlPolygon = L.polygon(this.varcoords, {color: this.varcolor});
        this.varlPolygon.bindPopup("<b>" + this.name +"</b>").openPopup();
    }

    draw() {
        this.compile();
        this.varlPolygon.addTo(this.varmap);
        this.varmap.fitBounds(this.varlPolygon.getBounds());
    }

    remove() {
        this.varmap.removeLayer(this.varlPolygon)
    }
}