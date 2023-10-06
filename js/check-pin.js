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
                showChannels();
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

///////////////////////////////////////////////////////
/// BUCKETS/WISHLISTS : CHECK PIN ACCESS /// END
///////////////////////////////////////////////////////

////////////////////////////////////////////////////
/// SHOW CHANNELS AFTER CHECK PIN /// START
////////////////////////////////////////////////////

function showChannels() {
    (parsedChannels).forEach((element, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-attr-id', element.channel_id);
        li.setAttribute('data-attr-name', element.channel_name);
        li.setAttribute('data-attr-order', element.channel_order);
        li.style.order = element.channel_order
        if (index == 0) {
            li.setAttribute('class', 'channel selected');
        } else {
            li.setAttribute('class', 'channel');
        }
        li.innerHTML = element.channel_name;
        listChannels.appendChild(li);
    });
    hideSidebar()
}


function hideSidebar() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('right-buttons').style.display = 'flex';
    list_selected = 'channels';
    currentList = channels;
}

////////////////////////////////////////////////////
/// SHOW CHANNELS AFTER CHECK PIN /// END
////////////////////////////////////////////////////