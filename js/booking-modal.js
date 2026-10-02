/* Royal Horizon Voyages — Booking popup modal (v1)
   Injects the booking form modal into any page. Open via any element
   with class "open-booking" (optional data-package="..." to preselect).
   Submits via fetch to booking-handler.php (ajax=1 -> JSON). */
(function () {
  'use strict';
  if (window.__bkModalInit) return;
  window.__bkModalInit = true;

  var WA_NUMBER = '923349873000';

  var PACKAGES = [
    'Umrah Economy Package',
    'Umrah Premium Package',
    'Dubai Explorer Package',
    'Europe Highlights Package',
    'Hunza Skardu Package',
    'Turkey Magic Package',
    'Malaysia Singapore Package',
    'Maldives Honeymoon Package',
    'Customized Trip'
  ];

  var pkgOptions = PACKAGES.map(function (p) {
    return '<option>' + p + '</option>';
  }).join('');

  var modalHTML =
  '<div class="bk-overlay" id="bkOverlay" aria-hidden="true">' +
    '<div class="bk-dialog" role="dialog" aria-modal="true" aria-labelledby="bkTitle">' +
      '<div class="bk-head">' +
        '<div><h3 id="bkTitle">Book Your Trip</h3><p>Fill in your details — our team will call you back within 24 hours.</p></div>' +
        '<button type="button" class="bk-close" id="bkClose" aria-label="Close booking form">&times;</button>' +
      '</div>' +
      '<div class="bk-body" id="bkBody">' +
      '<form id="bkForm" action="booking-handler.php" method="post" novalidate>' +
        '<div class="b-section">' +
          '<div class="b-sec-head"><span class="b-num">1</span><div><h3>Trip Details</h3><p>Where and when do you want to travel?</p></div></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label for="bkPackage">Package / Destination *</label>' +
              '<select id="bkPackage" name="package" required><option value="">— Select a package —</option>' + pkgOptions + '</select></div>' +
            '<div class="form-group"><label>Travelers *</label>' +
              '<div class="steppers">' +
                '<div class="stepper"><span>Adults<small>12+ yrs</small></span>' +
                  '<div class="st-ctrl"><button type="button" data-step="adults" data-dir="-1" aria-label="Fewer adults">−</button>' +
                  '<input type="text" name="adults" id="bkAdults" value="2" readonly tabindex="-1">' +
                  '<button type="button" data-step="adults" data-dir="1" aria-label="More adults">+</button></div></div>' +
                '<div class="stepper"><span>Children<small>2–11 yrs</small></span>' +
                  '<div class="st-ctrl"><button type="button" data-step="children" data-dir="-1" aria-label="Fewer children">−</button>' +
                  '<input type="text" name="children" id="bkChildren" value="0" readonly tabindex="-1">' +
                  '<button type="button" data-step="children" data-dir="1" aria-label="More children">+</button></div></div>' +
                '<div class="stepper"><span>Infants<small>under 2</small></span>' +
                  '<div class="st-ctrl"><button type="button" data-step="infants" data-dir="-1" aria-label="Fewer infants">−</button>' +
                  '<input type="text" name="infants" id="bkInfants" value="0" readonly tabindex="-1">' +
                  '<button type="button" data-step="infants" data-dir="1" aria-label="More infants">+</button></div></div>' +
              '</div></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label for="bkDepart">Departure Date *</label>' +
              '<input type="date" id="bkDepart" name="departure" required></div>' +
            '<div class="form-group"><label for="bkReturn">Return Date *</label>' +
              '<input type="date" id="bkReturn" name="return_date" required></div>' +
          '</div>' +
          '<label class="check flexline"><input type="checkbox" name="flexible" value="yes" id="bkFlex"><span class="box"><svg viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"/></svg></span> My dates are flexible</label>' +
        '</div>' +
        '<div class="b-section">' +
          '<div class="b-sec-head"><span class="b-num">2</span><div><h3>Your Preferences</h3><p>Help us tailor the perfect trip for you.</p></div></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label>Hotel Category</label><div class="pills">' +
              '<label class="pill"><input type="radio" name="hotel" value="Any" checked><span>Any</span></label>' +
              '<label class="pill"><input type="radio" name="hotel" value="3 Star"><span>3★</span></label>' +
              '<label class="pill"><input type="radio" name="hotel" value="4 Star"><span>4★</span></label>' +
              '<label class="pill"><input type="radio" name="hotel" value="5 Star"><span>5★</span></label>' +
            '</div></div>' +
            '<div class="form-group"><label for="bkRoom">Room Type</label>' +
              '<select id="bkRoom" name="room"><option>Any</option><option>Single</option><option>Double</option><option>Triple</option><option>Quad</option><option>Family Suite</option></select></div>' +
          '</div>' +
          '<div class="form-group"><label>Services Needed</label><div class="checks cols4">' +
              '<label class="check"><input type="checkbox" name="services[]" value="Visa Assistance"><span class="box"><svg viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"/></svg></span>Visa Assistance</label>' +
              '<label class="check"><input type="checkbox" name="services[]" value="Flights"><span class="box"><svg viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"/></svg></span>Flights</label>' +
              '<label class="check"><input type="checkbox" name="services[]" value="Airport Transfers"><span class="box"><svg viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"/></svg></span>Airport Transfers</label>' +
              '<label class="check"><input type="checkbox" name="services[]" value="Travel Insurance"><span class="box"><svg viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"/></svg></span>Travel Insurance</label>' +
            '</div></div>' +
        '</div>' +
        '<div class="b-section">' +
          '<div class="b-sec-head"><span class="b-num">3</span><div><h3>Your Details</h3><p>Where should we reach you?</p></div></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label for="bkName">Full Name *</label><input type="text" id="bkName" name="full_name" required placeholder="e.g. Ahmed Khan" autocomplete="name"></div>' +
            '<div class="form-group"><label for="bkPhone">Phone / WhatsApp *</label><input type="tel" id="bkPhone" name="phone" required placeholder="03XX XXXXXXX" autocomplete="tel"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label for="bkEmail">Email *</label><input type="email" id="bkEmail" name="email" required placeholder="you@example.com" autocomplete="email"></div>' +
            '<div class="form-group"><label for="bkCity">City *</label><input type="text" id="bkCity" name="city" required placeholder="e.g. Islamabad"></div>' +
          '</div>' +
          '<div class="form-group"><label for="bkNotes">Special Requests</label>' +
            '<textarea id="bkNotes" name="requests" rows="3" placeholder="Anything else we should know? (optional)"></textarea></div>' +
        '</div>' +
        '<input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<input type="hidden" name="ajax" value="1">' +
        '<div class="bk-err" id="bkErr" role="alert"></div>' +
        '<button type="submit" class="btn btn-gold bk-submit" id="bkSubmit">Send Booking Request</button>' +
        '<p class="b-note">Prefer WhatsApp? <a href="https://wa.me/' + WA_NUMBER + '" target="_blank" rel="noopener">Chat with us directly</a></p>' +
      '</form>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="bk-toast" id="bkToast" role="status"></div>';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    var overlay = document.getElementById('bkOverlay');
    var dialog = overlay.querySelector('.bk-dialog');
    var closeBtn = document.getElementById('bkClose');
    var form = document.getElementById('bkForm');
    var errBox = document.getElementById('bkErr');
    var submitBtn = document.getElementById('bkSubmit');
    var pkgSel = document.getElementById('bkPackage');
    var depart = document.getElementById('bkDepart');
    var ret = document.getElementById('bkReturn');

    function openModal(pkg) {
      if (pkg) {
        var found = false;
        for (var i = 0; i < pkgSel.options.length; i++) {
          if (pkgSel.options[i].text === pkg) { pkgSel.selectedIndex = i; found = true; break; }
        }
        if (!found) pkgSel.selectedIndex = 0;
      }
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('bk-lock');
      closeBtn.focus();
    }
    function closeModal() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('bk-lock');
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('.open-booking');
      if (t) { e.preventDefault(); openModal(t.getAttribute('data-package')); }
    });
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    // date logic: no past dates, return >= departure
    var today = new Date().toISOString().split('T')[0];
    depart.min = today; ret.min = today;
    depart.addEventListener('change', function () {
      ret.min = depart.value || today;
      if (ret.value && ret.value < ret.min) ret.value = ret.min;
    });

    // clicking anywhere on the date field opens the calendar picker
    [depart, ret].forEach(function (inp) {
      inp.addEventListener('click', function () {
        try { inp.showPicker(); } catch (e) {}
      });
    });

    // "My dates are flexible": disable the date fields so no dates are needed
    var flexCb = document.getElementById('bkFlex');
    function syncFlex() {
      var dis = flexCb.checked;
      depart.disabled = dis; ret.disabled = dis;
      depart.required = !dis; ret.required = !dis;
      if (dis) { depart.value = ''; ret.value = ''; ret.min = today; }
      depart.closest('.form-group').classList.toggle('dimmed', dis);
      ret.closest('.form-group').classList.toggle('dimmed', dis);
    }
    flexCb.addEventListener('change', syncFlex);

    // steppers
    var counts = { adults: 2, children: 0, infants: 0 };
    var max = { adults: 20, children: 10, infants: 5 };
    var min = { adults: 1, children: 0, infants: 0 };
    var inputs = { adults: document.getElementById('bkAdults'), children: document.getElementById('bkChildren'), infants: document.getElementById('bkInfants') };
    form.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-step]');
      if (!b) return;
      var k = b.getAttribute('data-step');
      counts[k] = Math.min(max[k], Math.max(min[k], counts[k] + parseInt(b.getAttribute('data-dir'), 10)));
      inputs[k].value = counts[k];
    });

    function showErr(msg) {
      errBox.textContent = msg;
      errBox.style.display = 'block';
      errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function fmtDate(iso) {
      if (!iso) return '';
      var p = iso.split('-');
      if (p.length !== 3) return iso;
      return (+p[2]) + ' ' + (MONTHS[+p[1] - 1] || '') + ' ' + p[0];
    }
    function waUrl(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }
    function buildWaMessage(ref) {
      var lines = [];
      lines.push('*NEW BOOKING REQUEST* \u2014 Royal Horizon Voyages');
      if (ref) lines.push('Ref: ' + ref);
      lines.push('');
      lines.push('*TRIP DETAILS*');
      lines.push('Package: ' + pkgSel.value);
      var trav = [];
      var ad = +document.getElementById('bkAdults').value || 0;
      var ch = +document.getElementById('bkChildren').value || 0;
      var inf = +document.getElementById('bkInfants').value || 0;
      if (ad) trav.push(ad + (ad === 1 ? ' Adult' : ' Adults'));
      if (ch) trav.push(ch + (ch === 1 ? ' Child' : ' Children'));
      if (inf) trav.push(inf + (inf === 1 ? ' Infant' : ' Infants'));
      lines.push('Travelers: ' + (trav.join(', ') || '\u2014'));
      if (flexCb.checked) { lines.push('Dates: Flexible'); }
      else { lines.push('Departure: ' + fmtDate(depart.value)); lines.push('Return: ' + fmtDate(ret.value)); }
      lines.push('');
      lines.push('*PREFERENCES*');
      var hotelEl = form.querySelector('input[name="hotel"]:checked');
      lines.push('Hotel: ' + (hotelEl ? hotelEl.value : 'Any') + '  |  Room: ' + document.getElementById('bkRoom').value);
      var svcs = [];
      form.querySelectorAll('input[name="services[]"]:checked').forEach(function (c) { svcs.push(c.value); });
      if (svcs.length) lines.push('Services: ' + svcs.join(', '));
      lines.push('');
      lines.push('*CONTACT*');
      lines.push('Name: ' + document.getElementById('bkName').value.trim());
      lines.push('Phone: ' + document.getElementById('bkPhone').value.trim());
      lines.push('Email: ' + document.getElementById('bkEmail').value.trim());
      lines.push('City: ' + document.getElementById('bkCity').value.trim());
      var notes = document.getElementById('bkNotes').value.trim();
      if (notes) lines.push('Note: ' + notes);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errBox.style.display = 'none';
      if (!pkgSel.value) return showErr('Please select a package / destination.');
      var flex = flexCb.checked;
      if (!flex) {
        if (!depart.value) return showErr('Please choose a departure date (or tick "My dates are flexible").');
        if (!ret.value) return showErr('Please choose a return date (or tick "My dates are flexible").');
        if (ret.value < depart.value) return showErr('Return date cannot be before departure date.');
      }
      var name = document.getElementById('bkName');
      var phone = document.getElementById('bkPhone');
      var email = document.getElementById('bkEmail');
      var city = document.getElementById('bkCity');
      if (!name.value.trim()) return showErr('Please enter your full name.');
      if (!phone.value.trim()) return showErr('Please enter your phone number.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) return showErr('Please enter a valid email address.');
      if (!city.value.trim()) return showErr('Please enter your city.');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      // Open the WhatsApp tab inside the user gesture (popup-blocker safe);
      // it gets navigated to the real message once the booking is accepted.
      var waWin = null;
      try { waWin = window.open('', '_blank'); } catch (e) { waWin = null; }
      function sendWa(ref) {
        var url = waUrl(buildWaMessage(ref));
        if (waWin && !waWin.closed) { try { waWin.location.href = url; return; } catch (e) {} }
        window.open(url, '_blank');
      }
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.ok) {
            sendWa(d.ref);
            document.getElementById('bkBody').innerHTML =
              '<div class="bk-success"><div class="bk-tick">✓</div>' +
              '<h3>Request Received!</h3>' +
              '<p>Thank you, <b>' + escapeHtml(name.value.trim()) + '</b>. Your booking request <b>' + escapeHtml(d.ref) + '</b> has been emailed to us.</p>' +
              '<p>WhatsApp has been opened with your booking details — just press send there as well.</p>' +
              '<p>Our team will contact you within 24 hours to confirm your trip.</p>' +
              '<button type="button" class="btn btn-gold" id="bkDone">Done</button></div>';
            document.getElementById('bkDone').addEventListener('click', closeModal);
          } else {
            if (waWin && !waWin.closed) { try { waWin.close(); } catch (e) {} }
            showErr((d && d.error) || 'Something went wrong. Please try again or WhatsApp us.');
          }
        })
        .catch(function () {
          // fetch failed (e.g. offline) — still push the booking over WhatsApp,
          // then fall back to normal POST; handler redirects back with ?booking=
          sendWa('');
          var f = form.cloneNode(true);
          f.querySelector('input[name="ajax"]').value = '0';
          f.style.display = 'none';
          document.body.appendChild(f);
          f.submit();
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Booking Request';
        });
    });

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    // toast for non-AJAX fallback (?booking=success|error from handler redirect)
    var toast = document.getElementById('bkToast');
    function showToast(msg, ok) {
      toast.textContent = msg;
      toast.className = 'bk-toast show ' + (ok ? 'ok' : 'err');
      setTimeout(function () { toast.classList.remove('show'); }, 6000);
    }
    try {
      var q = new URLSearchParams(window.location.search);
      var st = q.get('booking');
      if (st === 'success') showToast('Booking request received! Our team will contact you within 24 hours.', true);
      else if (st === 'error') showToast('Booking could not be sent. Please try again or WhatsApp us.', false);
      if (st) {
        q.delete('booking');
        var url = window.location.pathname + (q.toString() ? '?' + q.toString() : '') + window.location.hash;
        window.history.replaceState(null, '', url);
      }
    } catch (e) { /* ignore */ }
  });
})();
