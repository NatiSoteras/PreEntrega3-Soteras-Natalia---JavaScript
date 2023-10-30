class Producto {
    nombre;
    precio;
    particip;
    porpart;
    
    constructor(nombre, precio, particip) {
        this.nombre = nombre;
        this.precio = precio;
        this.particip = particip;
        this.porpart = this.precio / this.particip;

    }
}
