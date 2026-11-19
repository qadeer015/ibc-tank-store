(function () {
  function bind(input) {
    if (!input || input.dataset.suggestBound) return;
    var form = input.form;
    if (!form) return;
    input.dataset.suggestBound = "1";

    var list = document.createElement("div");
    list.className = "ibc-search-suggest";
    list.hidden = true;
    list.setAttribute("role", "listbox");
    if (getComputedStyle(form).position === "static") form.style.position = "relative";
    form.appendChild(list);

    var timer = null;
    var active = -1;

    function close() {
      list.hidden = true;
      list.innerHTML = "";
      active = -1;
    }

    function choose(index) {
      var option = list.querySelectorAll("[data-suggest-name]")[index];
      if (!option) return;
      input.value = option.getAttribute("data-suggest-name");
      close();
      if (typeof form.requestSubmit === "function") form.requestSubmit();
      else form.submit();
    }

    input.addEventListener("input", function () {
      window.clearTimeout(timer);
      var query = input.value.trim();
      if (query.length < 2) {
        close();
        return;
      }
      timer = window.setTimeout(function () {
        fetch("/search/suggest?q=" + encodeURIComponent(query), { headers: { Accept: "application/json" } })
          .then(function (response) { return response.json(); })
          .then(function (data) {
            var items = data && data.suggestions ? data.suggestions : [];
            if (!items.length || input.value.trim() !== query) {
              close();
              return;
            }
            list.innerHTML = items.map(function (item) {
              var name = String(item.name || "");
              var category = item.category ? " · " + item.category : "";
              return '<button type="button" class="ibc-search-suggest-item" role="option" data-suggest-name="' +
                name.replace(/"/g, "&quot;") + '"><strong>' + name.replace(/[&<>]/g, function (char) {
                  return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char];
                }) + "</strong><span>" + category.replace(/[&<>]/g, function (char) {
                  return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char];
                }) + "</span></button>";
            }).join("");
            list.hidden = false;
            active = -1;
          })
          .catch(close);
      }, 180);
    });

    list.addEventListener("click", function (event) {
      var option = event.target.closest("[data-suggest-name]");
      if (!option) return;
      var options = Array.prototype.slice.call(list.querySelectorAll("[data-suggest-name]"));
      choose(options.indexOf(option));
    });

    input.addEventListener("keydown", function (event) {
      var options = list.querySelectorAll("[data-suggest-name]");
      if (list.hidden || !options.length) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        active = Math.min(active + 1, options.length - 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        active = Math.max(active - 1, 0);
      } else if (event.key === "Escape") {
        close();
        return;
      } else if (event.key === "Enter" && active >= 0) {
        event.preventDefault();
        choose(active);
        return;
      } else {
        return;
      }
      options.forEach(function (option, index) {
        option.classList.toggle("is-active", index === active);
      });
    });

    document.addEventListener("click", function (event) {
      if (!form.contains(event.target)) close();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('form[action="/search"] input[name="q"]').forEach(bind);
  });
})();
