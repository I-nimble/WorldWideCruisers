/*
 * 2007-2022 PayPal
 *
 *  NOTICE OF LICENSE
 *
 *  This source file is subject to the Academic Free License (AFL 3.0)
 *  that is bundled with this package in the file LICENSE.txt.
 *  It is also available through the world-wide-web at this URL:
 *  http://opensource.org/licenses/afl-3.0.php
 *  If you did not receive a copy of the license and are unable to
 *  obtain it through the world-wide-web, please send an email
 *  to license@prestashop.com so we can send you a copy immediately.
 *
 *  DISCLAIMER
 *
 *  Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 *  versions in the future. If you wish to customize PrestaShop for your
 *  needs please refer to http://www.prestashop.com for more information.
 *
 *  @author 2007-2022 PayPal
 *  @author 202 ecommerce <tech@202-ecommerce.com>
 *  @copyright PayPal
 *  @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 */
// init incontext

const BNPL = {

  idProduct: null,

  combination: null,

  productQuantity: null,

  page: null,

  button: null,

  controller: sc_init_url,

  controllerScOrder: scOrderUrl,

  color: null,

  init() {
    this.updateInfo();
    BNPL.checkProductAvailability();
    prestashop.on('updatedProduct', function(e, xhr, settings) {
      BNPL.checkProductAvailability();
    });
  },

  updateInfo() {
    this.page = $('[data-container-bnpl]').data('paypal-bnpl-source-page');
    this.button = document.querySelector('[paypal-bnpl-button-container]');

    if (this.page == 'product') {
      this.productQuantity = $('input[name="qty"]').val();
      this.idProduct = $('[data-paypal-bnpl-id-product]').val();
      this.combination = this.getCombination();
    }
  },

  getCombination() {
    let combination = [],
      re = /group\[([0-9]+)\]/;

    $.each($('#add-to-cart-or-refresh').serializeArray(), (key, item) => {
      if(res = item.name.match(re)) {
        combination.push(`${res[1]} : ${item.value}`);
      }
    });

    return combination;
  },

  initButton() {

    totPaypalBnplSdkButtons.Buttons({
      fundingSource: totPaypalBnplSdkButtons.FUNDING.PAYLATER,

      style: {
        label: 'pay',
        height: 35,
        color: BNPL.getColor()
      },

      createOrder: function(data, actions) {
        return BNPL.getIdOrder();
      },

      onApprove: function(data, actions) {
        BNPL.sendData(data);
      },

    }).render(this.button);
  },

  getColor() {
    if (BNPL.color) {
      return BNPL.color;
    }

    return 'white';
  },

  setColor(color) {
    BNPL.color = color;
  },

  sendData(data) {
    let form = document.createElement('form');
    let input = document.createElement('input');

    input.name = "paymentData";
    input.value = JSON.stringify(data);

    form.method = "POST";
    form.action = BNPL.controllerScOrder;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  },

  getIdOrder() {
    let data = new Object();
    let url = new URL(this.controller);
    url.searchParams.append('ajax', '1');
    url.searchParams.append('action', 'CreateOrder');
    this.updateInfo();
    data['page'] = this.page;


    if (this.page == 'product') {
      data['idProduct'] = this.idProduct;
      data['quantity'] = this.productQuantity;
      data['combination'] = this.combination.join('|');
    }

    return fetch(url.toString(), {
      method: 'post',
      headers: {
        'content-type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      if (data.success) {
        return data.idOrder;
      }
    });
  },

  checkProductAvailability() {
    if (this.page == 'payment-step') {
      return true;
    }

    let data = new Object();
    let url = new URL(this.controller);
    url.searchParams.append('ajax', '1');
    url.searchParams.append('action', 'CheckAvailability');
    this.updateInfo();
    data['page'] = this.page;

    if (this.page == 'product') {
      data['idProduct'] = this.idProduct;
      data['quantity'] = this.productQuantity;
      data['combination'] = this.combination.join('|');
    }

    fetch(url.toString(),
      {
        method: 'post',
        headers: {
          'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
      }).then(function(res){
        return res.json();
    }).then(function (json) {
      if (json.success) {
        BNPL.button.style.display = 'block';
      } else {
        BNPL.button.style.display = 'none';
      }
    });
  },

  getStyleSetting() {
    // Returns a default styles if styleSetting is not setted
    if (this.styleSetting === null) {
      return {
        label: 'buynow',
        height: 35
      };
    }

    return this.styleSetting;
  },

};

window.BNPL = BNPL;

