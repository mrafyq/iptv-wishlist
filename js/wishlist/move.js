function addElementToMove(elementToMove) {
    elementToMove.classList.add("move")
    const iconMove = document.createElement('i');
    iconMove.setAttribute('class', 'arrow');
    elementToMove.appendChild(iconMove)
}

function moveWishlists(direction) {
    let elementsToMove = document.querySelectorAll('li.wishlist.move'),
        minOrderSelected, maxOrderSelected;
    minOrderSelected = parseInt(elementsToMove.item(0).getAttribute('data-order'))
    maxOrderSelected = parseInt(elementsToMove.item(elementsToMove.length - 1).getAttribute('data-order'))
    // select elements between min and max not selected
    let diff = getElementNotSelectedForMove(minOrderSelected, maxOrderSelected, direction);
    switch (direction) {
        case 'up':
            moveElementsToMove(elementsToMove, minOrderSelected, maxOrderSelected, diff, direction);
            break;
        case 'down':
            moveElementsToMove(elementsToMove, minOrderSelected, maxOrderSelected, diff, direction);
            break;
        default:
            console.log('no other direction managed')
    }
}

function getElementNotSelectedForMove(minOrder, maxOrder, direction) {
    let elementsNotSelectedToMove = document.querySelectorAll('li.wishlist')
    let count = 0;
    if (direction === 'up') {
        elementsNotSelectedToMove = [...elementsNotSelectedToMove];
        elementsNotSelectedToMove.reverse()
    }
    elementsNotSelectedToMove.forEach(element => {
        let elementOrder = parseInt(element.getAttribute('data-order'))
        if (elementOrder > minOrder && elementOrder < maxOrder && !element.classList.contains('move')) {
            switch (direction) {
                case 'up':
                    element.setAttribute('data-order', maxOrder - count)
                    element.style.order = maxOrder - count
                    break;
                case 'down':
                    element.setAttribute('data-order', minOrder + count)
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

function moveElementsToMove(elementsToMove, minOrderSelected, maxOrderSelected, diff, direction) {
    let diffUp = 0;
    if (diff === 0) {
        diff = 1;
        diffUp = diff;
        if (direction === 'up') {
            let prevElement = document.querySelector('li.wishlist[data-order="' + (minOrderSelected - 1) + '"]')
            if (prevElement) {
                prevElement.setAttribute('data-order', maxOrderSelected)
                prevElement.style.order = maxOrderSelected
            }
        } else if (direction === 'down') {
            let nextElement = document.querySelector('li.wishlist[data-order="' + (maxOrderSelected + 1) + '"]')
            if (nextElement) {
                nextElement.setAttribute('data-order', minOrderSelected)
                nextElement.style.order = minOrderSelected
            }
        }
    }
    console.log("moveElementsToMove diff: " + diff)
    console.log(direction)
    let countAll = document.querySelectorAll('li.wishlist')
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
        element.setAttribute('data-order', order)
        element.style.order = order
        countUp++
        diff++
    })
}

function saveMoveWishlist() {
    read().then(data => {
        if (data) {
            let i = 0;
            data.wishlists.forEach(element => {
                if (wishlist[i].getAttribute('data-id') == element.wishlist_id) {
                    element.order = parseInt(wishlist[i].getAttribute('data-order'))
                }
                i++
            })
            data.wishlists.sort((a, b) => (a.order > b.order) ? 1 : -1)
            fetchWishlists(data.wishlists)
            save(data)
        }
    })
}

// OLD method for mono move
// function moveWishlist(elementToMove, action = 'select') {
//     console.log(elementToMove)
//     let oldOrder = parseInt(elementToMove.getAttribute('data-order'))
//     switch (action) {
//         case "select":
//             console.log("select for move")
//             const iconMove = document.createElement('i');
//             iconMove.setAttribute('class', 'arrow');
//             elementToMove.classList.add("move")
//             elementToMove.appendChild(iconMove)
//             break;
//         case "moveUp":
//             console.log("move up")
//             let prevElement = document.querySelector('.wishlist[data-order="' + (oldOrder - 1) + '"]')
//             prevElement.setAttribute('data-order', oldOrder)
//             prevElement.style.order = oldOrder
//             elementToMove.setAttribute('data-order', oldOrder - 1)
//             elementToMove.style.order = oldOrder - 1
//             break;
//         case "moveDown":
//             console.log("move down")
//             let nextElement = document.querySelector('.wishlist[data-order="' + (oldOrder + 1) + '"]')
//             nextElement.setAttribute('data-order', oldOrder)
//             nextElement.style.order = oldOrder
//             elementToMove.setAttribute('data-order', oldOrder + 1)
//             elementToMove.style.order = oldOrder + 1
//             break;
//     }
// }
