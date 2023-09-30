var popupRename = document.querySelector('.popup-rename');
var popupRenameForm = document.querySelector('.popup-rename form');
var inputRename = document.querySelector('.popup-rename #rename');

popupRenameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(inputRename.value)
    let wishlistSelected = document.querySelector('.list-wishlist .wishlist.selected');
    let wishlistId = wishlistSelected.getAttribute('data-id')
    read().then(data => {
        if (data && popupAction === true) {
            (data.wishlists).forEach((element) => {
                if (element.wishlist_id == wishlistId) {
                    wishlistSelected.textContent = inputRename.value;
                    wishlistSelected.setAttribute('data-name', inputRename.value);
                    element.wishlist_name = inputRename.value;
                    if (parseInt(wishlistSelected.getAttribute('data-pin'))) {

                        const iconLock = document.createElement('i');
                        iconLock.setAttribute('class', 'icon-lock');
                        wishlistSelected.appendChild(iconLock)
                    }
                }
            });
            save(data)
            adaptPopup(popupRename);
        }
    })
})
