

function moveWishlist (elementToMove, action = 'select') {
    console.log(elementToMove)
    var oldOrder =  parseInt(elementToMove.getAttribute('data-order'))
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
            var prevElement = document.querySelector('.favoris[data-order="' + (oldOrder - 1) + '"]')
            prevElement.setAttribute('data-order', oldOrder)
            prevElement.style.order = oldOrder
            elementToMove.setAttribute('data-order', oldOrder - 1)
            elementToMove.style.order = oldOrder - 1
            break;
        case "moveDown":
            console.log("move down")
            var nextElement = document.querySelector('.favoris[data-order="' + (oldOrder + 1) + '"]')
            nextElement.setAttribute('data-order', oldOrder)
            nextElement.style.order = oldOrder
            elementToMove.setAttribute('data-order', oldOrder + 1)
            elementToMove.style.order = oldOrder + 1
            break;
    }
}
function saveMoveWishlist(elementToMove) {
    read().then(data => {
        if (data) {
            let i = 0;
            data.favoris.forEach(element => {
                if (favoris[i].getAttribute('data-id') == element.favori_id) {
                    element.order = parseInt(favoris[i].getAttribute('data-order'))
                }
                i++
            })
            data.favoris.sort((a, b) => (a.order > b.order) ? 1 : -1)
            fetchWishlists(data.favoris)
            save(data)
        }
    })
}

