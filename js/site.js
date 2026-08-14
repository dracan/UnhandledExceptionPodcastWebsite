/*
 * Home page episode filtering.
 *
 * The server renders page 1 of the episode list. As soon as the visitor types a
 * query or picks a tag chip we swap in results filtered from /episodes.json,
 * and swap the server-rendered markup back when the filter is cleared. Without
 * JS the chips are still plain links to their tag pages.
 */
(function () {
  "use strict";

  var home = document.getElementById("home");
  if (!home) return;

  var input = document.getElementById("ep-search");
  var tagRow = document.getElementById("tag-row");
  var list = document.getElementById("episode-list");
  var status = document.getElementById("list-count");
  var paginationWrap = document.getElementById("pagination-wrap");
  if (!input || !tagRow || !list || !status) return;

  var PLAY_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-play">' +
    '<polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';

  var totalEpisodes = parseInt(home.dataset.episodeCount, 10) || 0;
  var pristineList = list.innerHTML;
  var episodes = null;
  var loading = null;
  var query = "";
  var activeTag = "";
  var debounce = null;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function load() {
    if (episodes) return Promise.resolve(episodes);
    if (!loading) {
      var version = home.dataset.episodesVersion;
      loading = fetch("/episodes.json" + (version ? "?v=" + version : ""))
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          episodes = data;
          return data;
        })
        .catch(function () {
          episodes = [];
          return episodes;
        });
    }
    return loading;
  }

  function matches(ep) {
    if (activeTag) {
      var wanted = activeTag.toLowerCase();
      var hit = (ep.tg || []).some(function (t) {
        return String(t).toLowerCase() === wanted;
      });
      if (!hit) return false;
    }
    if (!query) return true;
    var haystack = [ep.t, ep.g, ep.b, ep.l, (ep.tg || []).join(" ")].join(" ").toLowerCase();
    return query.split(/\s+/).every(function (term) {
      return haystack.indexOf(term) !== -1;
    });
  }

  function rowHtml(ep) {
    var tags = (ep.tg || []).slice(0, 4);
    return (
      '<a class="ep" href="' + escapeHtml(ep.u) + '">' +
      '<div class="cover' + (ep.f ? "" : " is-fallback") + '">' +
      '<img src="' + escapeHtml(ep.c) + '"' +
      (ep.ss ? ' srcset="' + escapeHtml(ep.ss) + '" sizes="(max-width: 650px) 72px, (max-width: 1025px) 144px, 160px"' : "") +
      ' alt="" loading="lazy" width="160" height="160" />' +
      '<div class="overlay"><span class="btn">' + PLAY_ICON + "</span></div>" +
      "</div>" +
      '<div class="body">' +
      '<div class="meta">' +
      (ep.l ? '<span class="num">' + escapeHtml(ep.l) + '</span><span class="dot"></span>' : "") +
      "<span>" + escapeHtml(ep.d) + "</span>" +
      "</div>" +
      '<h3 class="title">' + escapeHtml(ep.t) + "</h3>" +
      (ep.g ? '<div class="guest"><span class="with">with </span>' + escapeHtml(ep.g) + "</div>" : "") +
      (ep.b ? '<p class="blurb">' + escapeHtml(ep.b) + "</p>" : "") +
      (tags.length
        ? '<div class="taglist">' +
          tags
            .map(function (t) {
              return '<span class="t">#' + escapeHtml(t) + "</span>";
            })
            .join("") +
          "</div>"
        : "") +
      "</div></a>"
    );
  }

  function setPaginationVisible(visible) {
    if (paginationWrap) paginationWrap.hidden = !visible;
  }

  function showPristine() {
    list.innerHTML = pristineList;
    status.textContent = totalEpisodes + " episodes";
    setPaginationVisible(true);
  }

  function render() {
    if (!query && !activeTag) {
      showPristine();
      return;
    }

    setPaginationVisible(false);
    load().then(function (data) {
      if (!query && !activeTag) {
        showPristine();
        return;
      }

      var hits = data.filter(matches);
      list.innerHTML = hits.length
        ? hits.map(rowHtml).join("")
        : '<p class="eps-empty">No episodes match that. Try a different search or tag.</p>';

      var label;
      if (query && activeTag) {
        label = hits.length + ' results for "' + query + '" in #' + activeTag;
      } else if (query) {
        label = hits.length + ' results for "' + query + '"';
      } else {
        label = hits.length + " episodes tagged #" + activeTag;
      }
      status.textContent = label;
    });
  }

  function syncChips() {
    var chips = tagRow.querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) {
      var tag = chips[i].dataset.tag || "";
      chips[i].classList.toggle("active", tag.toLowerCase() === activeTag.toLowerCase());
    }
  }

  tagRow.addEventListener("click", function (event) {
    var chip = event.target.closest(".chip");
    if (!chip || !("tag" in chip.dataset)) return;
    event.preventDefault();
    var tag = chip.dataset.tag || "";
    activeTag = tag.toLowerCase() === activeTag.toLowerCase() ? "" : tag;
    syncChips();
    render();
  });

  input.addEventListener("input", function () {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(function () {
      query = input.value.trim().toLowerCase();
      render();
    }, 120);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      input.value = "";
      query = "";
      render();
    }
  });

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      input.focus();
      input.select();
    }
  });

  // Warm the index once the page is idle so the first keystroke feels instant.
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(load);
  } else {
    window.setTimeout(load, 1500);
  }
})();
