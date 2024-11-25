
class Cube{

    constructor(x, y, z) {
       
        //Posição do cubo
        this.x = x;
        this.y = y;
        this.z = z;


        //Definição de Geometria do Cubo
        this.geometry = new THREE.BoxGeometry(this.x, this.y, this.z);
        this.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.objectName = "Cube"
        this.cube.isPaint = false

        //Bordas do Cubo
        this.edgesGeometry = new THREE.EdgesGeometry(this.geometry)
        this.edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        this.edges = new THREE.LineSegments(this.edgesGeometry, this.edgesMaterial)
        this.edges.objectName = "BorderCube"


        //Agrupar bordas/qualquer coisa relacionada a alteração no grupo
        this.group = new THREE.Group();
        // this.group.add(this.edges)
        this.group.add(this.cube)
    }

    getMesh() {
        return this.group;
    }

    setColor(r, g, b) {
        this.material = new THREE.MeshStandardMaterial({
            color: `rgb(${r}, ${g}, ${b})` // Especificando em string CSS
        });

        this.cube.material.dispose();
        this.cube.material = this.material;
    }

    setRotation(x, y, z) {
        for (let i = 0; i < this.getMesh().children.length; i++) {
            this.getMesh().children[i].rotation.x = x;
            this.getMesh().children[i].rotation.y = y;
            this.getMesh().children[i].rotation.z = z;
        }
    }


    //mudar Posição X
    setPosX(x) {
        for (let i = 0; i < this.getMesh().children.length; i++) {
            this.getMesh().children[i].position.x = x
        }
    }
    
    //mudar Posição Y 
    setPosY(y) { 
        for (let i = 0; i < this.getMesh().children.length; i++) {
            this.getMesh().children[i].position.y = y
        }
    }

    //mudar Posição Z
    setPosZ(z) { 
        for (let i = 0; i < this.getMesh().children.length; i++) {
            this.getMesh().children[i].position.z = z
        }
    }

}