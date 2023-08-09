var buttonAddFav = document.querySelector('.action-add');
var buttonAddFavSave = document.querySelector('.action-add-favoris-save');
var buttonAddFavCancel = document.querySelector('.action-add-favoris-cancel');
var inputAdd = document.querySelector('.popup #add');
var popupFav = document.querySelector('.popup.popup-add-wishlist');

buttonAddFav.addEventListener('click', () => {
    popupFav.style.display = 'flex';
})

buttonAddFavSave.addEventListener('click', () => {
    fetch('data/db.json')
        .then(res => res.json())
        .then(data => {
            data.favoris.push({
                "favoris_id": 100,
                "favoris_name": inputAdd.value,
                "order": data.favoris.length,
                "channels": []
            });
            console.log(data.favoris);
        })
        .catch(err => console.log(err));
})

buttonAddFavCancel.addEventListener('click', () => {
    popupFav.style.display = 'none';
})