const socket = io();

const quill = new Quill('#editor', {
    theme: 'snow'
});

socket.on('contentUpdate', (data) => {
    quill.clipboard.dangerouslyPasteHTML(data.content);
});

document.getElementById('save-button').addEventListener('click', () => {
    let content = quill.root.innerHTML;
    content = formatContent(content);
    socket.emit('save', { content: content });
});

function formatContent(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const items = tempDiv.querySelectorAll('p');

    items.forEach(item => {
        const priceMatch = item.textContent.match(/(S\/\.\d+(\.\d{2})?)/g);
        if (priceMatch) {
            priceMatch.forEach(price => {
                const priceSpan = `<span class="price">${price}</span>`;
                item.innerHTML = item.innerHTML.replace(price, priceSpan);
            });
            item.classList.add('menu-item');
        } else {
            item.classList.add('menu-item');
        }

        // Check for categories (in bold)
        if (item.innerText === item.innerHTML.toUpperCase() && !item.querySelector('.price')) {
            item.style.fontWeight = 'bold';
            item.style.marginTop = '1em';
            item.style.marginBottom = '0.5em';
        }
    });

    return tempDiv.innerHTML;
}
