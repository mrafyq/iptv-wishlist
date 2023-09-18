function moveChannel (elementToMove, action = 'select') {
    console.log(elementToMove)
    var oldOrder =  parseInt(elementToMove.getAttribute('data-attr-order'))
    switch (action) {
        case "select":
            console.log("select for move")
            const iconMove = document.createElement('i');
            iconMove.setAttribute('class', 'arrow');
            elementToMove.classList.add("move")
            elementToMove.appendChild(iconMove)
            break;
        case "moveUp":
            console.log("move up")
            var prevElement = document.querySelector('.channel[data-attr-order="' + (oldOrder - 1) + '"]')
            prevElement.setAttribute('data-attr-order', oldOrder)
            prevElement.style.order = oldOrder
            elementToMove.setAttribute('data-attr-order', oldOrder - 1)
            elementToMove.style.order = oldOrder - 1
            break;
        case "moveDown":
            console.log("move down")
            var nextElement = document.querySelector('.channel[data-attr-order="' + (oldOrder + 1) + '"]')
            nextElement.setAttribute('data-attr-order', oldOrder)
            nextElement.style.order = oldOrder
            elementToMove.setAttribute('data-attr-order', oldOrder + 1)
            elementToMove.style.order = oldOrder + 1
            break;
    }
}
function saveMoveChannel(elementToMove) {
    read().then(data => {
        if (data) {
            var groupSelected = document.querySelector('.group-name');
            let listSelectedName = groupSelected.getAttribute('list-selected'),
            listSelectedId = parseInt(groupSelected.getAttribute('id'));
            if (listSelectedName === 'favoris') {
                const result = data.favoris.filter(wishlist => wishlist.favori_id == listSelectedId)[0];
                result.channels.forEach((channel, index) => {
                    if (channels[index].getAttribute('id') == channel.favori_id) {
                        channel.channel_order = parseInt(channels[index].getAttribute('data-attr-order'))
                    }
                })
                result.channels.sort((a, b) => (a.channel_order > b.channel_order) ? 1 : -1)
            } else if (listSelectedName === 'bouquets') {
                const result = data.bouquets.filter(bouquet => bouquet.bouquet_id == listSelectedId)[0];
                result.channels.forEach((channel, index) => {
                    if (channels[index].getAttribute('id') == channel.bouquet_id) {
                        channel.channel_order = parseInt(channels[index].getAttribute('data-attr-order'))
                    }
                })
                result.channels.sort((a, b) => (a.channel_order > b.channel_order) ? 1 : -1)
            }
            save(data)
            elementToMove.classList.remove('move')
            console.log(elementToMove)
            elementToMove.innerHTML = elementToMove.getAttribute('data-attr-name')
        }
    })
}

