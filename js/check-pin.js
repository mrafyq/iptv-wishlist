///////////////////////////////////////////////////////
/// BUCKETS/WISHLISTS : CHECK PIN ACCESS /// START
///////////////////////////////////////////////////////

popupPinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                if (list_selected === 'buckets') {
                    let bucketId = document.querySelector('.bucket.selected').getAttribute('data-id')
                    let result = data.buckets.filter(bucket => bucket.bucket_id == bucketId);
                    parsedChannels = result[0].channels
                } else if (list_selected === 'wishlists') {
                    let wishlistId = document.querySelector('.wishlist.selected').getAttribute('data-id')
                    let result = data.wishlists.filter(wishlist => wishlist.wishlist_id == wishlistId);
                    parsedChannels = result[0].channels
                }
                fetchChannels(parsedChannels, true);
            } else {
                popupError = true;
            }
            popupPinInput.value = "";
            adaptPopupCheckPin(popupPin);
        }
    })
})

function adaptPopupCheckPin(popupActive) {
    if (popupCheckPin === true) {
        if (popupError === true) {
            popupActive.classList.add('error');
        } else {
            popupActive.classList.remove('error');
            popupActive.classList.remove('active');
            popupCheckPin = false;
            popupAction = false;
        }
    }
    popupError = false;
}
