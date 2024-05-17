const socket = io();

// Para la página principal (index.html)
if (window.location.pathname === '/') {
    socket.on('content updated', (data) => {
        document.getElementById('copy-text').innerText = data.copyText;
        document.querySelector('img[alt="Banner"]').src = data.bannerUrl;
        document.querySelector('video').src = data.videoUrl;
        document.querySelector('img[alt="Copy 1"]').src = data.copy1Url;
        document.querySelector('img[alt="Copy 2"]').src = data.copy2Url;
        document.querySelector('img[alt="Copy 3"]').src = data.copy3Url;
    });
}

// Para la página de administración (admin.html)
if (window.location.pathname === '/admin') {
    document.getElementById('save-btn').addEventListener('click', () => {
        const data = {
            bannerUrl: document.getElementById('banner-url').value,
            videoUrl: document.getElementById('video-url').value,
            copyText: document.getElementById('copy-text').value,
            copy1Url: document.getElementById('copy1-url').value,
            copy2Url: document.getElementById('copy2-url').value,
            copy3Url: document.getElementById('copy3-url').value
        };
        socket.emit('update content', data);
    });
}
