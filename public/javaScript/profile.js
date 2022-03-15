import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyB8Me95Fgcft4s0BlLoRiftYTv9o80jjMc",
    authDomain: "japanese-learning-193b9.firebaseapp.com",
    projectId: "japanese-learning-193b9",
    storageBucket: "japanese-learning-193b9.appspot.com",
    messagingSenderId: "1057976094331",
    appId: "1:1057976094331:web:c7ed6581710ad4ec191cde",
    measurementId: "G-NVLEFXQFNF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getDatabase, ref, set, child, get, update, remove }
    from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js"

import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL }
    from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js"


// Variables and references
const realdb = getDatabase();
let files = [];
let reader = new FileReader();
let profileimg = document.getElementById('profileimg');
let proglab = document.getElementById('upprogress');
let SelBtn = document.getElementById('selbtn');
let UpBtn = document.getElementById('upbtn');

let input = document.createElement('input');
input.type = 'file';

input.onchange = e => {
    files = e.target.files;

    reader.readAsDataURL(files[0]);
}

reader.onload = function () {
    profileimg.src = reader.result;
    UpBtn.style.display = 'block';
}

SelBtn.onclick = function () {
    input.click();
}

// upload process

async function UploadProcess() {

    let ImgToUpload = files[0];
    let ImgName = '<%= userID %>';

    const metaData = {
        contentType: ImgToUpload.type
    }

    const storage = getStorage();

    const storageRef = sRef(storage, 'Images/' + ImgName);

    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

    console.log(UploadTask);

    UploadTask.on('state-changed', (snapshot) => {
        // let progress = (snapshot.bytestTransferred / snapshot.totalBytes) * 100;
        // proglab.innerHTML = 'Upload' + progress + '%';
    },
        (error) => {
            console.log(error);
            alert('Error: image not uploaded');
        },
        () => {
            getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                SaveURLtoDB(downloadURL);
                UpBtn.style.display = 'none';
            });
        });

}


// Functions for real time database

function SaveURLtoDB(URL) {
    console.log(JSON.stringify(URL));
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ URL: URL })
    }
    fetch('/account/img', options).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    })
}

function GetURLfromDB() {
    UpBtn.style.display = 'none';
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch('/account/img').then(response => response.json()).then(data => {
        if (data.url) {
            SelBtn.innerHTML = 'Change profile picture';
            profileimg.src = data.url;
        }
    }).catch((error) => {
        console.log(error);
    });
}

UpBtn.onclick = UploadProcess;
window.onload = GetURLfromDB;
// window.onload = function () {
// 	GetURLfromDB;
// };