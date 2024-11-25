class Grama extends Cube {
    constructor(x, y, z) {
        // Chama o construtor da classe base Cube
        super(x, y, z);

        // Sobrescrevendo a cor padrão para algo que represente "terra"
        this.setColor(34, 139, 34); // Marrom (RGB: 139, 69, 19)
        // Adicionando propriedades específicas da classe Terra, se necessário
        this.cube.objectName = "Grama"; // Diferenciando do Cube padrão
    }
}
