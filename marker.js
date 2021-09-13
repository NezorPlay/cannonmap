class Marker {

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

    set lMarker(lMarker) {
        this.varlMarker = lMarker;
    }

    get lMarker() {
        return this.varlMarker;
    }

    set icon(icon) {
        this.varicon = icon;
    }

    get icon() {
        return this.varicon;
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

        
        
        this.varlMarker = L.marker(this.varcoords, {color: this.varcolor, icon: Marker.getIconByType(this.icon)});
        this.varlMarker.bindPopup("<b>" + this.name +"</b>").openPopup();
    }

    static getIconByType(icon) {
        var cannonIcon = L.icon({
            iconUrl: 'cannon.png',
            iconSize:     [50, 82], // size of the icon
            iconAnchor:   [24, 82], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        
        var fortIcon = L.icon({
            iconUrl: 'fort.png',
            iconSize:     [42, 71], // size of the icon
            iconAnchor:   [21, 71], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        switch (icon) {
            case "fort":
                return fortIcon;
                break;
            case "cannon":
                return cannonIcon;
                break;
        
            default:
                return fortIcon;
                break;
        }
    }

    draw() {
        this.compile();
        this.varlMarker.addTo(this.varmap);
    }

    remove() {
        this.varmap.removeLayer(this.varlMarker)
    }
}