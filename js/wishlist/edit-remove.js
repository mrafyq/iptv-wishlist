var choices = document.querySelectorAll('input[name=action]');
var formRename = document.querySelector('.container-action-rename');
var formDelete = document.querySelector('.container-action-delete');

choices.forEach(choice => {
    choice.addEventListener('change', function (event) {
        if (event.target.value === 'delete') {
            formRename.style.display = 'none'
            formDelete.style.display = 'block'
        } else {
            formDelete.style.display = 'none'
            formRename.style.display = 'block'
        }
    })
})

// RENAME ACTION
var buttonRenameFavoris = document.querySelector('.action-rename');
var buttonRenameCancel = document.querySelector('.action-cancel');
var popupRename = document.querySelector('.popup.popup-rename');
var buttonRenameSave = document.querySelector('.action-rename-save');
var inputRename = document.querySelector('.popup #rename');

// TITLE
var popupTitles = document.querySelectorAll('.popup-title-additional');
console.log(popupTitles)

buttonRenameFavoris.addEventListener('click', (event) => {
    var favorisSelected = document.querySelector('.list-favoris .favoris.selected');
    inputRename.value = favorisSelected.textContent
    popupRename.style.display = 'flex';
    popupTitles.forEach(title => {
        title.innerText = favorisSelected.textContent
    })
})

buttonRenameCancel.addEventListener('click', (event) => {
    popupRename.style.display = 'none';
})

buttonRenameSave.addEventListener('click', (event) => {
    console.log(inputRename.value)
    var favorisSelected = document.querySelector('.list-favoris .favoris.selected');
    let favorisId = favorisSelected.getAttribute('id')

    fetch('data/db.json')
        .then(res => res.json())
        .then(data =>
            {
                (data.favoris).forEach((element) => {
                    if (element.favori_id == favorisId) {
                        element.favori_name = inputRename.value
                    }
                });

                console.log(data.favoris);
            }
        )
        .catch(err => console.log(err));
})

// DELETE ACTION

var buttonDeleteConfirm = document.querySelector('.action-delete-confirm');

buttonDeleteConfirm.addEventListener('click', (event) => {
    var favorisSelected = document.querySelector('.list-favoris .favoris.selected');
    let favorisId = favorisSelected.getAttribute('id')

    fetch('data/db.json')
        .then(res => res.json())
        .then(data =>
            {
                let favoris = data.favoris.filter(item => item.favori_id != favorisId)
                data.favoris = favoris
                console.log(data.favoris);
            }
        )
        .catch(err => console.log(err));
})
