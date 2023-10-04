const tabs = document.getElementsByClassName('tab');
const buckets = document.getElementsByClassName('bucket');
const wishlist = document.getElementsByClassName('wishlist');
const sortLabel = document.querySelector('.sortBy');

let list_selected = 'tabs';
let channels = document.getElementsByClassName('channel');
let groupName = document.querySelector('.group-name');
let currentList = [];
let sortAscDesc = 0;
let parsedChannels = [];

let popupAction = false;
let popupError = false;
let popupCheckPin = false;

let generalMoveAction = false;
let moveWishlistAction = false;
let moveChannelAction = false;

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
                if (list_selected === 'buckets') {
                    let bucketId = document.querySelector('.bucket.selected').getAttribute('data-id')
                    console.log(bucketId)
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

            list_selected = 'channels';
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

    if (list_selected === 'tabs') {
        currentList = tabs;
    } else if (list_selected === 'buckets') {
        currentList = buckets;
    } else if (list_selected === 'wishlists') {
        currentList = wishlist;
    } else if (list_selected === 'channels') {
        currentList = channels;
    } else if (list_selected === 'checkboxes-channels') {
        currentList = document.getElementsByClassName('checkbox-wishlist');
    }

    let current_index;
    for (let i = 0; i < currentList.length; i++) {
        if (currentList[i].classList.contains('selected')) {
            current_index = i;
            break;
        }
    }

    //console.log('current index = ' + current_index)

    switch (key) {
        case ' ':
            if (list_selected === 'checkboxes-channels') {
                let checkbox = currentList[current_index].querySelector('input');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            }
            break;
        case 'Enter':
            if (generalMoveAction) {
                if (currentList[current_index].classList.contains('move')) {
                    if (list_selected === 'wishlists') {
                        moveWishlistAction = true;
                        manageActionsButtons('none', true)
                    } else if (list_selected === 'channels') {
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
                channelSelected = null
                manageChannelsAction(false)
            } else if (moveWishlistAction === true) {
                saveMoveWishlist()
                moveWishlistAction = false
                current_index = 0
            } else if (list_selected === 'tabs') {
                if (currentList[current_index].getAttribute('data-list') === 'list-wishlist') {
                    list_selected = 'wishlists';
                    currentList[current_index].classList.remove('selected');
                    currentList[current_index].classList.add('active');
                    currentList = wishlist;
                    document.getElementById('wishlist-buttons').style.display = 'flex';
                    document.getElementById('buckets-buttons').style.display = 'none';
                } else {
                    list_selected = 'buckets';
                    currentList[current_index].classList.remove('selected');
                    currentList[current_index].classList.add('active');
                    currentList = buckets;
                    document.getElementById('buckets-buttons').style.display = 'flex';
                    document.getElementById('wishlist-buttons').style.display = 'none';
                }
                current_index = 0;
                currentList[current_index].classList.add('selected');
            } else if ((list_selected === 'buckets' || list_selected === 'wishlists') && popupAction === false) {
                listChannels.setAttribute('data-attr-back-list', list_selected)
                listChannels.setAttribute('data-attr-back-list-index', current_index)
                listChannels.innerHTML = '';
                groupName.setAttribute('list-selected', list_selected);
                document.querySelector('#searchForm').classList.add('visible');
                if (list_selected === 'buckets') {
                    let bucketId = currentList[current_index].getAttribute('data-id');
                    let bucketName = currentList[current_index].getAttribute('data-name');
                    groupName.innerHTML = bucketName;
                    groupName.setAttribute('id', bucketId);
                    if (parseInt(currentList[current_index].getAttribute('data-pin'))) {
                        popupAction = true;
                        popupCheckPin = true;
                        popupPin.classList.add('active');
                        popupPinInput.focus();
                    } else {
                        read().then(data => {
                            if (data) {
                                let result = data.buckets.filter(bucket => bucket.bucket_id == bucketId);
                                parsedChannels = result[0].channels
                                showChannels();
                            }
                        })
                    }
                } else if (list_selected === 'wishlists') {
                    if (document.querySelector('li.action-add-wishlist').classList.contains('selected') && popupAction === false) { // Add new wishlist
                        popupAction = true;
                        let popupWishlist = document.querySelector('.popup.popup-add-wishlist');
                        popupWishlist.classList.add('active');
                        let popupPinInput = document.querySelector('.popup.popup-add-wishlist #add');
                        popupPinInput.focus();
                    } else {
                        let wishlistId = currentList[current_index].getAttribute('data-id');
                        let bucketName = currentList[current_index].getAttribute('data-name');
                        groupName.innerHTML = bucketName;
                        groupName.setAttribute('id', wishlistId);
                        read().then(data => {
                            if (data) {
                                const result = data.wishlists.filter(wishlist => wishlist.wishlist_id == wishlistId);
                                console.log(result);
                                parsedChannels = result[0].channels;
                                if (parseInt(currentList[current_index].getAttribute('data-pin'))) {
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
            if (list_selected === 'tabs') {
                return false;
            } else if (generalMoveAction || moveChannelAction || moveWishlistAction) { // cancel move
                generalMoveAction = false;
                if (list_selected === 'channels') {
                    moveChannelAction = false
                    cancelChannelsMove()
                    channelSelected = null
                    manageChannelsAction(false)
                } else if (list_selected === 'wishlists') {
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
                if (list_selected === 'checkboxes-channels') {
                    list_selected = 'channels'
                    document.querySelector('#list-channels .channel.selected').classList.remove('active');
                }
            } else if (list_selected === 'buckets' || list_selected === 'wishlists') {
                if (list_selected === 'buckets') {
                    document.getElementById('buckets-buttons').style.display = 'none';
                    // remove class selected from bucket list
                    for (const element of buckets) {
                        element.classList.remove('selected')
                    }
                } else {
                    document.getElementById('wishlist-buttons').style.display = 'none';
                    // remove class selected from wishlist list
                    for (const element of wishlist) {
                        element.classList.remove('selected')
                    }
                }
                list_selected = 'tabs';
                currentList = tabs;
                for (let j = 0; j < currentList.length; j++) {
                    if (currentList[j].classList.contains('active')) {
                        current_index = j;
                        currentList[j].classList.remove('active')
                        currentList[j].classList.add('selected')
                    }
                }
            } else if (list_selected === 'channels') {
                list_selected = listChannels.getAttribute('data-attr-back-list');
                if (list_selected === 'buckets') {
                    currentList = buckets;
                } else {
                    currentList = wishlist;
                }
                document.getElementById('sidebar').style.display = "";
                document.getElementById('right-buttons').style.display = '';
                document.querySelector('#searchForm').classList.remove('visible');
            }
            break;
        case
        "ArrowRight"
        :
            if (list_selected === 'tabs' && popupAction === false) {
                currentList[current_index].classList.remove('selected');
                getItem(currentList[current_index], 'none');
                current_index = mod(current_index - 1, currentList.length);
                currentList[current_index].classList.add('selected');
                getItem(currentList[current_index], 'flex');
            }
            if (popupAction) {
                switchPopupActiveYesNo()
            }
            break;
        case
        "ArrowLeft"
        :
            if (list_selected === 'tabs' && popupAction === false) {
                currentList[current_index].classList.remove('selected');
                getItem(currentList[current_index], 'none');
                current_index = mod(current_index + 1, currentList.length);
                currentList[current_index].classList.add('selected');
                getItem(currentList[current_index], 'flex');
            }
            if (popupAction) {
                switchPopupActiveYesNo()
            }
            break;
        case
        "ArrowUp"
        :
            if ((list_selected !== 'tabs' && popupAction === false) || list_selected === 'checkboxes-channels') {
                if (moveChannelAction) {
                    moveChannels('up')
                } else if (moveWishlistAction) {
                    moveWishlists('up')
                } else if (list_selected === 'wishlists') {
                    if (document.querySelector('li.action-add-wishlist').classList.contains('selected')) {
                        document.querySelector('li.action-add-wishlist').classList.remove('selected')
                        currentList[currentList.length - 1].classList.add('selected');
                    } else {
                        currentList[current_index].classList.remove('selected');
                        if (current_index === 0) {
                            document.querySelector('li.action-add-wishlist').classList.add("selected")
                        } else {
                            current_index = mod(current_index - 1, currentList.length);
                            currentList[current_index].classList.add('selected');
                            if (generalMoveAction && list_selected === 'wishlists') {
                                if (currentList[current_index].classList.contains('move')) {
                                    changeLabel("Désélectionner")
                                } else {
                                    changeLabel("Sélectionner")
                                }
                            }
                        }
                    }
                } else if ((list_selected === 'channels' && !channelSelected) || (channelSelected && generalMoveAction)
                    || list_selected === 'buckets' || list_selected === 'checkboxes-channels') {
                    currentList[current_index].classList.remove('selected');
                    current_index = mod(current_index - 1, currentList.length);
                    currentList[current_index].classList.add('selected');
                }
            }
            break;
        case 'ArrowDown':
            if ((list_selected !== 'tabs' && popupAction === false) || list_selected === 'checkboxes-channels') {
                if (moveChannelAction) {
                    moveChannels('down')
                } else if (moveWishlistAction) {
                    moveWishlists('down')
                } else if (list_selected === 'wishlists') {
                    if (current_index >= 0) {
                        currentList[current_index].classList.remove('selected');
                    }
                    if (list_selected === 'wishlists' && current_index == wishlist.length - 1) {
                        document.querySelector('li.action-add-wishlist').classList.add("selected")
                    } else if (document.querySelector('li.action-add-wishlist').classList.contains('selected')) {
                        document.querySelector('li.action-add-wishlist').classList.remove('selected')
                        currentList[0].classList.add('selected');
                    } else {
                        current_index = mod(current_index + 1, currentList.length);
                        currentList[current_index].classList.add('selected');
                        if (generalMoveAction && list_selected === 'wishlists') {
                            if (currentList[current_index].classList.contains('move')) {
                                changeLabel("Désélectionner")
                            } else {
                                changeLabel("Sélectionner")
                            }
                        }
                    }
                } else if ((list_selected === 'channels' && !channelSelected) || (channelSelected && generalMoveAction)
                    || list_selected === 'buckets' || list_selected === 'checkboxes-channels') {
                    currentList[current_index].classList.remove('selected');
                    current_index = mod(current_index + 1, currentList.length);
                    currentList[current_index].classList.add('selected');
                }
            }
            break;
        case '1':
            console.log(list_selected)
            if (list_selected === 'channels' && popupAction === false) { // selectChannel for actions
                if (!channelSelected) {
                    channelSelected = currentList[current_index]
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
                    currentList[current_index].innerHTML = currentList[current_index].getAttribute('data-attr-name');
                    currentList[current_index].classList.remove('checked')
                    channelSelected = null
                    manageChannelsAction(false)
                }
            }
            break;
        case '2':
            if (list_selected === 'wishlists' && popupAction === false && !moveWishlistAction) {
                if (!currentList[current_index].classList.contains('move')) {
                    generalMoveAction = true;
                    manageActionsButtons('none')
                    addElementToMove(currentList[current_index]);
                    changeLabel("Désélectionner")
                } else {
                    currentList[current_index].classList.remove('move')
                    currentList[current_index].innerHTML = currentList[current_index].getAttribute('data-name')
                    changeLabel("Sélectionner")
                }
            }
            break;
        case
        '3'
        :
            if (generalMoveAction === true) {
                return;
            } else if (list_selected === 'buckets' && popupAction === false) {
                popupAction = true;
                let popupPinHideBucket = document.querySelector('.popup-check-pin-hide-buckets');
                let popupPinInput = document.querySelector('.popup-check-pin-hide-buckets #pin-hide-field-bucket');
                popupPinHideBucket.classList.add('active');
                popupPinInput.focus();
            } else if (list_selected === 'wishlists' && popupAction === false) {
                popupAction = true;
                let popupFavDelete = document.querySelector('.popup-delete');
                popupFavDelete.classList.add('active');
                let favSelectedName = document.querySelector('.list-wishlist .wishlist.selected');
                let popupTitles = document.querySelector('.popup-delete .popup-title strong');
                popupTitles.innerText = favSelectedName.textContent;
            } else if (list_selected === 'channels' && channelSelected && popupAction === false) { // Add channel to wishlist
                popupAction = true;
                popupFav.classList.add('active');
                currentList[current_index].classList.add('active')
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
                        list_selected = 'checkboxes-channels'
                    }
                })
            }
            break;
        case
        '4'
        :
            if (generalMoveAction === true) {
                return;
            } else if (list_selected === 'wishlists' && popupAction === false) { // Rename wishlist
                popupAction = true;
                let popupFavRename = document.querySelector('.popup-rename');
                popupFavRename.classList.add('active');
                let favSelectedName = document.querySelector('.list-wishlist .wishlist.selected');
                let popupTitles = document.querySelector('.popup-rename .popup-title strong');
                let inputRename = document.querySelector('.popup-rename #rename');
                popupTitles.innerText = favSelectedName.textContent;
                inputRename.value = favSelectedName.textContent
                inputRename.focus();
            } else if (list_selected === 'channels' && channelSelected && popupAction === false) { // Remove channel from wishlist
                let groupNameSelected = document.querySelector('.group-name');
                if (groupNameSelected.getAttribute('list-selected') === 'wishlists') {
                    popupAction = true;
                    let wishlist_selected = document.querySelector('.group-name');
                    let wishlistChannelSelected = document.querySelector('.list-channels .channel.selected');
                    let popupRemoveFromWishlist = document.querySelector('.popup-remove-from-wishlist');
                    let popupRemoveFromWishlistTitle = document.querySelector('.popup-remove-from-wishlist .popup-title');
                    // Popup title => Wishlist
                    popupRemoveFromWishlistTitle.innerHTML = 'Etes vous sur de vouloir supprimer <strong>' +
                        wishlistChannelSelected.getAttribute('data-attr-name') +
                        '</strong> depuis <strong>' + wishlist_selected.textContent + '</strong> ?'
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
            } else if (list_selected === 'wishlists' && popupAction === false) {
                popupAction = true;
                let popupCheckPinWishlist = document.querySelector('.popup-check-pin-wishlist');
                let popupPinInput = document.querySelector('.popup-check-pin-wishlist #pin-field-wishlist');
                popupCheckPinWishlist.classList.add('active');
                popupPinInput.focus();
            } else if (list_selected === 'buckets' && popupAction === false) {
                popupAction = true;
                let popupCheckPinBucket = document.querySelector('.popup-check-pin-buckets');
                let popupPinInput = document.querySelector('.popup-check-pin-buckets #pin-field-bucket');
                popupCheckPinBucket.classList.add('active');
                popupPinInput.focus();
            } else if (list_selected === 'channels' && popupAction === false) { // Sort channels by ASC or DESC
                let current = currentList[current_index]
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
            if (list_selected === 'channels' && channelSelected && popupAction === false) {
                if (currentList[current_index].classList.contains('checked')) {
                    currentList[current_index].classList.remove('checked')
                    currentList[current_index].innerHTML = currentList[current_index].getAttribute('data-attr-name')
                }
                if (currentList[current_index].classList.contains('move')) {
                    moveChannelAction = true;
                } else {
                    generalMoveAction = true;
                    addChannelToMove(currentList[current_index]);
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
    list_selected = 'channels';
    currentList = channels;
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
