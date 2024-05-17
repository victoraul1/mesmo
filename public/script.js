const socket = io();

function saveChanges() {
    const data = {
        banner: document.getElementById('banner').value,
        copy: document.getElementById('copy').value,
        copy1: document.getElementById('copy1').value,
        desc1: document.getElementById('desc1').value,
        copy2: document.getElementById('copy2').value,
        desc2: document.getElementById('desc2').value,
        copy3: document.getElementById('copy3').value,
        desc3: document.getElementById('desc3').value,
        copy4: document.getElementById('copy4').value,
        desc4: document.getElementById('desc4').value,
        copy5: document.getElementById('copy5').value,
        desc5: document.getElementById('desc5').value,
        copy6: document.getElementById('copy6').value,
        desc6: document.getElementById('desc6').value,
    };
    socket.emit('updateContent', data);
}

socket.on('contentUpdated', (data) => {
    document.querySelector('.banner').src = data.banner;
    document.getElementById('copy').innerText = data.copy;
    document.querySelector('.grid-item:nth-child(1) img').src = data.copy1;
    document.querySelector('.grid-item:nth-child(1) p').innerText = data.desc1;
    document.querySelector('.grid-item:nth-child(2) img').src = data.copy2;
    document.querySelector('.grid-item:nth-child(2) p').innerText = data.desc2;
    document.querySelector('.grid-item:nth-child(3) img').src = data.copy3;
    document.querySelector('.grid-item:nth-child(3) p').innerText = data.desc3;
    document.querySelector('.grid-item:nth-child(4) img').src = data.copy4;
    document.querySelector('.grid-item:nth-child(4) p').innerText = data.desc4;
    document.querySelector('.grid-item:nth-child(5) img').src = data.copy5;
    document.querySelector('.grid-item:nth-child(5) p').innerText = data.desc5;
    document.querySelector('.grid-item:nth-child(6) img').src = data.copy6;
    document.querySelector('.grid-item:nth-child(6) p').innerText = data.desc6;
});
