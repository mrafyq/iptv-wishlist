var popupDeleteForm = document.querySelector('.popup-delete form');
var popupDelete = document.querySelector('.popup-delete');

popupDeleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let favList = document.querySelectorAll('.list-favoris .favoris');
    let favDeleteSelected = document.querySelector('.list-favoris .favoris.selected');
    let favDeleteID = favDeleteSelected.getAttribute('data-id');
    read().then(data => {
        if (data) {
            let favoris = data.favoris.filter(item => item.favori_id != favDeleteID);
            data.favoris = favoris;
            favList[0].classList.add('selected');
            favDeleteSelected.remove();
            save(data)
            adaptPopup(popupDelete);
        }
    })
})
