class Text{
    constructor(texto, x, y, size, cor = 'white', background = 'black'){
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')

        this.posX = x;
        this.posY = y;
        //tamanho
        this.canvas.width = 512
        this.canvas.height = 512

        // this.context.fillStyle = background;
        // this.context.fillRect(this.posX, this.posY)

        this.context.fillStyle = cor;
        this.context.font = `${size}px Arial`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle'

        this.texture = new THREE.CanvasTexture(this.canvas)

        this.context.fillText(texto, this.canvas.width / 2, this.canvas.height / 2)

        this.geometry = new THREE.PlaneGeometry(4,2)
        this.material = new THREE.MeshBasicMaterial({map: this.texture})
        this.plane = new THREE.Mesh(this.geometry, this.material)

        return this.plane
    }



}