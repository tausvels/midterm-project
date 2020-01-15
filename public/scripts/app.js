const { helpers } = ('./helpers.js')

$(document).ready(() =>{

  let globalData;

// Menu Creation Functions
  const createMenuItem = function (data) {
    const menuItem = `
      <div class="menu-item">
        <div class="card">
          <img class="menu-item-image" src="${data.image_url}" alt="Card image cap">
          <div class="item-body">
            <span class="item-text">${data.name}</span>
            <span class="item-price">$${data.price}.00</span>
            <div class="quantity" data-value="${data.id}">
              <button class="plus-btn" type="button" name="button">
              <img class="plus" src="../img/plus.png" alt="" />
              </button>
              <input class="item-num" type="text" name="name" value="0">
              <button class="minus-btn" type="button" name="button">
              <img class="minus" src="../img/minus.png" alt="" />
              </button>
              <button class="add-to-cart" disabled>Add to Cart</button>
              <button class="remove-from-cart" disabled>Remove from Cart</button>
            </div>
          </div>
        </div>
      </div>
    `
    return menuItem;
  };


  const createOrderItem = function (localKey) {
    const quantity = window.localStorage.getItem(localKey);
    const name = globalData.find(e => e.id == localKey).name;
    const price = globalData.find(e => e.id == localKey).price;
    const totalPrice = (price * quantity);
    const orderItem = `
    <div class="each-item">
      <span class="quantity">Qty: ${quantity}</span>
      <span class="Item">${name}</span>
      <span class="price">Total: $${totalPrice}.00</span>
    </div>
    `
    return {orderItem, totalPrice}
  };

  const renderMenuItems = (data) => {
    const domContainer = $(`.menu-container`);
    domContainer.empty();
    data.forEach(index => {
      const menuItem = createMenuItem(index);
      domContainer.append(menuItem)
    });
  };

  const renderOrderItems = (locStor) => {
    const domContainer = $('.order-items');
    domContainer.empty();
    let orderTotal = 0;
    for (let i = 0; i < locStor.length; i++) {
      const localKey = JSON.parse(locStor.key(i));
      const menuItem = createOrderItem(localKey);
      domContainer.append(menuItem.orderItem)
      orderTotal += menuItem.totalPrice;
    }
    $('#order-total').html(orderTotal);
  };

  const loadMenuItems = () => {
    const get_url = `/menu`;
    const request_method = `GET`;
    $.ajax({
      url: get_url,
      method: request_method
    })
    .done((result) => {
      globalData = result.data;
      renderMenuItems(globalData);
      updateQuantity();
    })
    .catch(e => console.error(e));
  };

  const checkoutOrder = () => {
    const post_url = '/checkout';
    const request_method = 'POST';
    const checkoutCart = getPropertiesFromLocalStorage();
    $.ajax({
      url: post_url,
      method: request_method,
      data: checkoutCart
    })
    .catch(e => console.error(e));
  };

  // Click Handlers for Menu Items
  $(document).on("click", ".add-to-cart", function() {
    const $this = $(this);
    const $input = $this.closest('div.quantity').find("input");
    const $id = $this.closest('div.quantity').data("value");
    const quantity = parseInt($input.val());
    JSON.stringify(localStorage.setItem($id, quantity));
    updateCart();
    renderOrderItems(localStorage);
    $('.order-container:hidden')
    .animate({width: 'toggle'});
  });

  $(document).on("click", ".remove-from-cart", function() {
    const $this = $(this);
    const $id = $this.closest('div.quantity').data("value");
    const $input = $this.closest('div').find('input');
    let value = parseInt($input.val());
    window.localStorage.removeItem($id);
    updateCart();
    renderOrderItems(localStorage);
    value = 0;
    $input.val(value);
  });

  $(document).on('click', '.minus-btn', function(event) {
    event.preventDefault();
    const $this = $(this);
    const $input = $this.closest('div').find('input');
    let value = parseInt($input.val());
    const $addToCartBtn = $(this).siblings("button")[1];
    const $RemoveFromCartBtn = $(this).siblings("button")[2];
    if (value >= 1) {
      $($addToCartBtn).text(`Update Cart`);
      value--;
      if (value === 0) {
        $($addToCartBtn).text(`Update Cart`);
        $($RemoveFromCartBtn).attr('disabled', true)
      }
    }
  $input.val(value);
  });

  $(document).on('click', '.plus-btn', function(event) {
    event.preventDefault();
    const $this = $(this);
    const $input = $this.closest('div').find('input');
    let value = parseInt($input.val());
    const $addToCartBtn = $(this).siblings("button")[1];
    const $RemoveFromCartBtn = $(this).siblings("button")[2];
    $($addToCartBtn).attr('disabled', false)
    $($RemoveFromCartBtn).attr('disabled', false)
    if (value <= 100) {
      value++;
    }
  $input.val(value);
  });

  //Click Handler for Order
  $(document).on('click', '.hide-cart', function(event) {
    event.preventDefault();
    $('.order-container')
    .animate({width: 'toggle'});
  });

  $(window).bind("beforeunload", function() {
    return confirm("Your cart will be lost if you leave this page. Are you sure you want to leave?");
  });

  $(window).on("unload", function() {
    window.localStorage.clear();
  });

  $(".empty-cart").on('click', function(){
    if (confirm("Are you sure?")) {
      window.localStorage.clear();
      $('.order-items').empty();
      $('#order-total').text('0');
    } else {
      return false;
    };
  });

  loadMenuItems();
  updateCart();
  $('.order-container').hide();

  $(document).on('click', '.checkout', function(event) {
    checkoutOrder();
  })

});

