const socket = io();

socket.on('contentUpdate', (data) => {
    document.getElementById('banner').src = data.banner;
    document.getElementById('video').src = data.video;
    document.getElementById('copy1').src = data.copy1;
    document.getElementById('copy2').src = data.copy2;
    document.getElementById('copy3').src = data.copy3;
    document.getElementById('description1').innerText = data.description1;
    document.getElementById('description2').innerText = data.description2;
    document.getElementById('description3').innerText = data.description3;
});
