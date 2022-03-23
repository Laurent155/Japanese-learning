const modelHiragana = ["あ",
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

let paintCanvas2 = document.getElementById( 'tempCanvas' );
let context2 = paintCanvas2.getContext( '2d' );

let x = 0, y = 0;
let isMouseDown = false;

let stopDrawing = () => {}
let startDrawing = event => {}
let drawLine = event => {}
let processImage = ()=>{}
let clearCanvas = ()=>{}

function resetCanvas() {
    paintCanvas = document.getElementById( 'myCanvas' );
    context = paintCanvas.getContext( '2d' );
    context.lineCap = 'round';
    context.lineWidth = 5;

    stopDrawing = () => { isMouseDown = false; }
    startDrawing = event => {
        isMouseDown = true;   
    [x, y] = [event.offsetX, event.offsetY];  
    }
    drawLine = event => {
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

    processImage = ()=>{
        // $('#number').html('<img id="spinner" src="spinner.gif"/>');
        // canvas.removeEventListener('mousemove', onPaint, false);
        isMouseDown = false;
        var img = new Image();
        img.src = paintCanvas.toDataURL('image/png');
        img.onload = function () {
            context2.drawImage(img, 0, 0, 48, 48);
            data = context2.getImageData(0, 0, 48, 48).data;
            context2.clearRect(0, 0, 48, 48);
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

    clearCanvas = ()=>{
        context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    }
}

tf.loadLayersModel('./model/model.json')
    .then(function (model) {
        window.model = model;
        console.log(model);
    });

// Predict function
let predicted = 0;

var predict = function (input) {
    if (window.model) {
        window.model.predict([tf.tensor(input)
            .reshape([1, 48, 48, 1])])
            .array().then(function (scores) {
                scores = scores[0];
                console.log(scores);
                if(Math.max(...scores) > 0.90){
                    predicted = scores
                    .indexOf(Math.max(...scores));
                $('#drawnDisplay').html("Recognized: " + modelHiragana[predicted]);
                }else{
                    $('#drawnDisplay').html("Recognized (unclear): " + modelHiragana[predicted]);
                }
                checkWritingAnswer(modelHiragana[predicted]);
            });  
    } else {
  
        // The model takes a bit to load, 
        // if we are too fast, wait
        setTimeout(function () { predict(input) }, 50);
    }
}

function checkWritingAnswer(answer) {
    if(currentProblem.character == answer) {
        document.getElementById("answerDisplay").style.color = "green";
		if(initialRun == true) {initialCorrect++;}
    } else {
        document.getElementById("answerDisplay").style.color = "red";
        wrongAnswers.push(currentProblem);
    }
    document.getElementById("answerDisplay").innerHTML = "Answer: " + currentProblem.character;
    document.getElementById("inputField").innerHTML = '<p>Press space to continue</p>';
	answered = true;
}