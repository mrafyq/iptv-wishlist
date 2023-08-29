var hideBucketBtn = document.querySelector('.bucket-action-hide');

hideBucketBtn.addEventListener('click', HideBucket)

function HideBucket() {
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
                        let bucketSelected = document.querySelector('.list-bouquet .bouquet.selected');
                        let bouquetId = bucketSelected.getAttribute('id')
                        const result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                        if (result[0].hidden) {
                            result[0].hidden = 0
                        } else {
                            result[0].hidden = 1
                        }
                        console.log(data.bouquets)
                        bucketSelected.remove()
                        popupPin.style.display = 'none'
                        PINField.value = "";
                    }
                }
            )
            .catch(err => console.log(err));
    })
}

