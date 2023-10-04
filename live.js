let listSelected = 'tabs';
const tabs = document.getElementsByClassName('tab');
const bouquets = document.getElementsByClassName('bouquet');
const wishlist = document.getElementsByClassName('wishlist');
let channels = document.getElementsByClassName('channel');
let groupName = document.querySelector('.group-name');
let tab_btns = [];
let sortAscDesc = 0;
const sortLabel = document.querySelector('.sortBy');
let parsedChannels = [];

let popupAction = false;
let popupError = false;
let popupCheckPin = false;

let moveWishlistAction = false;
let moveChannelAction = false;

let generalMoveAction = false;
let channelSelected = null

let popupCloseBtn = document.querySelectorAll('.popup .btn-cancel');
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
const popupPin = document.querySelector('.popup-check-pin-access');
const popupPinForm = document.querySelector('.popup-check-pin-access form');
const popupPinInput = document.querySelector('.popup-check-pin-access #pin-field');

popupPinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                if (listSelected === 'buckets') {
                    let bucketId = document.querySelector('.bouquet.selected').getAttribute('data-id')
                    console.log(bucketId)
                    let result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bucketId);
                    parsedChannels = result[0].channels

                } else if (listSelected === 'wishlists') {
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
const popupFav = document.querySelector('.popup.popup-wishlist');
const popupFavForm = document.querySelector('.popup.popup-wishlist form');
popupFavForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const listChanSelected = document.querySelector('#list-channels .channel.selected');
    const listChanSelectedID = listChanSelected.getAttribute('data-attr-id');
    const listChanSelectedName = listChanSelected.getAttribute('data-attr-name');
    const checkedFav = document.querySelectorAll('.popup-wishlist-list-fav li input:checked');

    const favArr = [];
    checkedFav.forEach(el => {
        favArr.push(parseInt(el.value));
        console.log(el.value);
    })

    read().then(data => {
        if (data) {
            (data.wishlists).forEach((element, index) => {
                if (favArr.indexOf(element.wishlist_id) !== -1) {
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
        }
    })
})
//////////////////////////////////////////////
/// CHANNELS : ADD TO WISHLIST /// END
//////////////////////////////////////////////

document.addEventListener('keyup', function (e) {
    const key = e.key;
    console.log("key = " + key);

    let listChannels = document.getElementById('list-channels');

    if (listSelected === 'tabs') {
        tab_btns = tabs;
    } else if (listSelected === 'buckets') {
        tab_btns = bouquets;
    } else if (listSelected === 'wishlists') {
        tab_btns = wishlist;
    } else if (listSelected === 'channels') {
        tab_btns = channels;
    } else if (listSelected === 'checkboxes-channels') {
        tab_btns = document.getElementsByClassName('checkbox-wishlist');
    }

    let current_index;
    for (let i = 0; i < tab_btns.length; i++) {
        if (tab_btns[i].classList.contains('selected')) {
            current_index = i;
            break;
        }
    }

    //console.log('current index = ' + current_index)

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
            if (generalMoveAction) {
                if (tab_btns[current_index].classList.contains('move')) {
                    if (listSelected === 'wishlists') {
                        moveWishlistAction = true;
                        manageActionsButtons('none', true)
                    } else if (listSelected === 'channels') {
                        moveChannelAction = true;
                    }
                    generalMoveAction = false
                }
                return;
            } else if (popupAction === true) {
                let popupBtnActive = document.querySelector('.popup.active form button[class~="active"]');
                popupBtnActive.click();
            } else if (moveChannelAction === true) {
                saveMoveChannel()
                moveChannelAction = false
                current_index = 0
            } else if (moveWishlistAction === true) {
                saveMoveWishlist()
                moveWishlistAction = false
                current_index = 0
            } else if (listSelected === 'tabs') {
                if (tab_btns[current_index].getAttribute('data-list') === 'list-wishlist') {
                    listSelected = 'wishlists';
                    tab_btns[current_index].classList.remove('selected');
                    tab_btns[current_index].classList.add('active');
                    tab_btns = wishlist;
                    document.getElementById('wishlist-buttons').style.display = 'flex';
                    document.getElementById('buckets-buttons').style.display = 'none';
                } else {
                    listSelected = 'buckets';
                    tab_btns[current_index].classList.remove('selected');
                    tab_btns[current_index].classList.add('active');
                    tab_btns = bouquets;
                    document.getElementById('buckets-buttons').style.display = 'flex';
                    document.getElementById('wishlist-buttons').style.display = 'none';
                }
                current_index = 0;
                tab_btns[current_index].classList.add('selected');
            } else if ((listSelected === 'buckets' || listSelected === 'wishlists') && popupAction === false) {
                listChannels.setAttribute('data-attr-back-list', listSelected)
                listChannels.setAttribute('data-attr-back-list-index', current_index)
                listChannels.innerHTML = '';
                groupName.setAttribute('list-selected', listSelected);
                document.querySelector('#searchForm').classList.add('visible');
                if (listSelected === 'buckets') {
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
                } else if (listSelected === 'wishlists') {
                    if (document.querySelector('li.action-add-wishlist').classList.contains('selected') && popupAction === false) { // Add new wishlist
                        popupAction = true;
                        let popupWishlist = document.querySelector('.popup.popup-add-wishlist');
                        popupWishlist.classList.add('active');
                        let popupPinInput = document.querySelector('.popup.popup-add-wishlist #add');
                        popupPinInput.focus();
                    } else {
                        let wishlistId = tab_btns[current_index].getAttribute('data-id');
                        let bouquetName = tab_btns[current_index].getAttribute('data-name');
                        groupName.innerHTML = bouquetName;
                        groupName.setAttribute('id', wishlistId);
                        read().then(data => {
                            if (data) {
                                const result = data.wishlists.filter(wishlist => wishlist.wishlist_id == wishlistId);
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
            break;
        case
        'Escape'
        :
            if (listSelected === 'tabs') {
                return false;
            } else if (generalMoveAction || moveChannelAction || moveWishlistAction) { // cancel move
                generalMoveAction = false;
                if (listSelected === 'channels') {
                    moveChannelAction = false
                    cancelChannelsMove()
                    channelSelected = null
                    manageChannelsAction(false)
                } else if (listSelected === 'wishlists') {
                    moveWishlistAction = false
                    cancelWishlistsMove()
                }
            } else if (channelSelected) { // unselect channel
                channelSelected = null
                manageChannelsAction(false)
            } else if (popupAction === true) {
                let popupActive = document.querySelector('.popup.active');
                popupActive.classList.remove('active');
                popupActive.classList.remove('error');
                popupAction = false;
                if (listSelected === 'checkboxes-channels') {
                    listSelected = 'channels'
                    document.querySelector('#list-channels .channel.selected').classList.remove('active');
                }
            } else if (listSelected === 'buckets' || listSelected === 'wishlists') {
                if (listSelected === 'buckets') {
                    document.getElementById('buckets-buttons').style.display = 'none';
                    // remove class selected from bouquet list
                    for (const element of bouquets) {
                        element.classList.remove('selected')
                    }
                } else {
                    document.getElementById('wishlist-buttons').style.display = 'none';
                    // remove class selected from wishlist list
                    for (const element of wishlist) {
                        element.classList.remove('selected')
                    }
                }
                listSelected = 'tabs';
                tab_btns = tabs;
                for (let j = 0; j < tab_btns.length; j++) {
                    if (tab_btns[j].classList.contains('active')) {
                        current_index = j;
                        tab_btns[j].classList.remove('active')
                        tab_btns[j].classList.add('selected')
                    }
                }
            } else if (listSelected === 'channels') {
                listSelected = listChannels.getAttribute('data-attr-back-list');
                if (listSelected === 'buckets') {
                    tab_btns = bouquets;
                } else {
                    tab_btns = wishlist;
                }
                document.getElementById('sidebar').style.display = "";
                document.getElementById('right-buttons').style.display = '';
                document.querySelector('#searchForm').classList.remove('visible');
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
            if (popupAction) {
                switchPopupActiveYesNo()
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
            if (popupAction) {
                switchPopupActiveYesNo()
            }
            break;
        case
        "ArrowUp"
        :
            if ((listSelected !== 'tabs' && popupAction === false) || listSelected === 'checkboxes-channels') {
                if (moveChannelAction) {
                    moveChannels('up')
                } else if (moveWishlistAction) {
                    moveWishlists('up')
                } else if (listSelected === 'wishlists') {
                    if (document.querySelector('li.action-add-wishlist').classList.contains('selected')) {
                        document.querySelector('li.action-add-wishlist').classList.remove('selected')
                        tab_btns[tab_btns.length - 1].classList.add('selected');
                    } else {
                        tab_btns[current_index].classList.remove('selected');
                        if (current_index === 0) {
                            document.querySelector('li.action-add-wishlist').classList.add("selected")
                        } else {
                            current_index = mod(current_index - 1, tab_btns.length);
                            tab_btns[current_index].classList.add('selected');
                            if (generalMoveAction && listSelected === 'wishlists') {
                                if (tab_btns[current_index].classList.contains('move')) {
                                    changeLabel("Désélectionner")
                                } else {
                                    changeLabel("Sélectionner")
                                }
                            }
                        }
                    }
                } else if ((listSelected === 'channels' && !channelSelected) || (channelSelected && generalMoveAction)
                    || listSelected === 'buckets' || listSelected === 'checkboxes-channels') {
                    tab_btns[current_index].classList.remove('selected');
                    current_index = mod(current_index - 1, tab_btns.length);
                    tab_btns[current_index].classList.add('selected');
                }
            }
            break;
        case 'ArrowDown':
            if ((listSelected !== 'tabs' && popupAction === false) || listSelected === 'checkboxes-channels') {
                if (moveChannelAction) {
                    moveChannels('down')
                } else if (moveWishlistAction) {
                    moveWishlists('down')
                } else if (listSelected === 'wishlists') {
                    if (current_index >= 0) {
                        tab_btns[current_index].classList.remove('selected');
                    }
                    if (listSelected === 'wishlists' && current_index == wishlist.length - 1) {
                        document.querySelector('li.action-add-wishlist').classList.add("selected")
                    } else if (document.querySelector('li.action-add-wishlist').classList.contains('selected')) {
                        document.querySelector('li.action-add-wishlist').classList.remove('selected')
                        tab_btns[0].classList.add('selected');
                    } else {
                        current_index = mod(current_index + 1, tab_btns.length);
                        tab_btns[current_index].classList.add('selected');
                        if (generalMoveAction && listSelected === 'wishlists') {
                            if (tab_btns[current_index].classList.contains('move')) {
                                changeLabel("Désélectionner")
                            } else {
                                changeLabel("Sélectionner")
                            }
                        }
                    }
                } else if ((listSelected === 'channels' && !channelSelected) || (channelSelected && generalMoveAction)
                    || listSelected === 'buckets' || listSelected === 'checkboxes-channels') {
                    tab_btns[current_index].classList.remove('selected');
                    current_index = mod(current_index + 1, tab_btns.length);
                    tab_btns[current_index].classList.add('selected');
                }
            }
            break;
        case '1':
            console.log(listSelected)
            if (listSelected === 'channels' && popupAction === false) { // selectChannel for actions
                if (!channelSelected) {
                    channelSelected = tab_btns[current_index]
                    // init order listing
                    let getAllChannels = document.querySelectorAll('#list-channels .channel');
                    listChannels0.innerHTML = '';
                    let normalArr= getChannels(getAllChannels);
                    normalArr.sort((a, b) => {
                        return a.channel_order < b.channel_order ? -1 : 0;
                    })
                    fetchChannelsOrdered(normalArr, sortLabel, 'Normal', channelSelected, true)
                    sortAscDesc = 0;
                    // end init order listing

                    manageChannelsAction(true)
                } else {
                    tab_btns[current_index].innerHTML = tab_btns[current_index].getAttribute('data-attr-name');
                    tab_btns[current_index].classList.remove('checked')
                    channelSelected = null
                    manageChannelsAction(false)
                }
            }
            break;
        case '2':
            if (listSelected === 'wishlists' && popupAction === false && !moveWishlistAction) {
                if (!tab_btns[current_index].classList.contains('move')) {
                    generalMoveAction = true;
                    manageActionsButtons('none')
                    addElementToMove(tab_btns[current_index]);
                    changeLabel("Désélectionner")
                } else {
                    tab_btns[current_index].classList.remove('move')
                    tab_btns[current_index].innerHTML = tab_btns[current_index].getAttribute('data-name')
                    changeLabel("Sélectionner")
                }
            }
            break;
        case
        '3'
        :
            if (generalMoveAction === true) {
                return;
            } else if (listSelected === 'buckets' && popupAction === false) {
                popupAction = true;
                let popupPinHideBucket = document.querySelector('.popup-check-pin-hide-buckets');
                let popupPinInput = document.querySelector('.popup-check-pin-hide-buckets #pin-hide-field-bucket');
                popupPinHideBucket.classList.add('active');
                popupPinInput.focus();
            } else if (listSelected === 'wishlists' && popupAction === false) {
                popupAction = true;
                let popupFavDelete = document.querySelector('.popup-delete');
                popupFavDelete.classList.add('active');
                let favSelectedName = document.querySelector('.list-wishlist .wishlist.selected');
                let popupTitles = document.querySelector('.popup-delete .popup-title strong');
                popupTitles.innerText = favSelectedName.textContent;
            } else if (listSelected === 'channels' && channelSelected && popupAction === false) { // Add channel to wishlist
                popupAction = true;
                popupFav.classList.add('active');
                tab_btns[current_index].classList.add('active')
                read().then(data => {
                    if (data) {
                        popupFavList.innerHTML = '';
                        (data.wishlists).forEach((element, index) => {
                            const li = document.createElement('li');
                            li.setAttribute('id', element.wishlist_id);
                            li.setAttribute('class', 'checkbox-wishlist');
                            li.innerHTML = `
                                <input type="checkbox" id="checkbox-${element.wishlist_id}" name="${element.wishlist_name}" value="${element.wishlist_id}" /> ${element.wishlist_name}
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
            if (generalMoveAction === true) {
                return;
            } else if (listSelected === 'wishlists' && popupAction === false) { // Rename wishlist
                popupAction = true;
                let popupFavRename = document.querySelector('.popup-rename');
                popupFavRename.classList.add('active');
                let favSelectedName = document.querySelector('.list-wishlist .wishlist.selected');
                let popupTitles = document.querySelector('.popup-rename .popup-title strong');
                let inputRename = document.querySelector('.popup-rename #rename');
                popupTitles.innerText = favSelectedName.textContent;
                inputRename.value = favSelectedName.textContent
                inputRename.focus();
            } else if (listSelected === 'channels' && channelSelected && popupAction === false) { // Remove channel from wishlist
                let groupNameSelected = document.querySelector('.group-name');
                if (groupNameSelected.getAttribute('list-selected') === 'wishlists') {
                    popupAction = true;
                    let wishlistSelected = document.querySelector('.group-name');
                    let wishlistChannelSelected = document.querySelector('.list-channels .channel.selected');
                    let popupRemoveFromWishlist = document.querySelector('.popup-remove-from-wishlist');
                    let popupRemoveFromWishlistTitle = document.querySelector('.popup-remove-from-wishlist .popup-title');
                    // Popup title => Wishlist
                    popupRemoveFromWishlistTitle.innerHTML = 'Etes vous sur de vouloir supprimer <strong>' +
                        wishlistChannelSelected.getAttribute('data-attr-name') +
                        '</strong> depuis <strong>' + wishlistSelected.textContent + '</strong> ?'
                    // Show popup remove channel item from wishlist
                    popupRemoveFromWishlist.classList.add('active');
                }
            }
            break;
        case
        '5'
        :
            if (generalMoveAction === true) {
                return;
            } else if (listSelected === 'wishlists' && popupAction === false) {
                popupAction = true;
                let popupCheckPinWishlist = document.querySelector('.popup-check-pin-wishlist');
                let popupPinInput = document.querySelector('.popup-check-pin-wishlist #pin-field-wishlist');
                popupCheckPinWishlist.classList.add('active');
                popupPinInput.focus();
            } else if (listSelected === 'buckets' && popupAction === false) {
                popupAction = true;
                let popupCheckPinBucket = document.querySelector('.popup-check-pin-buckets');
                let popupPinInput = document.querySelector('.popup-check-pin-buckets #pin-field-bucket');
                popupCheckPinBucket.classList.add('active');
                popupPinInput.focus();
            } else if (listSelected === 'channels' && popupAction === false) { // Sort channels by ASC or DESC
                let current = tab_btns[current_index]
                let getAllChannels = document.querySelectorAll('#list-channels .channel');
                listChannels0.innerHTML = '';
                let newArr = getChannels(getAllChannels);
                let normalArr= getChannels(getAllChannels);

                newArr.sort((a, b) => {
                    if (a.channel_name < b.channel_name) {
                        return -1;
                    }
                    if (a.channel_name > b.channel_name) {
                        return 1;
                    }
                    return 0;
                });

                if (sortAscDesc === 0) {
                    fetchChannelsOrdered(newArr, sortLabel, 'A-Z', current)
                    sortAscDesc = 1;
                } else if (sortAscDesc === 1) {
                    newArr.reverse();
                    fetchChannelsOrdered(newArr, sortLabel, 'Z-A', current)
                    sortAscDesc = 2;
                } else if (sortAscDesc === 2) {
                    normalArr.sort((a, b) => {
                        return a.channel_order < b.channel_order ? -1 : 0;
                    })
                    fetchChannelsOrdered(normalArr, sortLabel, 'Normal', current)
                    sortAscDesc = 0;
                }
            }
            break;
        case '6':
            if (listSelected === 'channels' && channelSelected && popupAction === false) {
                if (tab_btns[current_index].classList.contains('move')) {
                    moveChannelAction = true;
                } else {
                    generalMoveAction = true;
                    addChannelToMove(tab_btns[current_index]);
                }
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
    listSelected = 'channels';
    tab_btns = channels;
}

////////////////////////////////////////////////////
/// SHOW CHANNELS AFTER CHECK PIN /// END
////////////////////////////////////////////////////

function switchPopupActiveYesNo() {
    let popupButtons = document.querySelectorAll('.popup.active form button');
    let popupBtnActive = document.querySelector('.popup.active form button[class~="active"]');
    popupButtons.forEach(button => {
        if (button === popupBtnActive) {
            button.classList.remove('active')
        } else {
            button.classList.add('active')
        }
    })
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getItem(selector, display) {
    document.querySelector('.' + selector.getAttribute('data-list')).style.display = display;
}
