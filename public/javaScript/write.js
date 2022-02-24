const hiragana = ["あ",
"い",
"う",
"え",
"お",
"か",
"が",
"き",
"ぎ",
"く",
"ぐ",
"け",
"げ",
"こ",
"ご",
"さ",
"ざ",
"し",
"じ",
"す",
"ず",
"せ",
"ぜ",
"そ",
"ぞ",
"た",
"だ",
"ち",
"ぢ",
"つ",
"づ",
"て",
"で",
"と",
"ど",
"な",
"に",
"ぬ",
"ね",
"の",
"は",
"ば",
"ぱ",
"ひ",
"び",
"ぴ",
"ふ",
"ぶ",
"ぷ",
"へ",
"べ",
"ぺ",
"ほ",
"ぼ",
"ぽ",
"ま",
"み",
"む",
"め",
"も",
"や",
"ゆ",
"よ",
"ら",
"り",
"る",
"れ",
"ろ",
"わ",
"を",
"ん"]
const paintCanvas = document.getElementById( 'myCanvas' );
const context = paintCanvas.getContext( '2d' );
context.lineCap = 'round';
context.lineWidth = 5;

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
    img.src = paintCanvas.toDataURL('image/png');
    img.onload = function () {
        context.drawImage(img, 0, 0, 48, 48);
        data = context.getImageData(0, 0, 48, 48).data;
        context.clearRect(0, 0, 48, 48);
        // context.fillStyle = 'white';
        // context.fillRect(0, 0, 48, 48);
        console.log(data);
        var input = [];
        for (var i = 0; i < data.length; i += 4) {
            input.push(data[i + 3] / 255);
        }
        predict(input);
    };
}

const clearCanvas = ()=>{
    context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
}

tf.loadLayersModel('./model/model.json')
    .then(function (model) {
        window.model = model;
        console.log(model);
    });

// Predict function
var predict = function (input) {
    if (window.model) {
        window.model.predict([tf.tensor(input)
            .reshape([1, 48, 48, 1])])
            .array().then(function (scores) {
                scores = scores[0];
                console.log(scores);
                predicted = scores
                    .indexOf(Math.max(...scores));
                $('#result').html(hiragana[predicted]);
            });  
    } else {
  
        // The model takes a bit to load, 
        // if we are too fast, wait
        setTimeout(function () { predict(input) }, 50);
    }
}