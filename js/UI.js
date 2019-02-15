// UI.js
// eslint-disable-next-line no-var
class UI  {
  constructor(){

  }

  // SHOW NOTIFICATION IN MESSAGE AREA
  notify(message, type) {
    document.getElementById('updates-area').innerHTML = `<div class="update-${type}">Day ${Math.ceil(this.caravan.day)}: ${message}</div> ${document.getElementById('updates-area').innerHTML}`;
  };

  // REFRESH VISUAL CARAVAN STATS
  refreshStats() {
    // Destructure some objects for easy access
    const {
      day, distance, crew, oxen, food, money, firepower, weight, capacity,
    } = this.caravan;
    const { ceil, floor } = Math;

    // modify the dom
    document.getElementById('stat-day').innerHTML = `${ceil(day)}`; // Math.ceil(this.caravan.day);
    document.getElementById('stat-distance').innerHTML = `${floor(distance)}`;
    document.getElementById('stat-crew').innerHTML = `${crew}`;
    document.getElementById('stat-oxen').innerHTML = `${oxen}`;
    document.getElementById('stat-food').innerHTML = `${ceil(food)}`;
    document.getElementById('stat-money').innerHTML = `${money}`;
    document.getElementById('stat-firepower').innerHTML = `${firepower}`;
    document.getElementById('stat-weight').innerHTML = `${ceil(weight)}/${capacity}`;

    // update caravan position
    document.getElementById('caravan').style.left = `${(380 * distance / OregonH.FINAL_DISTANCE)}px`;
  };

  // SHOW ATTACK
  showAttack(firepower, gold) {
    const attackDiv = document.getElementById('attack');
    attackDiv.classList.remove('hidden');

    // keep properties
    this.firepower = firepower;
    this.gold = gold;

    // show firepower
    document.getElementById('attack-description').innerHTML = `Firepower: ${firepower}`;

    // init once
    if (!this.attackInitiated) {
      // fight
      document.getElementById('fight').addEventListener('click', this.fight.bind(this));

      // run away
      document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

      this.attackInitiated = true;
    }
  };

  // fight
  fight() {
    // console.log('Fight!');
    const { firepower, gold } = this;
    // damage can be 0 to 2 * firepower
    const damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.caravan.firepower));
    // check there are survivors
    if (damage < this.caravan.crew) {
      this.caravan.crew -= damage;
      this.caravan.money += gold;
      this.notify(`${damage} people were killed fighting`, 'negative');
      this.notify(`Found $ ${gold}`, 'gold');
    } else {
      this.caravan.crew = 0;
      this.notify('Everybody died in the fight', 'negative');
    }
    // resume journey
    document.getElementById('attack').classList.add('hidden');
    this.game.resumeJourney();
  };

  // runing away from enemy
  runaway() {
    // console.log('runway!')
    const { firepower } = this;
    // damage can be 0 to firepower / 2
    const damage = Math.ceil(Math.max(0, firepower * Math.random() / 2));
    // check there are survivors
    if (damage < this.caravan.crew) {
      this.caravan.crew -= damage;
      this.notify(`${damage} people were killed running`, 'negative');
    } else {
      this.caravan.crew = 0;
      this.notify('Everybody died running away', 'negative');
    }

    // remove event listener
    // document.getElementById('runaway').removeEventListener('click', this.runaway);

    // resume journey
    document.getElementById('attack').classList.add('hidden');
    this.game.resumeJourney();
  };

  // show shop
  showShop(products) {
    // get shop area
    const shopDiv = document.getElementById('shop');
    shopDiv.classList.remove('hidden');

    // init the shop just once
    if (!this.shopInitiated) {
      // event delegation
      shopDiv.addEventListener('click', (e) => {
        // what was clicked
        const target = e.target || e.src;

        // exit button
        if (target.tagName === 'BUTTON') {
          // resume journey
          shopDiv.classList.add('hidden');
          this.game.resumeJourney();
        } else if (target.tagName === 'DIV' && target.className.match(/product/)) {
          this.buyProduct({
            item: target.getAttribute('data-item'),
            qty: target.getAttribute('data-qty'),
            price: target.getAttribute('data-price'),
          });
        }
      });
      this.shopInitiated = true;
    }

    // clear existing content
    const prodsDiv = document.getElementById('prods');
    prodsDiv.innerHTML = '';

    // show products
    let product;
    for (let i = 0; i < products.length; i += 1) {
      product = products[i];
      prodsDiv.innerHTML += `<div class="product" data-qty="${product.qty}" data-item="${product.item}" data-price="${product.price}">${product.qty} ${product.item} - $${product.price}</div>`;
    }
  };

  // buy product
  buyProduct(product) {
    // check we can afford it
    if (product.price > this.caravan.money) {
      this.notify('Not enough money', 'negative');
      return false;
    }
    this.caravan.money -= product.price;
    this.caravan[product.it
    this.notify(`Bought ${product.qty} x ${product.item}`, 'positive');
    // update weight
    this.caravan.updateWeight();ss
    // update visuals
    this.refreshStats();
    return true;
  };


}
