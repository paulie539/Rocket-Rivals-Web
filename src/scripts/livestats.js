(function () {
  'use strict';

  // astro:page-load fires after the first load AND after every client-side
  // navigation the ClientRouter performs.
  document.addEventListener('astro:page-load', function () {
    var tables = Array.prototype.slice.call(document.querySelectorAll('.rr-stats-table'));
    if (!tables.length) return;

    tables.forEach(function (table) {
      var headers = Array.prototype.slice.call(table.querySelectorAll('thead th'));
      var tbody = table.querySelector('tbody');

      headers.forEach(function (th, index) {
        th.addEventListener('click', function () {
          var isNumeric = th.dataset.type === 'number';
          var nextDir = th.dataset.dir === 'asc' ? 'desc' : 'asc';

          headers.forEach(function (h) {
            delete h.dataset.dir;
            h.classList.remove('is-sorted');
          });
          th.dataset.dir = nextDir;
          th.classList.add('is-sorted');

          var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
          rows.sort(function (a, b) {
            var aText = a.children[index].textContent.trim();
            var bText = b.children[index].textContent.trim();

            if (isNumeric) {
              var aNum = parseFloat(aText) || 0;
              var bNum = parseFloat(bText) || 0;
              return nextDir === 'asc' ? aNum - bNum : bNum - aNum;
            }

            return nextDir === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
          });

          rows.forEach(function (row) {
            tbody.appendChild(row);
          });
        });
      });
    });

    var seasonFilter = document.getElementById('livestats-season-filter');
    var leagueFilter = document.getElementById('livestats-league-filter');
    var search = document.getElementById('livestats-search');

    function applySearch() {
      if (!search) return;
      var query = search.value.trim().toLowerCase();
      var visibleTable = document.querySelector('.rr-stats-table[data-visible="true"]');
      if (!visibleTable) return;

      var rows = visibleTable.querySelectorAll('tbody tr');
      rows.forEach(function (row) {
        var name = row.children[0].textContent.trim().toLowerCase();
        row.classList.toggle('is-hidden', query !== '' && name.indexOf(query) === -1);
      });
    }

    function applyGroupFilter() {
      if (!seasonFilter || !leagueFilter) return;
      var season = seasonFilter.value;
      var league = leagueFilter.value;

      tables.forEach(function (table) {
        var matches = table.dataset.season === season && table.dataset.league === league;
        table.dataset.visible = matches ? 'true' : 'false';
      });

      if (search) search.value = '';
      applySearch();
    }

    if (seasonFilter) seasonFilter.addEventListener('change', applyGroupFilter);
    if (leagueFilter) leagueFilter.addEventListener('change', applyGroupFilter);
    if (search) search.addEventListener('input', applySearch);
  });
})();
