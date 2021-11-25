var WebFontConfig;

var context = '';
//variable que contendra el asset ufo
var ufo = '';

//tiempo que transcurre en el juego
var timeElapsed = {
  minutes: 0,
  seconds: 0,
  timeElapsedText: "",
};

//Globos
var blg;
var blcreator;
var timebl = 0;
var blcontainer;
var bExplotion = '';
var blloons = ['bRed', 'bBlue', 'bRose', 'bPurple', 'bYellow', 'bBlue', 'bGreen']

//configunarion de texto del HUD
var textConfig;

//configuracion de texto limites
var textLimitConfig = {
  color: "#FF0000",
  fontFamily: 'Fontdiner Swanky',
  fontSize: 20,
};

//limites hasta donde no debe llegar el ufo
var limits = {
  limitYA: 85,
  limitYB: 540,
  textLimitYA: "",
  textLimitYB: "",
};

class gVariables{
    constructor(){
        if (gVariables.exists) {
            return gVariables.instance;
        }
        gVariables.exists = true
        gVariables.instance = this;
        return gVariables.instance;
    }
}

var resume = '';
var quit = "";
var bullet;
var bullet2;
var bulletAmount = null;
var reloading = false;
var timer;
var timer2 = null;
var timer3;
//variables del background del escenario
var bgGame = '';
var sun;
var moon;
var cloud;
var bgScenes = ['cDia', 'cNoche', 'skyDia', 'skyNoche']
var progressBox;
