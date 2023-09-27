var listSelected = 'tabs';
var tabs = document.getElementsByClassName('tab');
var bouquets = document.getElementsByClassName('bouquet');
var favoris = document.getElementsByClassName('favoris');
var channels = document.getElementsByClassName('channel');
var groupName = document.querySelector('.group-name');
var tab_btns;
var sortAscDesc = 0;
var sortBy = document.querySelector('.sortBy');

var popupAction = false;

var parsedChannels = [];

var popupError = false;
var popupCheckPin = false;

var moveWishlistAction = false;
var moveChannelAction = false;


var popupCloseBtn = document.querySelectorAll('.popup .btn-cancel');
popupCloseBtn.forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const getPopup = el.getAttribute('data-popup');
        const popup = document.querySelector('.popup.' + getPopup);
        popup.classList.remove('active');
        popupAction = false;
    });
});

///////////////////////////////////////////////////////
/// BUCKETS/WISHLISTS : CHECK PIN ACCESS /// START
///////////////////////////////////////////////////////
var popupPin = document.querySelector('.popup-check-pin-access');
var popupPinForm = document.querySelector('.popup-check-pin-access form');
var popupPinInput = document.querySelector('.popup-check-pin-access #pin-field');

popupPinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                if (listSelected === 'bouquets') {
                    let bucketId = document.querySelector('.bouquet.selected').getAttribute('data-id')
                    console.log(bucketId)
                    let result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bucketId);
                    parsedChannels = result[0].channels

                } else if (listSelected === 'favoris') {
                    let favoriId = document.querySelector('.favoris.selected').getAttribute('data-id')
                    let result = data.favoris.filter(favori => favori.favori_id == favoriId);
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
    console.log("fn adaptPopupCheckPin")
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

function adaptPopup(popupActive) {
    console.log("fn adaptPopup")
    if (popupError === true) {
        popupActive.classList.add('error');
    } else {
        popupActive.classList.remove('error');
        popupActive.classList.add('confirmed');
        setTimeout(() => {
            popupActive.classList.remove('confirmed');
            popupActive.classList.remove('active');
        }, 2000);
        popupAction = false;
    }
    popupError = false;
}


//////////////////////////////////////////////
/// CHANNELS : ADD TO WISHLIST /// START
//////////////////////////////////////////////
var popupFav = document.querySelector('.popup.popup-favoris');
var popupFavForm = document.querySelector('.popup.popup-favoris form');
popupFavForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const listChanSelected = document.querySelector('#list-channels .channel.selected');
    const listChanSelectedID = listChanSelected.getAttribute('data-attr-id');
    const listChanSelectedName = listChanSelected.getAttribute('data-attr-name');
    const checkedFav = document.querySelectorAll('.popup-favoris-list-fav li input:checked');

    var favArr = [];
    checkedFav.forEach(el => {
        favArr.push(parseInt(el.value));
        console.log(el.value);
    })

    read().then(data => {
        if (data) {
            (data.favoris).forEach((element, index) => {
                if (favArr.indexOf(element.favori_id) !== -1) {
                    console.log(element);
                    element.channels.push({
                        "channel_id": parseInt(listChanSelectedID),
                        "channel_name": listChanSelectedName,
                        "channel_order": element.channels.length + 1
                    });
                }
            });
            save(data);
            popupFav.classList.remove('error');
            popupFav.classList.add('confirmed');
            setTimeout(() => {
                popupFav.classList.remove('confirmed');
                popupFav.classList.remove('active');
            }, 2000);
            popupAction = false;

            listSelected = 'channels';
            document.querySelector('#list-channels .channel.selected').classList.remove('active');
            // tab_btns = channels
        }
    })
})
//////////////////////////////////////////////
/// CHANNELS : ADD TO WISHLIST /// END
//////////////////////////////////////////////

document.addEventListener('keyup', function (e) {

    var key = e.key;
    console.log("key = " + key);

    var listChannels = document.getElementById('list-channels');
    // console.log(listChannels);

    if (listSelected === 'tabs') {
        tab_btns = tabs;
    } else if (listSelected === 'bouquets') {
        tab_btns = bouquets;
    } else if (listSelected === 'favoris') {
        tab_btns = favoris;
    } else if (listSelected === 'channels') {
        tab_btns = channels;
    } else if (listSelected === 'checkboxes-channels') {
        tab_btns = document.getElementsByClassName('checkbox-favoris');
    }

    var current_index;
    for (var i = 0; i < tab_btns.length; i++) {
        if (tab_btns[i].classList.contains('selected')) {
            current_index = i;
        }
    }

    console.log('current index = ' + current_index)

    switch (key) {
        case ' ':
            if (listSelected === 'checkboxes-channels') {
                let checkbox = tab_btns[current_index].querySelector('input');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            }
            break;
        case 'Enter':
            if (popupAction === true) {
                var popupSubmitBtn = document.querySelector('.popup.active form button[type="submit"]');
                popupSubmitBtn.click();
            } else if (moveChannelAction === true) {
                saveMoveChannel(tab_btns[current_index])
                moveChannelAction = false
                current_index = 0
            } else if (moveWishlistAction === true) {
                saveMoveWishlist()
                moveWishlistAction = false
                current_index = 0
            } else {
                if (listSelected === 'tabs') {
                    if (tab_btns[current_index].getAttribute('data-list') === 'list-favoris') {
                        listSelected = 'favoris';
                        tab_btns[current_index].classList.remove('selected');
                        tab_btns[current_index].classList.add('active');
                        tab_btns = favoris;
                        document.getElementById('wishlist-buttons').style.display = 'flex';
                        document.getElementById('buckets-buttons').style.display = 'none';
                    } else {
                        listSelected = 'bouquets';
                        tab_btns[current_index].classList.remove('selected');
                        tab_btns[current_index].classList.add('active');
                        tab_btns = bouquets;
                        document.getElementById('buckets-buttons').style.display = 'flex';
                        document.getElementById('wishlist-buttons').style.display = 'none';
                    }
                    current_index = 0;
                    tab_btns[current_index].classList.add('selected');
                } else if ((listSelected === 'bouquets' || listSelected === 'favoris') && popupAction === false) {
                    listChannels.setAttribute('data-attr-back-list', listSelected)
                    listChannels.setAttribute('data-attr-back-list-index', current_index)
                    listChannels.innerHTML = '';
                    groupName.setAttribute('list-selected', listSelected);
                    document.querySelector('#searchForm').classList.add('visible');
                    if (listSelected === 'bouquets') {
                        let bouquetId = tab_btns[current_index].getAttribute('data-id');
                        let bouquetName = tab_btns[current_index].getAttribute('data-name');
                        groupName.innerHTML = bouquetName;
                        groupName.setAttribute('id', bouquetId);
                        if (parseInt(tab_btns[current_index].getAttribute('data-pin'))) {
                            popupAction = true;
                            popupCheckPin = true;
                            popupPin.classList.add('active');
                            popupPinInput.focus();
                        } else {
                            read().then(data => {
                                if (data) {
                                    let result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                                    parsedChannels = result[0].channels
                                    showChannels();
                                }
                            })
                        }
                    } else if (listSelected === 'favoris') {
                        let favorisId = tab_btns[current_index].getAttribute('data-id');
                        let bouquetName = tab_btns[current_index].getAttribute('data-name');

                        groupName.innerHTML = bouquetName;
                        groupName.setAttribute('id', favorisId);

                        read().then(data => {
                            if (data) {
                                const result = data.favoris.filter(favoris => favoris.favori_id == favorisId);
                                console.log(result);
                                parsedChannels = result[0].channels;
                                if (parseInt(tab_btns[current_index].getAttribute('data-pin'))) {
                                    popupAction = true;
                                    popupCheckPin = true;
                                    popupPin.classList.add('active');
                                    popupPinInput.focus();
                                } else {
                                    showChannels()
                                }
                            }
                        })
                    }
                }
            }
            // console.log(tab_btns)
            break;
        case
        'Escape'
        :
            if (listSelected === 'tabs') {
                return false;
            } else {
                if (popupAction === true) {
                    var popupActive = document.querySelector('.popup.active');
                    popupActive.classList.remove('active');
                    popupActive.classList.remove('error');
                    popupAction = false;
                    if (listSelected === 'checkboxes-channels') {
                        listSelected = 'channels'
                        document.querySelector('#list-channels .channel.selected').classList.remove('active');
                    }
                } else {
                    if (listSelected === 'bouquets' || listSelected === 'favoris') {
                        if (listSelected === 'bouquets') {
                            document.getElementById('buckets-buttons').style.display = 'none';
                            // remove class selected from bouquet list
                            for (var k = 0; k < bouquets.length; k++) {
                                bouquets[k].classList.remove('selected')
                            }
                        } else {
                            document.getElementById('wishlist-buttons').style.display = 'none';
                            // remove class selected from favoris list
                            for (var l = 0; l < favoris.length; l++) {
                                favoris[l].classList.remove('selected')
                            }
                        }
                        listSelected = 'tabs';
                        tab_btns = tabs;
                        for (var j = 0; j < tab_btns.length; j++) {
                            if (tab_btns[j].classList.contains('active')) {
                                current_index = j;
                                tab_btns[j].classList.remove('active')
                                tab_btns[j].classList.add('selected')
                            }
                        }
                    } else if (listSelected === 'channels') {
                        listSelected = listChannels.getAttribute('data-attr-back-list');
                        if (listSelected === 'bouquets') {
                            tab_btns = bouquets;
                        } else {
                            tab_btns = favoris;
                        }
                        document.getElementById('sidebar').style.display = "";
                        document.getElementById('right-buttons').style.display = '';
                        document.querySelector('#searchForm').classList.remove('visible');
                    }
                }
            }
            break;
        case
        "ArrowRight"
        :
            if (listSelected === 'tabs' && popupAction === false) {
                tab_btns[current_index].classList.remove('selected');
                getItem(tab_btns[current_index], 'none');
                current_index = mod(current_index - 1, tab_btns.length);
                tab_btns[current_index].classList.add('selected');
                getItem(tab_btns[current_index], 'flex');
            }
            break;
        case
        "ArrowLeft"
        :
            if (listSelected === 'tabs' && popupAction === false) {
                tab_btns[current_index].classList.remove('selected');
                getItem(tab_btns[current_index], 'none');
                current_index = mod(current_index + 1, tab_btns.length);
                tab_btns[current_index].classList.add('selected');
                getItem(tab_btns[current_index], 'flex');
            }
            break;
        case
        "ArrowUp"
        :
            if ((listSelected !== 'tabs' && popupAction === false) || listSelected === 'checkboxes-channels') {
                // if (tab_btns[current_index].classList.contains('move')) {
                //     if (moveChannelAction) {
                //         moveChannel(tab_btns[current_index], 'moveUp')
                //     } else if (moveWishlistAction) {

                        // moveWishlist(tab_btns[current_index], 'moveUp')
                    // }
                if (moveWishlistAction) {
                    console.log("move them up")
                    moveWishlists('up')
                } else {
                    tab_btns[current_index].classList.remove('selected');
                    current_index = mod(current_index - 1, tab_btns.length);
                    tab_btns[current_index].classList.add('selected');
                }
            }
            break;
        case
        'ArrowDown'
        :
            if ((listSelected !== 'tabs' && popupAction === false) || listSelected === 'checkboxes-channels') {
                // if (tab_btns[current_index].classList.contains('move')) {
                //     if (moveChannelAction) {
                //         moveChannel(tab_btns[current_index], 'moveDown')
                //     } else if (moveWishlistAction) {
                        // moveWishlist(tab_btns[current_index], 'moveDown')
                    // }
                if (moveWishlistAction) {
                    console.log("move them down")
                    moveWishlists('down')
                } else {
                    tab_btns[current_index].classList.remove('selected');
                    current_index = mod(current_index + 1, tab_btns.length);
                    tab_btns[current_index].classList.add('selected');
                }
            }
            break;
        case
        '1'
        :
            if (listSelected === 'favoris' && popupAction === false) { // Add new favoris
                popupAction = true;
                let popupWishlist = document.querySelector('.popup.popup-add-wishlist');
                popupWishlist.classList.add('active');
                let popupPinInput = document.querySelector('.popup.popup-add-wishlist #add');
                popupPinInput.focus();
            }
            break;
        case
        '2'
        :
            if (listSelected === 'favoris' && popupAction === false) {
                // moveWishlist(tab_btns[current_index]);
                if (tab_btns[current_index].classList.contains('move')) {
                    moveWishlistAction = true;
                    console.log('confirm selected')
                } else {
                    addElementToMove(tab_btns[current_index]);
                }
            }
            break;
        case
        '3'
        :
            if (listSelected === 'bouquets' && popupAction === false) {
                popupAction = true;
                let popupPinHideBucket = document.querySelector('.popup-check-pin-hide-buckets');
                let popupPinInput = document.querySelector('.popup-check-pin-hide-buckets #pin-hide-field-bucket');
                popupPinHideBucket.classList.add('active');
                popupPinInput.focus();
            } else if (listSelected === 'favoris' && popupAction === false) {
                popupAction = true;
                let popupFavDelete = document.querySelector('.popup-delete');
                popupFavDelete.classList.add('active');
                let favSelectedName = document.querySelector('.list-favoris .favoris.selected');
                let popupTitles = document.querySelector('.popup-delete .popup-title strong');
                popupTitles.innerText = favSelectedName.textContent;
            } else if (listSelected === 'channels' && popupAction === false) { // Add channel to favoris
                popupAction = true;
                popupFav.classList.add('active');
                tab_btns[current_index].classList.add('active')
                read().then(data => {
                    if (data) {
                        popupFavList.innerHTML = '';
                        (data.favoris).forEach((element, index) => {
                            const li = document.createElement('li');
                            li.setAttribute('id', element.favori_id);
                            li.setAttribute('class', 'checkbox-favoris');
                            li.innerHTML = `
                                <input type="checkbox" id="checkbox-${element.favori_id}" name="${element.favori_name}" value="${element.favori_id}" /> ${element.favori_name}
                            `;
                            if (index === 0) {
                                li.classList.add('selected')
                            }
                            popupFavList.appendChild(li);
                        });
                        listSelected = 'checkboxes-channels'
                    }
                })
            }
            break;
        case
        '4'
        :
            if (listSelected === 'favoris' && popupAction === false) { // Rename favoris
                popupAction = true;
                let popupFavRename = document.querySelector('.popup-rename');
                popupFavRename.classList.add('active');
                let favSelectedName = document.querySelector('.list-favoris .favoris.selected');
                let popupTitles = document.querySelector('.popup-rename .popup-title strong');
                let inputRename = document.querySelector('.popup-rename #rename');
                popupTitles.innerText = favSelectedName.textContent;
                inputRename.value = favSelectedName.textContent
                inputRename.focus();
            } else if (listSelected === 'channels' && popupAction === false) { // Remove channel from favoris
                var groupNameSelected = document.querySelector('.group-name');
                if (groupNameSelected.getAttribute('list-selected') === 'favoris') {
                    popupAction = true;
                    var favorisSelected = document.querySelector('.group-name');
                    var favorisChannelSelected = document.querySelector('.list-channels .channel.selected');
                    var popupRemoveFromWishlist = document.querySelector('.popup-remove-from-wishlist');
                    var popupRemoveFromWishlistForm = document.getElementById('remove-from-wishlist-form');
                    var popupRemoveFromWishlistTitle = document.querySelector('.popup-remove-from-wishlist .popup-title');

                    // Popup title => Favoris
                    popupRemoveFromWishlistTitle.innerHTML = 'Are you sure you want to remove <strong>' + favorisChannelSelected.getAttribute('data-attr-name') + '</strong> from <strong>' + favorisSelected.textContent + '</strong> ?'

                    // Show popup remove channel item from wishlist
                    popupRemoveFromWishlist.classList.add('active');

                    // Submit form remove channel item from wishlist
                    popupRemoveFromWishlistForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        favorisChannelSelected.remove();
                        read().then(data => {
                            if (data) {
                                let getFav = data.favoris.filter(item => item.favori_id == favorisSelected.id);
                                let getFavChannels = getFav[0].channels.filter(item => item.channel_id != favorisChannelSelected.getAttribute('data-attr-id'));
                                let favorisChannel = document.querySelectorAll('.list-channels .channel');
                                favorisChannel[0].classList.add('selected');
                                getFav[0].channels = getFavChannels;
                                // TODO saves two time
                                save(data);
                            }
                        })
                    })
                }
            }
            break;
        case
        '5'
        :
            if (listSelected === 'favoris' && popupAction === false) {
                popupAction = true;
                let popupCheckPinWishlist = document.querySelector('.popup-check-pin-favoris');
                let popupPinInput = document.querySelector('.popup-check-pin-favoris #pin-field-favoris');
                popupCheckPinWishlist.classList.add('active');
                popupPinInput.focus();
            } else if (listSelected === 'bouquets' && popupAction === false) {
                popupAction = true;
                let popupCheckPinBucket = document.querySelector('.popup-check-pin-buckets');
                let popupPinInput = document.querySelector('.popup-check-pin-buckets #pin-field-bucket');
                popupCheckPinBucket.classList.add('active');
                popupPinInput.focus();
            } else if (listSelected === 'channels' && popupAction === false) { // Sort channels by ASC or DESC
                let normalArr = [];
                let newArr = [];
                var getAllChannels = document.querySelectorAll('#list-channels .channel');
                listChannels0.innerHTML = '';
                getAllChannels.forEach(el => {
                    var channelID = el.getAttribute('data-attr-id');
                    var channelName = el.getAttribute('data-attr-name');
                    var channelOrder = el.getAttribute('data-attr-order');
                    newArr.push({
                        "channel_id": parseInt(channelID),
                        "channel_name": channelName,
                        "channel_order": parseInt(channelOrder)
                    });
                    normalArr.push({
                        "channel_id": parseInt(channelID),
                        "channel_name": channelName,
                        "channel_order": parseInt(channelOrder)
                    });
                });

                newArr.sort((a, b) => {
                    if (a.channel_name < b.channel_name) {
                        return -1;
                    }
                    if (a.channel_name > b.channel_name) {
                        return 1;
                    }
                    return 0;
                });
                normalArr.sort((a, b) => {
                    if (a.channel_order < b.channel_order) {
                        return -1;
                    }
                    if (a.channel_order > b.channel_order) {
                        return 1;
                    }
                    return 0;
                });

                if (sortAscDesc === 0) {
                    newArr.forEach((element, index) => {
                        const li = document.createElement('li');
                        li.setAttribute('data-attr-id', element.channel_id);
                        li.setAttribute('data-attr-name', element.channel_name);
                        li.setAttribute('data-attr-order', element.channel_order);
                        if (index == 0) {
                            li.setAttribute('class', 'channel selected');
                        } else {
                            li.setAttribute('class', 'channel');
                        }
                        li.innerHTML = element.channel_name;
                        listChannels0.appendChild(li);
                    });
                    sortBy.textContent = '(A-Z)';
                    sortAscDesc = 1;
                } else if (sortAscDesc === 1) {
                    newArr.reverse();
                    newArr.forEach((element, index) => {
                        const li = document.createElement('li');
                        li.setAttribute('data-attr-id', element.channel_id);
                        li.setAttribute('data-attr-name', element.channel_name);
                        li.setAttribute('data-attr-order', element.channel_order);
                        if (index == 0) {
                            li.setAttribute('class', 'channel selected');
                        } else {
                            li.setAttribute('class', 'channel');
                        }
                        li.innerHTML = element.channel_name;
                        listChannels0.appendChild(li);
                    });
                    sortBy.textContent = '(Z-A)';
                    sortAscDesc = 2;
                } else if (sortAscDesc === 2) {
                    normalArr.forEach((element, index) => {
                        const li = document.createElement('li');
                        li.setAttribute('data-attr-id', element.channel_id);
                        li.setAttribute('data-attr-name', element.channel_name);
                        li.setAttribute('data-attr-order', element.channel_order);
                        if (index == 0) {
                            li.setAttribute('class', 'channel selected');
                        } else {
                            li.setAttribute('class', 'channel');
                        }
                        li.innerHTML = element.channel_name;
                        listChannels0.appendChild(li);
                    });
                    sortBy.textContent = '(Normal)';
                    sortAscDesc = 0;
                }
            }
            break;
        case
        '6'
        :
            if (listSelected === 'channels' && popupAction === false) {
                moveChannelAction = true;
                moveChannel(tab_btns[current_index]);
            }
            break;
    }

})
;

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
        listChannels0.appendChild(li);
    });
    hideSidebar()
}

function hideSidebar() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('right-buttons').style.display = 'flex';
    if (listSelected === 'favoris') {
        document.querySelector('#right-buttons .remove-from-favoris').style.display = 'block';
    } else {
        document.querySelector('#right-buttons .remove-from-favoris').style.display = 'none';
    }
    listSelected = 'channels';
    tab_btns = channels;
}

////////////////////////////////////////////////////
/// SHOW CHANNELS AFTER CHECK PIN /// END
////////////////////////////////////////////////////

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getItem(selector, display) {
    console.log(selector)
    document.querySelector('.' + selector.getAttribute('data-list')).style.display = display;
}
