var popupPin = document.querySelector('.popup-check-pin');

function PINWishlist() {
    let PINField = document.querySelector('#pin-field');
    popupAction = true;
    popupPin.classList.add('active');
    PINField.focus()
    let popupPinForm = document.querySelector('.popup-check-pin form')
    popupPinForm.addEventListener('submit', function (e) {
        e.preventDefault();
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

                    popupAction = false;
                    popupPin.classList.remove('active');
                    PINField.value = "";
                }
            }
        })
    })
}

