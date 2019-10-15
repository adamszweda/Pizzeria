/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  const app = {
    initMenu: function(){
      const thisApp = this;

      console.log('thisApp.data', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();

      console.log('new Product:', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;
      const generateHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generateHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }

    initAccordion(){
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.accordionTrigger.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.element.classList.add('active');
        let activeProducts = document.querySelectorAll('.product.active');
        for(let activeProduct of activeProducts) {
          if(activeProduct != thisProduct.element) {
            activeProduct.classList.remove('active');
          }
        }
      });    
             
      /* find the clickable trigger (the element that should react to clicking) */

      /* START: click event listener to trigger */

      /* prevent default action for event */

      /* toggle active class on element of thisProduct */

      /* find all active products */

      /* START LOOP: for each active product */

      /* START: if the active product isn't the element of thisProduct */

      /* remove class active for the active product */

      /* END: if the active product isn't the element of thisProduct */

      /* END LOOP: for each active product */

      /* END: click event listener to trigger */
    } 

    initOrderForm() {
      const thisProduct = this;
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('form=', formData);
      let price = thisProduct.data.price;
      for( let paramId in thisProduct.data.params){
        const param = paramId;
        const product = thisProduct.data.params[paramId];
        console.log('product=', product);
        console.log('param=', param.options);
        for(let optionId in param.options){
          const option = optionId;
          console.log('optionId=', option);

          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          if(optionSelected && !option.default){
            price = price + option.price;
          }

        } 
      }
      console.log('price:', price);
      console.log('formData', formData);
    }

  }    

  app.init();
}
