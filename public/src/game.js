///////////////////////////////////////////////////////////////////////////
/////////////////// LISTA DE COISAS PARA FAZER/CONSERTAR/RIR //////////////
///////////////////////////////////////////////////////////////////////////
/* FAÇA COM FELICIDADE ;)



*/

// Variáveis Globais
let scene, camera, renderer, cube;
let mouseX = 0, mouseY = 0;

let ferramentaSelecionada = null;
/*
Remover
Pintar
Implamantar
*/

const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
const screen = document.getElementById("screen");
let cameraSize

// Configuração inicial
function setup() {
    // Configuração da cena
    scene = new THREE.Scene();

    // Obtendo as dimensões reais do elemento #screen
    const width = screen.offsetWidth;
    const height = screen.offsetHeight;

    // Configuração da câmera ortográfica
    const aspect = width / height;
    cameraSize = 10;
    camera = new THREE.OrthographicCamera(
        -cameraSize * aspect, // esquerda
        cameraSize * aspect,  // direita
        cameraSize,           // topo
        -cameraSize,          // baixo
        -1000,                    // plano próximo
        1000                  // plano distante
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // Configuração do renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    screen.appendChild(renderer.domElement);

    // Adicionando luzes
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(15, 10, 5).normalize();
    scene.add(light);

    //Adicionando Texto
    // const texto = new Text('Seja bem vindo@', 0, 0, 32)
    // scene.add(texto)

    //Adicionar Cursor
    // cursor = new Cursor();
    // scene.add(cursor)

    // Eventos
    document.getElementById('Borracha').addEventListener('click', () => { ferramentaSelecionada = "Borracha" })
    document.getElementById('Pincel').addEventListener('click', () => { ferramentaSelecionada = "Pincel" })
    document.getElementById('Bloco').addEventListener('click', () => { ferramentaSelecionada = "Bloco" })
    document.getElementById('novaPlataforma').addEventListener('click', () => { AdicionarPlataforma() })


    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', updateCursor);


    window.addEventListener('click', event => {
        let objectClicked = getObjectClicked(event);


        if (objectClicked && ferramentaSelecionada === "Bloco") {
            if (objectClicked.objectName === "Cube") {
                console.log("encontrou!")
                const parentCube = plataformCubes.find(
                    (c) => c.getMesh().children.includes(objectClicked)
                );
                if (parentCube) {
                    adicionarBlocosLaterais(parentCube); // Adiciona os blocos ao redor
                }
            }
        }

        //Caso clique em algum objeto
        if (objectClicked) {
            console.log(objectClicked.objectName)

            switch (objectClicked.objectName) {
                //Borda do cubo
                case "Cube":
                    let cube = objectClicked.parent.children.find(child => child.objectName == "Cube")

                    if (cube) {
                        if (ferramentaSelecionada == "Borracha") {
                            scene.remove(objectClicked.parent)
                            return
                        }

                        if (ferramentaSelecionada == "Pincel") {
                            cube.material.color.set(`rgb(${255}, ${0}, ${0})`)
                            cube.isPaint = true;
                            return
                        }                      
                    }


                    break;
            }
        }

    })

}



//Função para verificar todos os objetos da cena
function getObjectClicked(event) {
    const rect = screen.getBoundingClientRect()

    //Obter coordenadas de Mouse
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    //Raycaster detecção objetos com mouse
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
        // console.log(intersects[0].object.objectName)
        return intersects[0].object;
    }

    return null

}

function adicionarBlocosLaterais(cube) {
    const spacing = 1.5; // Espaçamento padrão entre os cubos
    const mesh = cube.getMesh(); // Obtém o grupo do cubo clicado
    const pos = mesh.children[0].position; // Posição do cubo clicado (primeiro filho do grupo)

    // Posições relativas para as laterais
    const lados = [
        // { x: spacing, y: 0, z: 0 },  // Direita
        // { x: -spacing, y: 0, z: 0 }, // Esquerda
        { x: 1.5, y: 0, z: spacing },  // Frente
        // { x: 0, y: 0, z: -spacing }, // Trás
    ];

    lados.forEach((lado) => {
        const novaPosX = pos.x + lado.x;
        const novaPosY = pos.y + lado.y;
        const novaPosZ = pos.z + lado.z;

        // Verifica se já existe um cubo na posição
        const existeCubo = plataformCubes.some((c) => {
            const cPos = c.getMesh().children[0].position; // Posição do cubo existente
            return cPos.x === novaPosX && cPos.y === novaPosY && cPos.z === novaPosZ;
        });

        if (!existeCubo) {
            // Cria um novo cubo
            const novoCubo = new Cube(1.5, 1.5, 1.5);
            novoCubo.setPosX(novaPosX);
            novoCubo.setPosY(novaPosY);
            novoCubo.setPosZ(novaPosZ);
            novoCubo.setColor(0, 255, 255); // Define a cor padrão (ajustável)

            // Adiciona o novo cubo à lista e à cena
            plataformCubes.push(novoCubo);
            scene.add(novoCubo.getMesh());
        }
    });
}



let plataformCubes = []
let corPlataforma = { r: 0, g: 255, b: 255 }
let corCuboSelecionado = { r: 255, g: 255, b: 255 }
let corCuboSelecionadoBorracha = { r: 255, g: 0, b: 0 }

// Criar o cubo e adicioná-lo à cena
function setupPlataforma(linhas = 5, colunas = 5, x = -2, y = 5, z = 0) {
    let posX = x;
    let posY = y;
    let posZ = z
    let scaleCube = [1.5, 1.5, 1.5]
    // let cubos = 10;
    let spacing = 0.05;


    for (let linha = 0; linha < linhas; linha++) {
        for (let coluna = 0; coluna < colunas; coluna++) {
            let newCube = new Cube(scaleCube[0], scaleCube[1], scaleCube[2])
            
            newCube.setColor(corPlataforma.r, corPlataforma.g, corPlataforma.b)

            let cubeX = posX + coluna * (scaleCube[0] + spacing);
            let cubeZ = posZ + linha * (scaleCube[2] + spacing)

            newCube.setPosX(cubeX)
            newCube.setPosY(posY)
            newCube.setPosZ(cubeZ)

            plataformCubes.push(newCube)
            scene.add(newCube.getMesh())

        }
    }
}




// Loop de atualização usando setInterval
function startGame() {
    const fps = 60; // Definir a taxa de quadros por segundo
    const interval = 1000 / fps; // Tempo entre cada atualização em milissegundos

    // Criando o tabuleiro
    AdicionarPlataforma()

    setInterval(() => {
        update();
    }, interval);
}

let level = -1
function AdicionarPlataforma() {
    setupPlataforma(10, 10, -2, (2 + (1.5 * 1)));

}

//Animação horrivel mas serve
let valor = 0;
let direction = 1;
let limiteTeto = 50
let animMode = false

function visualizacaoMapa(dir) {

    const velMoveMap = 0.15;
    const smoothFactor = 0.5;

    if (dir == "cima") {

        let targetY = camera.position.y + velMoveMap;
        camera.position.y += (targetY - camera.position.y) * smoothFactor

    }

    if (dir == "baixo") {

        let targetY = camera.position.y - velMoveMap;
        camera.position.y += (targetY - camera.position.y) * smoothFactor

    }

    if (dir == "direita") {

        let targetX = camera.position.x + velMoveMap;
        camera.position.x += (targetX - camera.position.x) * smoothFactor

    }
    if (dir == "esquerda") {

        let targetX = camera.position.x - velMoveMap;
        camera.position.x += (targetX - camera.position.x) * smoothFactor

    }
    camera.updateProjectionMatrix()
}

// Atualizar a cena
function update() {

    valor += direction
    if (valor == limiteTeto) {
        direction = -1
    }

    if (valor == (0 - limiteTeto)) {
        direction = 1
    }


    if (animMode) {
        for (let i = 0; i < plataformCubes.length; i++) {
            if (i % 3 == 0) {
                // Efeito de rotação (opcional)
                plataformCubes[i].getMesh().position.y = valor / 100;
            }
            else {
                plataformCubes[i].getMesh().position.y = -(valor / 100);
            }
        }
    }


    // Renderizar a cena
    renderer.render(scene, camera);
}

function addCameraSize(value) {
    cameraSize += value;
    const width = screen.offsetWidth;
    const height = screen.offsetHeight;

    // Configuração da câmera ortográfica
    const aspect = width / height;
    camera.left = -cameraSize * aspect;
    camera.right = cameraSize * aspect;
    camera.top = cameraSize;
    camera.bottom = -cameraSize;

    camera.updateProjectionMatrix();
}

// Redimensionar a cena
function onResize() {

    const width = screen.offsetWidth;
    const height = screen.offsetHeight;
    const aspect = width / height;

    camera.left = -10 * aspect;
    camera.right = 10 * aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

let cursor;
let ultimoCuboDestacado;
// Ao mexer mouse ele atualiza as variaveis que estão a cada atualização de frame da aplicação
function updateCursor(event) {
    const rect = screen.getBoundingClientRect()

    //Obter coordenadas de Mouse
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (mouse.y > 0.8) {
        for (let a = 0; a < plataformCubes.length; a++) {
            // Atualizar posição do cubo
            plataformCubes[a].getMesh().position.x += .01; // Escala de movimento
            plataformCubes[a].getMesh().position.x += .01;
        }
    }

    //Raycaster detecção objetos com mouse
    raycaster.setFromCamera(mouse, camera)

    let objectHover = getObjectClicked(event);

    //Caso o mouse fique sob algum objeto
    if (objectHover) {

        if (ferramentaSelecionada == "Borracha") {
            let cuboselecionado = objectHover.parent.children.find(child => child.objectName == "Cube")
            //Caso o bloco selecionado seja diferente do ultimo bloco selecionado ele ficará vermelho
            if (ultimoCuboDestacado !== cuboselecionado) {
                //Caso ele seleciono outro bloco que nao seja o ultimo, deixará o ultimo com cor original se mão foi pintado
                if (ultimoCuboDestacado && ultimoCuboDestacado) {
                    ultimoCuboDestacado.material.color.set(`rgb(${corPlataforma.r}, ${corPlataforma.g}, ${corPlataforma.b})`)
                }
                //Caso seja diferente do ultimo cubo selecionado e não foi pintado anteriormente ele deixará da cor selecionado
                if (cuboselecionado.isPaint != true) {
                    cuboselecionado.material.color.set(`rgb(${corCuboSelecionadoBorracha.r}, ${corCuboSelecionadoBorracha.g}, ${corCuboSelecionadoBorracha.b})`)

                }


                //Substitui as variaveis para continuar o ciclo
                ultimoCuboDestacado = cuboselecionado
            }
            return
        }

        if (ferramentaSelecionada == "Pincel") {
            let cuboselecionado = objectHover.parent.children.find(child => child.objectName == "Cube")
            //Caso o bloco selecionado seja diferente do ultimo bloco selecionado ele ficará vermelho
            if (ultimoCuboDestacado !== cuboselecionado) {
                //Caso ele seleciono outro bloco que nao seja o ultimo, deixará o ultimo com cor original se mão foi pintado
                if (ultimoCuboDestacado && ultimoCuboDestacado.isPaint != true) {
                    ultimoCuboDestacado.material.color.set(`rgb(${corPlataforma.r}, ${corPlataforma.g}, ${corPlataforma.b})`)
                }
                if (cuboselecionado.isPaint != true) {
                    //Caso seja diferente do ultimo cubo selecionado ele deixará vermelho
                    cuboselecionado.material.color.set(`rgb(${corCuboSelecionado.r}, ${corCuboSelecionado.g}, ${corCuboSelecionado.b})`)
                }
                //Substitui as variaveis para continuar o ciclo
                ultimoCuboDestacado = cuboselecionado
            }
        }



    }


}

function teclado() {
    document.addEventListener("keydown", (event) => {
        const key = event.key; // A tecla pressionada
        let offsetTransaction = 0.9;

        if (key === "2") {
            for (let i = 0; i < plataformCubes.length; i++) {
                plataformCubes[i].getMesh().rotation.y -= offsetTransaction;
            }
        }
        if (key === "4") {
            for (let i = 0; i < plataformCubes.length; i++) {
                plataformCubes[i].getMesh().rotation.x += offsetTransaction;
            }
        }
        if (key === "6") {
            for (let i = 0; i < plataformCubes.length; i++) {
                plataformCubes[i].getMesh().rotation.x -= offsetTransaction;
            }
        }
        if (key === "8") {
            for (let i = 0; i < plataformCubes.length; i++) {
                plataformCubes[i].getMesh().rotation.y += offsetTransaction;
            }
        }
        if (key === "1") {
            for (let i = 0; i < plataformCubes.length; i++) {
                plataformCubes[i].getMesh().position.z += offsetTransaction;
            }
        }
        if (key === "3") {
            for (let a = 0; a < plataformCubes.length; a++) {
                plataformCubes[a].getMesh().position.x += offsetTransaction;
            }
        }
        if (key === "7") {
            for (let i = 0; i < plataformCubes.length; i++) {
                plataformCubes[i].getMesh().position.x -= offsetTransaction;
            }
        }
        if (key === "9") {
            for (let i = 0; i < plataformCubes.length; i++) {
                plataformCubes[i].getMesh().position.z -= offsetTransaction;
            }
        }
        if (key === "+") {
            addCameraSize(-0.25);
        }
        if (key === "-") {
            addCameraSize(0.25);
        }
        if (key === "m") {
            animMode = !animMode;
        }
        if (key === "w") {
            visualizacaoMapa("cima");
        }
        if (key === "a") {
            visualizacaoMapa("esquerda");
        }
        if (key === "s") {
            visualizacaoMapa("baixo");
        }
        if (key === "d") {
            visualizacaoMapa("direita");
        }
    });
}



// Inicializar o jogo
setup();
// Iniciar o loop de atualização com setInterval
startGame();
//Adicionando Teclado ao jogo
teclado();


