import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";

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

import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL }
    from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js"


// Variables and references
let files = [];
let reader = new FileReader();
let profileimg = document.getElementById('profileImg');
let proglab = document.getElementById('upprogress');
let SelBtn = document.getElementById('selbtn');
let UpBtn = document.getElementById('upbtn');
let input = document.createElement('input');
let signOutBtn = document.getElementById('signOutBtn');
let searchName = document.getElementById('searchName');
let ImgName;
const ul = document.getElementById('searchResult');

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
    await fetch('/account/userID')
        .then(res => res.json())
        .then(data => ImgName = data.userID)
        .catch((error) => {
            console.log(error);
        });
    console.log(ImgName);
    const metaData = {
        contentType: ImgToUpload.type
    }

    const storage = getStorage();

    const storageRef = sRef(storage, 'Images/' + ImgName);

    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

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
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ URL: URL })
    }
    fetch('/account/img', options).then((response) => {
        localStorage.setItem('img', URL);
    }).catch((error) => {
        console.log(error);
    })
}

function GetURLfromDB() {
    UpBtn.style.display = 'none';
    const img = localStorage.getItem('img');
    if (img) {
        profileimg.src = img;
        return
    }
    console.log('fetch is called');
    fetch('/account/img').then(response => response.json()).then(data => {
        if (data.url) {
            SelBtn.innerHTML = 'Change profile picture';
            profileimg.src = data.url;
            localStorage.setItem('img', data.url);
        }
    }).catch((error) => {
        console.log(error);
    });
}


function searchNameInDB() {
    let name = document.getElementById('username').value;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    }
    fetch('/account/searchName', options).then(response => response.json()).then(data => {
        const users = data.users;
        // console.log(users);
        if (users.length > 0) {
            users.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = user.username;
                const btn = document.createElement('button');
                btn.innerHTML = 'chat';
                btn.addEventListener('click', () => {
                    chatWith(user.id);
                })
                li.appendChild(btn);
                ul.appendChild(li);
            });
        } else {
            console.log('User not found!');
        }
    }).catch((error) => {
        console.log(error);
    });
}


async function chatWith(id){
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user2ID: id })
    }
    const roomID = await fetch('/room', options).then(response => response.json());
    console.log(roomID);
    socket.on('connection', (roomSocket)=>{
        roomSocket.join(roomID._id);
    })
}



function signOut() {
    localStorage.removeItem('img');
    location.href = '/account/signOut';
}

UpBtn.onclick = UploadProcess;
window.onload = GetURLfromDB;
searchName.onclick = searchNameInDB;
signOutBtn.onclick = signOut;