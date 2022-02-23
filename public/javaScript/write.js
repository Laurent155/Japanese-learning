// canvas = document.getElementById('myCanvas');
// context = canvas.getContext("2d");
// canvas.addEventListener('mousedown', function (e) {
// 	console.log(e);
//     context.beginPath();
// 	context.moveTo(e.offsetX, e.offsetY);
// 	canvas.addEventListener('mousemove', ()=>{onPaint(e)}, false);
// }, false); 
// var onPaint = function (e) {
// 	console.log($);
// 	context.lineTo(e.offsetX, e.offsetY);
// 	context.stroke();
// };

const paintCanvas = document.getElementById( 'myCanvas' );
const context = paintCanvas.getContext( '2d' );
context.lineCap = 'round';
context.lineWidth = 3;
// context.fillStyle = 'black';
// context.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
// context.strokeStyle = 'white';


let x = 0, y = 0;
let isMouseDown = false;

const stopDrawing = () => { isMouseDown = false; }
const startDrawing = event => {
    isMouseDown = true;   
   [x, y] = [event.offsetX, event.offsetY];  
}
const drawLine = event => {
    if ( isMouseDown ) {
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.beginPath();
        context.moveTo( x, y );
        context.lineTo( newX, newY );
        context.stroke();
        //[x, y] = [newX, newY];
        x = newX;
        y = newY;
    }
}

paintCanvas.addEventListener( 'mousedown', startDrawing );
paintCanvas.addEventListener( 'mousemove', drawLine );
paintCanvas.addEventListener( 'mouseup', stopDrawing );
paintCanvas.addEventListener( 'mouseout', stopDrawing );

// paintCanvas.addEventListener('mouseup', processImage, false);

const processImage = ()=>{
    // $('#number').html('<img id="spinner" src="spinner.gif"/>');
    // canvas.removeEventListener('mousemove', onPaint, false);
	isMouseDown = false;
    var img = new Image();
    img.onload = function () {
        // context.drawImage(img, 0, 0, 48, 48);
        data = context.getImageData(0, 0, 48, 48).data;
        var input = [];
        for (var i = 0; i < data.length; i += 4) {
            input.push(data[i + 2] / 255);
        }
        predict(input);
    };
    img.src = paintCanvas.toDataURL('image/png');
}

tf.loadLayersModel('./model/model.json')
    .then(function (model) {
        window.model = model;
        console.log(model);
    });
// const model = await tf.loadLayersModel('./model/model.json').then(function (model) {window.model = model});
// Predict function
var predict = function (input) {
    if (window.model) {
        // input = tf.image.grayscaleToRGB(input);
        window.model.predict([tf.tensor(input)
            .reshape([1, 48, 48, 1])])
            .array().then(function (scores) {
                scores = scores[0];
                console.log(scores);
                predicted = scores
                    .indexOf(Math.max(...scores));
                $('#predicted').html(predicted);
            });
    } else {
  
        // The model takes a bit to load, 
        // if we are too fast, wait
        setTimeout(function () { predict(input) }, 50);
    }
}