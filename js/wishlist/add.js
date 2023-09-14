let popupWishlistForm = document.querySelector('.popup-add-wishlist form');
let inputAdd = document.querySelector('.popup.popup-add-wishlist #add');

popupWishlistForm.addEventListener('submit', (e) => {
    e.preventDefault()
    read().then(data => {
        if (data) {
            const ids = data.favoris.map(favoris => favoris.favori_id);
            const sorted = ids.sort((a, b) => a - b);
            let nextId = sorted[sorted.length - 1] + 1;
            data.favoris.push({
                "favori_id": nextId,
                "favori_name": inputAdd.value,
                "order": data.favoris.length,
                "pin": 0,
                "channels": []
            })
            if (popupAction === true) {
                // create element without fetch
                const li = document.createElement('li');
                li.setAttribute('id', nextId);
                li.setAttribute('data-name', inputAdd.value);
                li.setAttribute('data-pin', 0);
                li.setAttribute('class', 'favoris');
                li.style.order = data.favoris.length;
                li.innerHTML = inputAdd.value;
                listFav.appendChild(li);
                document.querySelector('.list-favoris .favoris.selected').classList.remove('selected')
                li.classList.add('selected')
                save(data);
            }
        }
    })
})
