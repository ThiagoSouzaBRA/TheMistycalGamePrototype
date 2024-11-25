class Cursor{
    constructor(){
        this.geometry = new THREE.SphereGeometry(0.2, 16, 16)
        this.material = new THREE.MeshBasicMaterial({color: 0xffffff})
        this.cursor = new THREE.Mesh(this.geometry, this.material)
        this.cursor.position.set(0,0,0)
        this.cursor.renderOrder = 1
        this.cursor.material.depthTest = false;
        return this.cursor
    }
}