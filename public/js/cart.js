(function () {
  var currency = (document.querySelector('[data-cart-subtotal]') || {}).textContent || '';
  var currencyLabel = currency.trim().split(' ')[0] || 'PKR';

  function money(amount) {
    return currencyLabel + ' ' + Number(amount || 0).toLocaleString('en-PK');
  }

  function setStatus(message) {
    var status = document.getElementById('cart-status');
    if (status) status.textContent = message || '';
  }

  function setHeaderCount(count) {
    document.querySelectorAll('.ibc-cart-link').forEach(function (link) {
      link.setAttribute('aria-label', 'Cart, ' + count + ' items');
      var badge = link.querySelector('.ibc-cart-count');
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'ibc-cart-count';
          link.appendChild(badge);
        }
        badge.textContent = count > 99 ? '99+' : String(count);
      } else if (badge) {
        badge.remove();
      }
    });
  }

  function apply(row, data) {
    if (data.removed) {
      row.remove();
      if (!document.querySelector('[data-cart-item]')) window.location.reload();
    } else {
      var input = row.querySelector('input[name="quantity"]');
      if (input) input.value = data.quantity;
      var line = row.querySelector('[data-line-total]');
      if (line) line.textContent = money(data.lineTotal);
    }
    var subtotal = document.querySelector('[data-cart-subtotal]');
    if (subtotal) subtotal.textContent = money(data.subtotal);
    setHeaderCount(data.count);
    setStatus('');
  }

  function send(url, quantity) {
    var body = new URLSearchParams();
    if (quantity != null) body.set('quantity', String(quantity));
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok || !data.success) throw new Error(data.message || 'Could not update the cart.');
        return data;
      });
    });
  }

  document.querySelectorAll('[data-qty-form]').forEach(function (form) {
    var row = form.closest('[data-cart-item]');
    var input = form.querySelector('input[name="quantity"]');

    function update(next) {
      input.value = Math.max(0, next);
      setStatus('');
      send(form.action, input.value).then(function (data) {
        apply(row, data);
      }).catch(function (error) {
        setStatus(error.message);
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      update(Number(input.value));
    });

    form.querySelectorAll('[data-qty-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        update(Number(input.value) + Number(button.getAttribute('data-qty-step')));
      });
    });
  });

  document.querySelectorAll('form[action$="/remove"]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var row = form.closest('[data-cart-item]');
      send(form.action).then(function (data) {
        apply(row, Object.assign({ removed: true }, data));
      }).catch(function (error) {
        setStatus(error.message);
      });
    });
  });
})();
