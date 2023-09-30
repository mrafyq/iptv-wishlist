var popupDeleteForm = document.querySelector('.popup-delete form');
var popupDelete = document.querySelector('.popup-delete');

popupDeleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let favList = document.querySelectorAll('.list-wishlist .wishlist');
    let favDeleteSelected = document.querySelector('.list-wishlist .wishlist.selected');
    let favDeleteID = favDeleteSelected.getAttribute('data-id');
    read().then(data => {
        if (data) {
            let wishlist = data.wishlists.filter(item => item.wishlist_id != favDeleteID);
            data.wishlists = wishlist;
            favList[0].classList.add('selected');
            favDeleteSelected.remove();
            save(data)
            adaptPopup(popupDelete);
        }
    })
})
