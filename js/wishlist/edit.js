var popupRenameForm = document.querySelector('.popup-rename form');
var inputRename = document.querySelector('.popup-rename #rename');

popupRenameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(inputRename.value)
    let favorisSelected = document.querySelector('.list-favoris .favoris.selected');
    let favorisId = favorisSelected.getAttribute('id')
    read().then(data => {
        if (data && popupAction === true) {
            (data.favoris).forEach((element) => {
                if (element.favori_id == favorisId) {
                    favorisSelected.textContent = inputRename.value;
                    favorisSelected.setAttribute('data-name', inputRename.value);
                    element.favori_name = inputRename.value;
                    if (parseInt(favorisSelected.getAttribute('data-pin'))) {

                        const iconLock = document.createElement('i');
                        iconLock.setAttribute('class', 'icon-lock');
                        favorisSelected.appendChild(iconLock)
                    }
                }
            });
            save(data)
        }
    })
})
