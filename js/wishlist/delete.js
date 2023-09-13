var popupDelete = document.querySelector('.popup-delete');

popupDelete.addEventListener('submit', (e) => {
    e.preventDefault();
    let favList = document.querySelectorAll('.list-favoris .favoris');
    let favDeleteSelected = document.querySelector('.list-favoris .favoris.selected');
    let favDeleteID = favDeleteSelected.getAttribute('id');
    fetch('data/db.json')
        .then(res => res.json())
        .then(data =>
            {
                let favoris = data.favoris.filter(item => item.favori_id != favDeleteID);
                data.favoris = favoris;
                favList[0].classList.add('selected');
                favDeleteSelected.remove();
                console.log(data.favoris);
            }
        )
        .catch(err => console.log(err));
})
