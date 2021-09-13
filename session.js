class Session{
    set polygons(polygons) {
        this.varpolygons = polygons;
    }

    get polygons() {
        return this.varpolygons;
    }
    
    set marker(marker) {
        this.varmarker = marker;
    }

    get marker() {
        return this.varmarker;
    }
    
    set map(map) {
        this.varmap = map;
    }

    get map() {
        return this.varmap;
    }
    
    constructor(map) {
        this.polygons = [];
        this.marker = [];

        this.varmap = map;
    }
    
    addPolygon(polygon) {
        this.varpolygons.push(polygon);
    }
    
    addMarker(marker) {
        this.varmarker.push(marker);
    }
}