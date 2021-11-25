let balloonValue;
let balloonAttributes = {
    color: 'bBlue',
    bExplotion: ''
};

class Balloon {    

    constructor(context, attributes) {
        if (attributes.color === '' || attributes.color === undefined || attributes.color === undefined || color === 'bBlue' || attributes === undefined) {
            this.balloonValue = context.physics.add.sprite(
                Math.round(Math.random() * (650 - 150)) + 150,
                700,
                'bBlue'
              );
              this.balloonAttributes.color = 'bBlue';
              this.balloonAttributes.bExplotion = '';
              return this;
        } 
            this.balloonValue = context.physics.add.sprite(
                Math.round(Math.random() * (650 - 150)) + 150,
                700,
                attributes.color
              );
    

        this.balloonAttributes = attributes;

        return this;
    }

    getBalloonValue(){
        return balloonValue;
    }

    getBalloonAttributes(){
        return balloonAttributes;
    }
    
    setBalloonValue(value){
        this.balloonValue = value;
    }

    setBalloonAttributes(attributes){
        this.balloonAttributes = attributes;
    }
    
}

