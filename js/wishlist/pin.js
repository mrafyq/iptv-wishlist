var PinWishlistBtn = document.querySelector('.action-pin');

PinWishlistBtn.addEventListener('click', PINWishlist)

function PINWishlist() {
    let PINField = document.querySelector('#pin-field')
    popupPin.style.display = 'flex'
    PINField.focus()
    let confirmPin = document.querySelector('.action-pin-ok')
    confirmPin.addEventListener('click', function (event) {
        read().then(data => {
            if (data) {
                if (PINField.value === data.pin) {
                    let favorisSelected = document.querySelector('.list-favoris .favoris.selected');
                    let favorisId = favorisSelected.getAttribute('id')
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

                    popupPin.style.display = 'none'
                    PINField.value = "";
                }
            }
        })
    })
}

