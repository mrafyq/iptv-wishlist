var popupDeleteForm = document.querySelector('.popup-delete form');
var popupDelete = document.querySelector('.popup-delete');

popupDeleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let wishlistToDelete = document.querySelector('.list-wishlist .wishlist.selected');
    let wishlistToDeleteId = wishlistToDelete.getAttribute('data-id');
    read().then(data => {
        if (data) {
            data.wishlists = data.wishlists.filter(item => item.wishlist_id != wishlistToDeleteId);
            wishlistToDelete.remove();
            let order = 1
            data.wishlists.forEach(wishlist => {
                wishlist.order = order
                order++
            })
            fetchWishlists(data.wishlists)
            wishlist[0].classList.add('selected');
            save(data)
            adaptPopup(popupDelete);
        }
    })
})
