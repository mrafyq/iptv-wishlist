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

const popupAddToWishlist = document.querySelector('.popup.popup-wishlist');

const popupPin = document.querySelector('.popup-check-pin-access');
const popupPinForm = document.querySelector('.popup-check-pin-access form');
const popupPinInput = document.querySelector('.popup-check-pin-access #pin-field');

document.addEventListener('keyup', function (e) {
    const key = e.key;
    console.log("key = " + key);

    updateCurrentList()

    let current_index = getCurrentIndex();

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
                switchBucketsWishlist(current_index)
                current_index = 0;
                currentList[current_index].classList.add('selected');
            } else if ((list_selected === 'buckets' || list_selected === 'wishlists') && popupAction === false) {
                listChannels0.setAttribute('data-attr-back-list', list_selected)
                listChannels0.setAttribute('data-attr-back-list-index', current_index.toString())
                listChannels0.innerHTML = '';
                groupName.setAttribute('list-selected', list_selected);
                document.querySelector('#searchForm').classList.add('visible');
                if (list_selected === 'buckets') {
                    let bucketId = currentList[current_index].getAttribute('data-id');
                    groupName.innerHTML = currentList[current_index].getAttribute('data-name');
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
                        groupName.innerHTML = currentList[current_index].getAttribute('data-name');
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
        case 'Escape':
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
            } else if (popupAction === true) {
                console.log("heeere")
                let popupActive = document.querySelector('.popup.active');
                popupActive.classList.remove('active');
                popupActive.classList.remove('error');
                popupAction = false;
                if (list_selected === 'checkboxes-channels') {
                    list_selected = 'channels'
                    document.querySelector('#list-channels .channel.selected').classList.remove('active');
                }
            } else if (channelSelected) { // unselect channel
                currentList[current_index].innerHTML = currentList[current_index].getAttribute('data-attr-name');
                currentList[current_index].classList.remove('checked')
                channelSelected = null
                manageChannelsAction(false)
            } else if (list_selected === 'buckets' || list_selected === 'wishlists') {
                escapeBucketsOrWishlists()
            } else if (list_selected === 'channels') {
                escapeChannels()
            }
            break;
        case 'ArrowRight':
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
        case 'ArrowLeft':
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
        case 'ArrowUp':
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
            if (list_selected === 'channels' && !generalMoveAction && popupAction === false) { // selectChannel for actions
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
        case '3':
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
                popupAddToWishlist.classList.add('active');
                currentList[current_index].classList.add('active')
                fillPopupAddToWishlist()
            }
            break;
        case '4':
            if (generalMoveAction === true) {
                return;
            } else if (list_selected === 'wishlists' && popupAction === false) { // Rename wishlist
                popupAction = true;
                callPopupRenameWishlist()
            } else if (list_selected === 'channels' && channelSelected && popupAction === false) { // Remove channel from wishlist
                popupAction = callPopupRemoveChannel()
            }
            break;
        case '5':
            if (generalMoveAction === true || channelSelected) {
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
            } else if (list_selected === 'channels'  && popupAction === false) { // Sort channels by ASC or DESC
                let current = currentList[current_index]
                let getAllChannels = document.querySelectorAll('#list-channels .channel');
                listChannels0.innerHTML = '';
                let newArr = getChannels(getAllChannels);

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
                    let normalArr= getChannels(getAllChannels);
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

function updateCurrentList() {
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
}

function getCurrentIndex() {
    for (let i = 0; i < currentList.length; i++) {
        if (currentList[i].classList.contains('selected')) {
            return i;
        }
    }
}

function escapeBucketsOrWishlists() {
    let current_index
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
    return current_index
}

function escapeChannels() {
    list_selected = listChannels0.getAttribute('data-attr-back-list');
    if (list_selected === 'buckets') {
        currentList = buckets;
    } else {
        currentList = wishlist;
    }
    document.getElementById('sidebar').style.display = "";
    document.getElementById('right-buttons').style.display = '';
    document.querySelector('#searchForm').classList.remove('visible');
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getItem(selector, display) {
    document.querySelector('.' + selector.getAttribute('data-list')).style.display = display;
}
