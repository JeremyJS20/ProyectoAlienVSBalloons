var vGlobales = new gVariables();
import Phaser from "../node_modules/phaser/dist/phaser.js";

/**
 * 13. Esta versión del juego solo debe tener un nivel
 * 14. Esta versión del juego podrá generar mayor cantidad de globos azules. 
 */

//Funciones principales

//funcion que muestra el hud
/**
 * 1. Mostrar el escenario, el personaje y el HUD.
 * 2. El HUD estará ubicado en la parte superior del escenario.
 * 7. El HUD muestra en el margen izquierdo la cantidad de helio que recupera la nave tras
 *    explotar cada globo, y un timer en el margen derecho.
 */
function HUD() {
    timeElapsed.timeElapsedText = context.add.text(425, 1, "00:00", textConfig);

    ufo.ufoAttributes.scoreText = context.add.text(
        1,
        45,
        ufo.ufoAttributes.score + " pts",
        textConfig
    );

    ufo.ufoAttributes.laserText = context.add.text(
        1,
        25,
        "Municion: " +
        ufo.ufoAttributes.laser.children.size +
        "/" +
        ufo.ufoAttributes.laser.children.size,
        textConfig
    );

    limits.textLimitYA = context.add.text(700, 50, "", textLimitConfig);
    limits.textLimitYB = context.add.text(700, 550, "", textLimitConfig);

    progressBox = context.add.graphics();
    ufo.ufoAttributes.helioTankBar = context.add.graphics();

    ufo.ufoAttributes.helioTankBar.fillStyle(0x39ff14, 0.7);
    ufo.ufoAttributes.helioTankBar.fillRect(
        2,
        2,
        ufo.ufoAttributes.helioTank,
        25,
        0
    );
    progressBox.fillStyle(0x000000, 0.7);
    progressBox.fillRect(1, 1, 202, 27, 0);
}

//Funcion que controla los globos
/**
 * 4. Los globos emergen aleatoriamente desde la parte inferior de la pantalla, y suben hasta
 *    desaparecer de la pantalla. Los colores de los globos también son aleatorios (En la funcion de abajo se 
 *    controla el movimiento del globo, en la funcion abajo de esta funcion se crean los globos aleatoriamente).
 */
function balloonsController() {
    if (context.time.now > timebl) {
        blcontainer = blg.getFirstDead(false);
        if (blcontainer) {
            blcontainer.body.reset(
                Math.round(Math.random() * (650 - 100)) + 100,
                700
            );
            blcontainer.visible = true;
            blcontainer.active = true;
            /**
             * 5. La velocidad de los globos es aleatoria, los azules deben subir más rápido.
             */
            if (blcontainer.texture.key === "bBlue") {
                blcontainer.body.velocity.y = -(
                    Math.round(Math.random() * (300 - 275)) + 275
                );
            } else {
                blcontainer.body.velocity.y = -(
                    Math.round(Math.random() * (250 - 225)) + 225
                );
            }

            timebl = context.time.now + 1000;
        } else {}
    }
    //Para que reaparezcan los globos (para reutilizarlos)
    for (let i = 0; i < blg.children.size; i++) {
        if (blg.children.entries[i].y <= -2000) {
            blg.children.entries[i].visible = false;
            blg.children.entries[i].active = false;
        }
    }
}

//funcion para crear  laseres y globos
function laserBulletAndBallonsCreator() {
    ufo.ufoAttributes.laser = context.physics.add.group();
    ufo.ufoAttributes.laser.body = true;
    for (let i = 0; i < 20; i++) {
        blcreator = ufo.ufoAttributes.laser.create(0, 0, "bullet");
        blcreator.visible = false;
        blcreator.active = false;
        blcreator.name = "bullet " + i;
    }
    blg = context.physics.add.group();
    blg.body = true;
    for (let i = 0; i < 30; i++) {
        blcreator = blg.create(
            900,
            600,
            blloons[Math.round(Math.random() * (6 - 0)) + 0]
        );
        blcreator.visible = false;
        blcreator.active = false;
        blcreator.name = "balloon " + i;
    }
}

//Funcion que acaba el juego dada la razon
/**
 * 6. La nave nunca podrá tocar ni la parte superior, ni la parte inferior de la pantalla, en caso de 
 *    hacerlo explota y termina el juego con Game Over.
 */
function endGame(reason) {
    if (reason === "limitCollision") {
        if (ufo.ufoValue.y <= limits.limitYA) {
            actionLose("lya");
        } else if (ufo.ufoValue.y >= limits.limitYB) {
            actionLose("lyb");
        } else {
            return;
        }
    } else if (reason === "youWon") {
        context.scene.transition({
            target: "sceneWon",
            duration: 900,
            data: {
                time: timeElapsed.timeElapsedText.text,
                score: ufo.ufoAttributes.score,
            },
        });
    } else if (reason === "helioTankEmpty") {
        actionLose(reason);
    } else {
        return;
    }

    function actionLose(limit) {
        ufo.ufoAttributes.ufoActions.UP = 0;
        ufo.ufoAttributes.ufoActions.DOWN = 0;
        ufo.ufoAttributes.ufoActions.PAUSE = 0;
        ufo.ufoAttributes.ufoActions.SHOOT = 0;
        ufo.ufoAttributes.ufoActions.RELOAD = 0;
        bulletAmount = null;

        ufo.ufoAttributes.explotion = context.physics.add.sprite(
            850,
            ufo.ufoValue.y,
            "explotion"
        );
        ufo.ufoValue.destroy();
        ufo.ufoAttributes.weapon.destroy();
        ufo.ufoAttributes.explotion.play("explotion");
        //agregar efecto de explosion de nave aqui
        if (limit === "lya") {
            context.scene.transition({
                target: "sceneLose",
                duration: 900,
                data: {
                    rl: "llegar al limite superior.",
                    time: timeElapsed.timeElapsedText.text,
                    score: ufo.ufoAttributes.score,
                },
            });
        } else if (limit === "lyb") {
            context.scene.transition({
                target: "sceneLose",
                duration: 900,
                data: {
                    rl: "llegar al limite inferior.",
                    time: timeElapsed.timeElapsedText.text,
                    score: ufo.ufoAttributes.score,
                },
            });
        } else if (limit === "helioTankEmpty") {
            context.scene.transition({
                target: "sceneLose",
                duration: 900,
                data: {
                    rl: "agotar el helio.",
                    time: timeElapsed.timeElapsedText.text,
                    score: ufo.ufoAttributes.score,
                },
            });
        } else {
            return;
        }
    }
}

//funcion que muestra los limites si el ufo se acerca
function showLimits() {
    if (ufo.ufoValue.y < limits.limitYA + 100) {
        limits.textLimitYA.text = "Peligro -----------";
    } else {
        if (limits.textLimitYA.text !== "") {
            limits.textLimitYA.text = "";
        }
    }

    if (ufo.ufoValue.y > limits.limitYB - 100) {
        limits.textLimitYB.text = "Peligro -----------";
    } else {
        if (limits.textLimitYB.text !== "") {
            limits.textLimitYB.text = "";
        }
    }
}

//funcion que controla la puntuacion
/**
 * 10. Los globos azules aumentan la cantidad de helio en 10 puntos, los demás la aumentan en 1 punto (aqui
 *     se controla la cantidad de helio y el score).
 * 12. Cuando la nave logre un total de 500 puntos en la cantidad de helio, se pasa al siguiente 
 *     nivel. (esta funcion se ejecuta em la funcion collideAndOverlapObjectsDetecter() que se dispara cuando 
 *     colisionan los laseres y los globos)
 */
function scoringController(collider1, collider2) {
    if (collider1.texture.key === 'bBlue') {
        ufo.ufoAttributes.helioTank += 20;
        if (ufo.ufoAttributes.helioTank >= 200) {
            ufo.ufoAttributes.helioTank = 200;
        }
        ufo.ufoAttributes.score += 20
        if (ufo.ufoAttributes.score >= 500) {
            endGame('youWon')
        }
    } else {
        ufo.ufoAttributes.helioTank += 2;
        if (ufo.ufoAttributes.helioTank >= 200) {
            ufo.ufoAttributes.helioTank = 200;
        }
        ufo.ufoAttributes.score += 10;
        if (ufo.ufoAttributes.score >= 500) {
            endGame('youWon')
        }
    }

    ufo.ufoAttributes.helioTankBar.clear();
    ufo.ufoAttributes.helioTankBar.fillStyle(0x39ff14, .7);
    ufo.ufoAttributes.helioTankBar.fillRect(2, 2, ufo.ufoAttributes.helioTank, 25, 0);
    ufo.ufoAttributes.scoreText.setText(ufo.ufoAttributes.score + ' pts')
}

//funcion para crear colisiones y/o traslapaciones entre objetos
function collideAndOverlapObjectsDetecter() {
    context.physics.add.collider(
        blg.children.entries,
        ufo.ufoAttributes.laser.children.entries,
        (collider1, collider2) => {
            scoringController(collider1, collider2);

            bExplotion = context.physics.add.sprite(
                collider1.x,
                collider1.y,
                "bExplotion"
            );
            bExplotion.play("bExplotion");


            collider1.x = 2000;
            collider1.y = 700;
            collider1.visible = false;

            collider2.visible = false;
            collider2.x = 0;
            collider2.y = 0;

            bExplotion = context.physics.add.sprite(
                collider1.x,
                collider1.y,
                "bExplotion"
            );
            PlayAudio(globo_explota);
        },
        () => {},
        this
    );
}

//Funcion que controla al ufo
function ufoController() {
    if (ufo.ufoAttributes.ufoActions.UP.isDown) {
        ufo.ufoValue.y = ufo.ufoValue.y - ufo.ufoAttributes.velocity;
        ufo.ufoAttributes.weapon.y = ufo.ufoValue.y;
        showLimits();
        endGame("limitCollision");
        if (ufo.ufoAttributes.ufoActions.SHOOT.isDown) {
            actionShoot();
        }
    } else if (ufo.ufoAttributes.ufoActions.DOWN.isDown) {
        ufo.ufoValue.y = ufo.ufoValue.y + ufo.ufoAttributes.velocity;
        ufo.ufoAttributes.weapon.y = ufo.ufoValue.y;
        showLimits();
        endGame("limitCollision");
        if (ufo.ufoAttributes.ufoActions.SHOOT.isDown) {
            actionShoot();
        }
    } else if (ufo.ufoAttributes.ufoActions.SHOOT.isDown) {
        actionShoot();
    } else if (ufoAttributes.ufoActions.RELOAD.isDown) {
        if (timer2 === null) {
            if (
                ufo.ufoAttributes.laser.getTotalUsed() ===
                ufo.ufoAttributes.laser.children.size
            ) {
                timer2 = context.time.addEvent({
                    delay: 3000,
                    callback: reloadBullets,
                });
                reloading = true;
                bulletAmount = null;
            }
        } else {
            ufo.ufoAttributes.laserText.setText("Recargando...");
        }
    } else {}

    function reloadBullets() {
        ufo.ufoAttributes.laser.children.each((bullet) => {
            bullet.visible = false;
            bullet.active = false;
        }, this);
        timer2 = null;
        reloading = false;
        ufo.ufoAttributes.laserText.setText(
            "Municion: " +
            ufo.ufoAttributes.laser.children.size +
            "/" +
            ufo.ufoAttributes.laser.children.size
        );
        PlayAudio(recarga_bala);
    }
    /**
     * 11. El láser de la nave sólo dispara en línea recta (aqui se controla el disparo horizontal del laser, en la
     *     funcion laserBulletAndBallonsCreator() se crea el laser).
     */
    function actionShoot() {
        if (context.time.now > ufo.ufoAttributes.timeBullet) {
            bullet2 = ufo.ufoAttributes.laser.getFirstDead(false);
            if (bullet2) {
                bullet2.body.reset(ufo.ufoValue.x - 130, ufo.ufoValue.y);
                bullet2.visible = true;
                bullet2.active = true;
                bullet2.body.velocity.x = -1000;
                ufo.ufoAttributes.timeBullet = context.time.now + 600;

                if (bulletAmount === null) {
                    bulletAmount = ufo.ufoAttributes.laser.children.size;
                }
                ufo.ufoAttributes.laserText.setText(
                    "Municion: " +
                    ufo.ufoAttributes.laser.children.size +
                    "/" +
                    (bulletAmount -= 1)
                );
                PlayAudio(laser);
            }
            if (
                ufo.ufoAttributes.laser.getTotalUsed() ===
                ufo.ufoAttributes.laser.children.size &&
                reloading === true
            ) {
                ufo.ufoAttributes.laserText.setText("Recargando...");
            } else if (
                ufo.ufoAttributes.laser.getTotalUsed() ===
                ufo.ufoAttributes.laser.children.size &&
                reloading === false
            ) {
                ufo.ufoAttributes.laserText.setText("R para recargar");
                PlayAudio(sin_balas);
            } else {}
        }
    }
}

//funcion que controla el tiempo de juego
function timePlaying() {
    timeElapsed.minutes = Math.floor(parseInt(timer.getElapsedSeconds()) / 60);
    timeElapsed.seconds = parseInt(timer.getElapsedSeconds()) % 60;
    timeElapsed.timeElapsedText.setText(
        timeElapsed.minutes.toString().padStart(2, "0") +
        ":" +
        timeElapsed.seconds.toString().padStart(2, "0")
    );
}

//controles de funciones de escena como pausar
function sceneController() {
    ufoAttributes.ufoActions.PAUSE.on("down", (event) => {
        if (ufo.ufoAttributes.ufoActions.PAUSE !== 0) {
            context.scene.launch("sceneMenuPause");
            context.scene.pause();
        } else {
            return;
        }
    });
}

//funcion para crear animaciones
function animations() {
    context.anims.create({
        key: "explotion",
        frameRate: 100,
        frames: context.anims.generateFrameNumbers("explotion", {
            start: 0,
            end: 71,
        }),
        repeat: 0,
        hideOnComplete: true,
    });
    context.anims.create({
        key: "bExplotion",
        frameRate: 35,
        frames: context.anims.generateFrameNumbers("bExplotion", {
            start: 0,
            end: 17,
        }),
        repeat: 0,
        hideOnComplete: true,
    });
}

//funcion que determina el background del escenario
function sceneBackground(bg) {
    if (bg === "cDia") {
        var div = document.getElementById("gameContainer");
        div.style.backgroundColor = "#99CCFF";
        bgGame = context.add.image(450, 400, "city");
        cloud = context.add.tileSprite(450, -100, 1000, 650, "cloudDay");
        cloud.flipY = true;
        cloud.flipX = true;
        bgGame.flipX = true;
        textConfig = {
            color: "#000",
            fontFamily: "Fontdiner Swanky",
            fontSize: 20,
            padding: 5,
        };
    } else if (bg === "cNoche") {
        var div = document.getElementById("gameContainer");
        div.style.backgroundColor = "#0f130c";
        bgGame = context.add.image(450, 400, "city");
        cloud = context.add.tileSprite(450, -100, 1000, 650, "cloudNight");
        cloud.flipY = true;
        cloud.flipX = true;
        bgGame.flipX = true;
        textConfig = {
            color: "#ffff",
            fontFamily: "Fontdiner Swanky",
            fontSize: 20,
            padding: 5,
        };
    } else if (bg === "skyDia") {
        var div = document.getElementById("gameContainer");
        div.style.backgroundColor = "#99CCFF";
        cloud = context.add.tileSprite(450, 500, 1000, 650, "cloudDay");
        sun = context.add.image(875, 15, "sun");
        textConfig = {
            color: "#000",
            fontFamily: "Fontdiner Swanky",
            fontSize: 20,
            padding: 5,
        };
    } else if (bg === "skyNoche") {
        var div = document.getElementById("gameContainer");
        div.style.backgroundColor = "#0f130c";
        moon = context.add.image(450, 300, "stars");
        sun = context.add.image(875, 15, "moon");
        cloud = context.add.tileSprite(450, 500, 1000, 650, "cloudNight");
        textConfig = {
            color: "#ffff",
            fontFamily: "Fontdiner Swanky",
            fontSize: 20,
            padding: 5,
        };
    }
}

class scenePlayGame extends Phaser.Scene {
    constructor() {
        super({ key: "scenePlayGame" });
    }

    preload() {
        context = this;

        //images
        this.load.image("sun", "./src/images/scenaryBackground/animeted sun.png");
        this.load.image("cloudDay", "./src/images/scenaryBackground/cloudDay.png");
        this.load.image(
            "cloudNight",
            "./src/images/scenaryBackground/cloudNight.png"
        );
        this.load.image("stars", "./src/images/scenaryBackground/stars.png");
        this.load.image("moon", "./src/images/scenaryBackground/animated moon.png");
        this.load.image("city", "./src/images/scenaryBackground/city.png");

        //sprites
        this.load.image("ufo", "./src/images/ufo.png");
        this.load.image("weapon", "./src/images/weapon.png");
        this.load.image("bullet", "./src/images/laser2.png");
        this.load.image("bRed", "./src/images/g-rojo.png");
        this.load.image("bBlue", "./src/images/g-azul.png");
        this.load.image("bYellow", "./src/images/g-amarillo.png");
        this.load.image("bGreen", "./src/images/g-verde.png");
        this.load.image("bRose", "./src/images/g-rosa.png");
        this.load.image("bPurple", "./src/images/g-morado.png");

        //spritesheet
        this.load.spritesheet("explotion", "./src/images/explotion.png", {
            frameWidth: 92.77777777,
            frameHeight: 90,
        });

        this.load.spritesheet("bExplotion", "./src/images/balloonExplote.png", {
            frameWidth: 90,
            frameHeight: 90,
        });

        this.forceSingleUpdate = true;
    }

    init(data) {
        this.sceneBg = data.bg;
    }

    create() {
        context = this;

        //background del juego
        sceneBackground(context.sceneBg);

        animations();

        //objetos fisicos del juego
        /**
         * 3. La nave de Galushi estará ubicada en el extremo derecho, y sólo podrá moverse verticalmente.
         */
        ufo = new Ufo(context);
        ufo.ufoAttributes.weapon = context.add.image(
            ufo.ufoValue.x - 55,
            ufo.ufoValue.y - 5,
            "weapon"
        );

        //limites de la fisica
        context.physics.world.setBounds(0, 0, 900, 550, true, true, true, false);

        //gamepad
        ufo.ufoAttributes.ufoActions.UP = context.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.UP
        );
        ufo.ufoAttributes.ufoActions.DOWN = context.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.DOWN
        );
        ufo.ufoAttributes.ufoActions.SHOOT = context.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        ufo.ufoAttributes.ufoActions.PAUSE = context.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.P
        );
        ufo.ufoAttributes.ufoActions.RELOAD = context.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        );

        sceneController();
        laserBulletAndBallonsCreator();
        collideAndOverlapObjectsDetecter();
        HUD();

        timer = context.time.addEvent({
            delay: 360000,
            callback: () => {
                ufo.ufoAttributes.explotion = context.physics.add.sprite(
                    850,
                    ufo.ufoValue.y,
                    "explotion"
                );
                ufo.ufoValue.destroy();
                ufo.ufoAttributes.weapon.destroy();
                ufo.ufoAttributes.explotion.play("explotion");
                //agregar efecto de sonido de explosion de nave aqui

                context.scene.transition({
                    target: "sceneLose",
                    duration: 900,
                    data: {
                        rl: "tiempo acabado.",
                        time: timeElapsed.timeElapsedText.text,
                        score: ufo.ufoAttributes.score,
                    },
                });
                bulletAmount = null;
            },
        });

        /**
         * 8. Por cada 10 segundos que pasen, la nave pierde 5 puntos en la cantidad de helio disponible
         *    para la nave.
         */
        timer3 = context.time.addEvent({
            delay: 10000,
            loop: true,
            callback: () => {
                ufo.ufoAttributes.helioTank -= 20;
                ufo.ufoAttributes.helioTankBar.clear();
                ufo.ufoAttributes.helioTankBar.fillStyle(0x39ff14, 0.7);
                ufo.ufoAttributes.helioTankBar.fillRect(
                    2,
                    2,
                    ufo.ufoAttributes.helioTank,
                    25,
                    0
                );
                /**
                 * 9. Si la cantidad de helio llega a cero, la nave explota y termina el juego con Game Over.
                 */
                if (ufo.ufoAttributes.helioTank <= 0) {
                    endGame('helioTankEmpty');
                }
            },
        });

        //agregar musica de fondo de gameplay aqui
    }

    update(time, delta) {
        context = this;
        if (context.scene.isActive() === true) {
            ufoController();
            balloonsController();
            timePlaying();

            //Efecto de movimiento de las nubes
            if (this.sceneBg === "cDia" || this.sceneBg === "cNoche") {
                cloud.tilePositionX -= 0.5;
            } else {
                cloud.tilePositionX += 0.5;
            }


        }
    }
}

var sin_balas = new Audio('audio/sin_balas.mp3');
var laser = new Audio('audio/laser.mp3');
var recarga_bala = new Audio('audio/recarga_bala.mp3');
var globo_explota = new Audio('audio/globo_explota.mp3');

function PlayAudio(audio) {
    audio.play();
    audio.currentTime = 0;
}

//Exports
export { scenePlayGame as default };