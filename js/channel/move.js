const moveChannelActionButton = document.querySelector('.move-channel-action')

moveChannelActionButton.addEventListener('click', (e) => {
    if (list_selected === 'channels' && channelSelected && popupAction === false) {
        manageMove(currentList[getCurrentIndex()])
    }
})

function manageMove(currenElement) {
    let label
    if (currenElement.classList.contains('move')) {
        removeChannelFromMove(currenElement)
        label = 'Sélectionner'
    } else {
        generalMoveAction = true;
        addChannelToMove(currenElement);
        hideChannelsActionForMove()
        label = 'Désélectionner'
    }
    changeChannelMoveLabel(label)
}

function addChannelToMove(elementToMove) {
    elementToMove.classList.add("move")
    elementToMove.innerHTML = elementToMove.getAttribute('data-attr-name')
    const iconMove = document.createElement('i');
    iconMove.setAttribute('class', 'arrow');
    elementToMove.appendChild(iconMove)
}

function removeChannelFromMove(elementToMove) {
    elementToMove.classList.remove("move")
    elementToMove.innerHTML = elementToMove.getAttribute('data-attr-name')
}

function moveChannels(direction) {
    let elementsToMove = document.querySelectorAll('li.channel.move'),
        minOrderSelected, maxOrderSelected;
    minOrderSelected = parseInt(elementsToMove.item(0).getAttribute('data-attr-order'))
    maxOrderSelected = parseInt(elementsToMove.item(elementsToMove.length - 1).getAttribute('data-attr-order'))
    // select elements between min and max not selected
    let diff = getChannelsNotSelectedForMove(minOrderSelected, maxOrderSelected, direction);
    switch (direction) {
        case 'up':
            moveChannelsToMove(elementsToMove, minOrderSelected, maxOrderSelected, diff, direction);
            break;
        case 'down':
            moveChannelsToMove(elementsToMove, minOrderSelected, maxOrderSelected, diff, direction);
            break;
        default:
            console.log('no other direction managed')
    }
}

function getChannelsNotSelectedForMove(minOrder, maxOrder, direction) {
    let elementsNotSelectedToMove = document.querySelectorAll('li.channel')
    let count = 0;
    if (direction === 'up') {
        elementsNotSelectedToMove = [...elementsNotSelectedToMove];
        elementsNotSelectedToMove.reverse()
    }
    elementsNotSelectedToMove.forEach(element => {
        let elementOrder = parseInt(element.getAttribute('data-attr-order'))
        if (elementOrder > minOrder && elementOrder < maxOrder && !element.classList.contains('move')) {
            switch (direction) {
                case 'up':
                    element.setAttribute('data-attr-order', maxOrder - count)
                    element.style.order = maxOrder - count
                    break;
                case 'down':
                    element.setAttribute('data-attr-order', minOrder + count)
                    element.style.order = minOrder + count
                    break;
                default:
                    console.log('no other direction managed')
            }
            count++;
        }
    })
    return count;
}

function moveChannelsToMove(elementsToMove, minOrderSelected, maxOrderSelected, diff, direction) {
    let diffUp = 0;
    if (diff === 0) {
        diff = 1;
        diffUp = diff;
        if (direction === 'up') {
            let prevElement = document.querySelector('li.channel[data-attr-order="' + (minOrderSelected - 1) + '"]')
            if (prevElement) {
                prevElement.setAttribute('data-attr-order', maxOrderSelected)
                prevElement.style.order = maxOrderSelected
            }
        } else if (direction === 'down') {
            let nextElement = document.querySelector('li.channel[data-attr-order="' + (maxOrderSelected + 1) + '"]')
            if (nextElement) {
                nextElement.setAttribute('data-attr-order', minOrderSelected)
                nextElement.style.order = minOrderSelected
            }
        }
    }
    console.log("moveElementsToMove diff: " + diff)
    console.log(direction)
    let countAll = document.querySelectorAll('li.channel')
    let countUp = 0;
    let countDown = elementsToMove.length;
    elementsToMove.forEach(element => {
        countDown--
        let order;
        if (direction === 'up') {
            order = Math.max(minOrderSelected - diffUp + countUp, countUp + 1)
        } else if (direction === 'down') {
            order = Math.min(minOrderSelected + diff, countAll.length - countDown)
        }
        element.setAttribute('data-attr-order', order)
        element.style.order = order
        countUp++
        diff++
        makeActiveElementOnMiddleOfScreen(element);
    })
}

function saveMoveChannel() {
    read().then(data => {
        if (data) {
            let groupSelected = document.querySelector('.group-name');
            let listSelectedName = groupSelected.getAttribute('list-selected'),
            listSelectedId = parseInt(groupSelected.getAttribute('id'));
            if (listSelectedName === 'wishlists') {
                const result = data.wishlists.filter(wishlist => wishlist.wishlist_id == listSelectedId)[0];
                result.channels.forEach((channel, index) => {
                    if (channels[index].getAttribute('id') == channel.wishlist_id) {
                        channel.channel_order = parseInt(channels[index].getAttribute('data-attr-order'))
                    }
                })
                result.channels.sort((a, b) => (a.channel_order > b.channel_order) ? 1 : -1)
                fetchChannels(result.channels)
            } else if (listSelectedName === 'buckets') {
                const result = data.buckets.filter(bucket => bucket.bucket_id == listSelectedId)[0];
                result.channels.forEach((channel, index) => {
                    if (channels[index].getAttribute('id') == channel.bucket_id) {
                        channel.channel_order = parseInt(channels[index].getAttribute('data-attr-order'))
                    }
                })
                result.channels.sort((a, b) => (a.channel_order > b.channel_order) ? 1 : -1)
                fetchChannels(result.channels)
            }
            save(data)
        }
    })
}

function cancelChannelsMove() {
    for (const element of channels) {
        if (element.classList.contains('move')) {
            element.classList.remove('move');
            element.innerHTML = element.getAttribute('data-attr-name');
        }
    }
    read().then(data => {
        if (data) {
            let groupSelected = document.querySelector('.group-name'),
                listSelectedName = groupSelected.getAttribute('list-selected'),
                listSelectedId = parseInt(groupSelected.getAttribute('id'));
            if (listSelectedName === 'wishlists') {
                const result = data.wishlists.filter(wishlist => wishlist.wishlist_id == listSelectedId)[0];
                fetchChannels(result.channels)
            } else if (listSelectedName === 'buckets') {
                const result = data.buckets.filter(bucket => bucket.bucket_id == listSelectedId)[0];
                result.channels.sort((a, b) => (a.channel_order > b.channel_order) ? 1 : -1)
                fetchChannels(result.channels)
            }
        }
    })
}

function changeChannelMoveLabel(label = 'Déplacer (6)') {
    document.querySelector('.move-channel-action').innerHTML = '<div class="dot blue"> </div> ' + label + '</div>'
}
