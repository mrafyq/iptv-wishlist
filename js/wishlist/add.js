var buttonAddWishlist = document.querySelector('.action-add');
var form = document.getElementById('add-wishlist-form');
var buttonAddWishlistCancel = document.querySelector('.action-add-wishlist-cancel');
var inputAdd = document.querySelector('.popup #add');
var popupWishlist = document.querySelector('.popup.popup-add-wishlist');

buttonAddWishlist.addEventListener('click', () => {
    popupWishlist.style.display = 'flex';
})

form.addEventListener('submit', (event) => {
    event.preventDefault()
    fetch('data/db.json')
        .then(res => res.json())
        .then(data => {
            data.favoris.push({
                "favoris_id": 100, // TODO manage dynamic wishlist Ids
                "favoris_name": inputAdd.value,
                "order": data.favoris.length,
                "channels": []
            });
            console.log(data.favoris);
        })
        .catch(err => console.log(err));
})

buttonAddWishlistCancel.addEventListener('click', () => {
    popupWishlist.style.display = 'none';
})