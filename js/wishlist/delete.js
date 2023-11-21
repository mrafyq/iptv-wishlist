const popupDeleteForm = document.querySelector('.popup-delete form');
const popupDelete = document.querySelector('.popup-delete');
const wishlistDeleteButton = document.querySelector('.action-delete')

wishlistDeleteButton.addEventListener('click', function () {
    popupAction = true;
    let popupFavDelete = document.querySelector('.popup-delete');
    popupFavDelete.classList.add('active');
    let favSelectedName = document.querySelector('.list-wishlist .wishlist.selected');
    let popupTitles = document.querySelector('.popup-delete .popup__title strong');
    popupTitles.innerText = favSelectedName.textContent;
})

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
