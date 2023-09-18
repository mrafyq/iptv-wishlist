var popupCheckPinWishlist = document.querySelector('.popup-check-pin-favoris');
var popupCheckPinWishlistForm = document.querySelector('.popup-check-pin-favoris form');

popupCheckPinWishlistForm.addEventListener('submit', function (e) {
    console.log('submit from pin wishlist!')
    e.preventDefault();
    let popupPinInput = document.querySelector('.popup-check-pin-favoris #pin-field-favoris');
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                let favorisSelected = document.querySelector('.list-favoris .favoris.selected');
                let favorisId = favorisSelected.getAttribute('data-id')
                const result = data.favoris.filter(favoris => favoris.favori_id == favorisId);
                if (parseInt(favorisSelected.getAttribute('data-pin'))) {
                    result[0].pin = 0
                    favorisSelected.setAttribute('data-pin', 0)
                    favorisSelected.querySelector('.icon-lock').remove()
                } else {
                    result[0].pin = 1
                    const iconLock = document.createElement('i');
                    iconLock.setAttribute('class', 'icon-lock');
                    favorisSelected.setAttribute('data-pin', 1)
                    favorisSelected.appendChild(iconLock);
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

