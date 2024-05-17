const socket = io();

socket.on('pageUpdate', data => {
    document.getElementById('bannerImg').src = data.bannerImg;
    document.getElementById('video').querySelector('source').src = data.videoSrc;
    document.getElementById('placeholderText').innerText = data.placeholderText;
    document.getElementById('copyImg1').src = data.copyImg1;
    document.getElementById('copyImg2').src = data.copyImg2;
    document.getElementById('copyImg3').src = data.copyImg3;
    document.getElementById('video').load();
});

fetch('/get-page-content')
    .then(response => response.json())
    .then(data => {
        document.getElementById('bannerImg').src = data.bannerImg;
        document.getElementById('video').querySelector('source').src = data.videoSrc;
        document.getElementById('placeholderText').innerText = data.placeholderText;
        document.getElementById('copyImg1').src = data.copyImg1;
        document.getElementById('copyImg2').src = data.copyImg2;
        document.getElementById('copyImg3').src = data.copyImg3;
        document.getElementById('video').load();
    });
