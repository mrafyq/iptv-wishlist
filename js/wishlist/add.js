var buttonAddWishlist = document.querySelector('.action-add');
var form = document.getElementById('add-wishlist-form');
var inputAdd = document.querySelector('.popup #add');
var popupWishlist = document.querySelector('.popup.popup-add-wishlist');

buttonAddWishlist.addEventListener('click', () => {
    popupAction = true;
    popupWishlist.classList.add('active');
})

form.addEventListener('submit', (event) => {
    event.preventDefault()
    fetch('data/db.json')
        .then(res => res.json())
        .then(data => {
            const ids = data.favoris.map(favoris => favoris.favori_id);
            const sorted = ids.sort((a, b) => a - b);
            let nextId = sorted[sorted.length - 1] + 1;
            data.favoris.push({
                "favori_id": nextId,
                "favori_name": inputAdd.value,
                "order": data.favoris.length,
                "channels": []
            });
            console.log(data.favoris);
        })
        .catch(err => console.log(err));
})