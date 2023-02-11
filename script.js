let modalQt = 1
let modalKey = 0
let cart = []

// Listagem das Pizzas

pizzaJson.forEach((item, index) => {
    
    let pizzaItem = document.querySelector('.pizza-item').cloneNode(true)
    
    const pizzaPrice = item.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
    
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img 
    pizzaItem.querySelector('.pizza-item--price').innerHTML = pizzaPrice 
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()
        key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQt = 1
        modalKey = key

        document.querySelector('.pizzaInfo--actualPrice').innerHTML = pizzaPrice
        document.querySelector('.pizzaBig img').src = pizzaJson[key].img
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt
        
        document.querySelector('.pizzaWindowArea').style.opacity = 0
        document.querySelector('.pizzaWindowArea').style.display = 'flex'

        setTimeout(() => {
            document.querySelector('.pizzaWindowArea').style.opacity = 1
        }, 200)
        
    })

    document.querySelector('.pizza-area').append(pizzaItem)

})

const closeModal = () => {
    document.querySelector('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.display = 'none'
    }, 200)
}

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
        document.querySelector('.pizzaInfo--qt').innerHTML = --modalQt
    }
})

document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    document.querySelector('.pizzaInfo--qt').innerHTML = ++modalQt
})

document.querySelectorAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'))
    let identifier = `${pizzaJson[modalKey].id}@${size}`
    let key = cart.findIndex((item) => item.identifier == identifier)

    if(key > -1) {
        cart[key].qt += modalQt
    } else {

    cart.push({
        id: pizzaJson[modalKey].id,
        qt: modalQt,
        identifier,
        size
    })
  }
    updateCart()
    closeModal()
})

document.querySelector('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
     document.querySelector('aside').style.left = '0'
    }
 })

document.querySelector('.menu-closer').addEventListener('click', () => {
    document.querySelector('aside').style.left = '100vw'
})

function updateCart() {

    document.querySelector('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0) {
        document.querySelector('aside').classList.add('show')
        document.querySelector('.cart').innerHTML = ''

        let subTotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
            subTotal += pizzaItem.price * cart[i].qt
            let cartItem = document.querySelector('.cart--item').cloneNode(true)
            document.querySelector('.cart').append(cartItem)

            let pizzaSizeName 

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
                
                case 1: 
                    pizzaSizeName = 'M'
                    break 

                case 2:
                    pizzaSizeName = 'G'
                    break
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('.cart--item img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                ++cart[i].qt
                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                --cart[i].qt
                if(cart[i].qt < 1) {
                    cart.splice(i, 1)
                }
                updateCart()
            })
        }

        desconto = subTotal * 0.1
        total = subTotal - desconto

        document.querySelector('.subtotal span:last-child').innerHTML = subTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        document.querySelector('.desconto span:last-child').innerHTML = desconto.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        document.querySelector('.total span:last-child').innerHTML = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

    } else {
        document.querySelector('aside').classList.remove('show')
        document.querySelector('aside').style.left = '100vw'
    }
}
