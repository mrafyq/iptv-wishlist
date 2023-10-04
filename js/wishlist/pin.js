const popupCheckPinWishlist = document.querySelector('.popup-check-pin-wishlist');
const popupCheckPinWishlistForm = document.querySelector('.popup-check-pin-wishlist form');

popupCheckPinWishlistForm.addEventListener('submit', function (e) {
    console.log('submit from pin wishlist!')
    e.preventDefault();
    let popupPinInput = document.querySelector('.popup-check-pin-wishlist #pin-field-wishlist');
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                let wishlistSelected = document.querySelector('.list-wishlist .wishlist.selected');
                let wishlistId = wishlistSelected.getAttribute('data-id')
                const result = data.wishlists.filter(wishlist => wishlist.wishlist_id == wishlistId);
                if (parseInt(wishlistSelected.getAttribute('data-pin'))) {
                    result[0].pin = 0
                    wishlistSelected.setAttribute('data-pin', 0)
                    wishlistSelected.querySelector('.icon-lock').remove()
                } else {
                    result[0].pin = 1
                    const iconLock = document.createElement('i');
                    iconLock.setAttribute('class', 'icon-lock');
                    wishlistSelected.setAttribute('data-pin', 1)
                    wishlistSelected.appendChild(iconLock);
                }
                save(data)
            } else {
                popupError = true
            }
            popupPinInput.value = "";
            adaptPopup(popupCheckPinWishlist);
        }
    })
});

