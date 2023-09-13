var popupRename = document.querySelector('.popup-rename');
var inputRename = document.querySelector('.popup-rename #rename');

popupRename.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(inputRename.value)
    let favorisSelected = document.querySelector('.list-favoris .favoris.selected');
    let favorisId = favorisSelected.getAttribute('id')

    fetch('data/db.json')
        .then(res => res.json())
        .then(data =>
            {
                (data.favoris).forEach((element) => {
                    if (element.favori_id == favorisId) {
                        favorisSelected.textContent = inputRename.value;
                        element.favori_name = inputRename.value;
                    }
                });

                console.log(data.favoris);
            }
        )
        .catch(err => console.log(err));
})
