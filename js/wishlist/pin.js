var PinWishlistBtn = document.querySelector('.action-pin');

PinWishlistBtn.addEventListener('click', PINWishlist)

function PINWishlist() {
    let PINField = document.querySelector('#pin-field')
    popupPin.style.display = 'flex'
    PINField.focus()
    let confirmPin = document.querySelector('.action-pin-ok')
    confirmPin.addEventListener('click', function (event) {
        fetch('data/db.json')
            .then(res => res.json())
            .then(data =>
                {
                    if (PINField.value === data.pin) {
                        let favorisSelected = document.querySelector('.list-favoris .favoris.selected');
                        let favorisId = favorisSelected.getAttribute('id')
                        const result = data.favoris.filter(favoris => favoris.favori_id == favorisId);
                        if (result[0].pin) {
                            result[0].pin = 0
                            favorisSelected.querySelector('.icon-lock').remove()
                        } else {
                            result[0].pin = 1
                            const iconLock = document.createElement('i');
                            iconLock.setAttribute('class', 'icon-lock');
                            favorisSelected.appendChild(iconLock);
                        }
                        console.log(data.favoris)

                        popupPin.style.display = 'none'
                        PINField.value = "";
                    }
                }
            )
            .catch(err => console.log(err));
    })
}

