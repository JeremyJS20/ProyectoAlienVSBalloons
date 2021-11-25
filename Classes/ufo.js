//Clase para crear el ufo
var ufoValue;
var ufoAttributes = {
    helioTank: 200,
    helioTankText: '',
    helioTankBar: '',
    explotion: '',
    score: 0,
    scoreText: '',
    velocity: 6,
    weapon: '',
    laser: '',
    laserText: '',
    timeBullet: 0,
    ufoActions: {
        UP: '',
        DOWN: '',
        SHOOT:'',
        RELOAD: '',
        PAUSE: ''
    }
} 
var context;

class Ufo {

    constructor(context) {
        if (Ufo.exists) {
            Ufo.instance.ufoValue = context.physics.add.image(850, 300, "ufo");
            Ufo.instance.ufoValue.setCollideWorldBounds(true);
            Ufo.instance.ufoAttributes.helioTank = 200;
            Ufo.instance.ufoAttributes.score = 0;
            Ufo.instance.ufoAttributes.timeBullet = 0;
            return Ufo.instance;
        }

        Ufo.exists = true;
        this.ufoValue = context.physics.add.image(850, 300, "ufo");
        this.exists = true;
        this.context = context;
        this.ufoAttributes = ufoAttributes
        this.ufoValue.setCollideWorldBounds(true);
        Ufo.instance = this;
        
        return Ufo.instance;
    }

}