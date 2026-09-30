/* ============================================================
   ROYAL DUTCH TRAVELS & TOURS — Interactions
   ============================================================ */
(function(){
  "use strict";
  var WA_NUMBER = "923009877300";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function(){
    setTimeout(function(){
      var p = document.getElementById("preloader");
      if(p) p.classList.add("done");
    }, 700);
  });
  // safety: never trap the user behind the preloader
  setTimeout(function(){
    var p = document.getElementById("preloader");
    if(p) p.classList.add("done");
  }, 4500);

  /* ---------- Sticky header ---------- */
  var nav = document.querySelector(".navbar");
  var toTop = document.getElementById("toTop");
  function onScroll(){
    var y = window.scrollY;
    if(nav) nav.classList.toggle("scrolled", y > 30);
    if(toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();
  if(toTop) toTop.addEventListener("click", function(){ window.scrollTo({top:0, behavior:"smooth"}); });

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if(toggle && links){
    // add close button for mobile drawer
    var closeBtn = document.createElement("button");
    closeBtn.className = "nav-close";
    closeBtn.setAttribute("aria-label","Close menu");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.display = "none";
    links.prepend(closeBtn);
    function syncClose(){ closeBtn.style.display = window.innerWidth <= 1020 ? "" : "none"; }
    syncClose(); window.addEventListener("resize", syncClose);
    toggle.addEventListener("click", function(){ links.classList.add("open"); document.body.style.overflow="hidden"; });
    closeBtn.addEventListener("click", closeMenu);
    links.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeMenu); });
    function closeMenu(){ links.classList.remove("open"); document.body.style.overflow=""; }
  }

  /* ---------- Active nav link ---------- */
  (function(){
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-links a").forEach(function(a){
      var href = (a.getAttribute("href")||"").toLowerCase();
      if(href === page || (page === "" && href === "index.html")) a.classList.add("active");
    });
  })();

  /* ---------- HERO SLIDER ---------- */
  (function(){
    var slides = document.querySelectorAll(".hero-slide");
    if(!slides.length) return;
    var dotsWrap = document.getElementById("heroDots");
    var cur = document.getElementById("heroCur");
    var idx = 0, timer = null, DELAY = 6500;

    slides.forEach(function(_, i){
      var d = document.createElement("button");
      d.setAttribute("aria-label","Go to slide "+(i+1));
      d.addEventListener("click", function(){ go(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(i){
      slides[idx].classList.remove("active");
      dots[idx].classList.remove("active");
      idx = (i + slides.length) % slides.length;
      // restart entrance animation by re-adding class
      var s = slides[idx];
      void s.offsetWidth;
      s.classList.add("active");
      dots[idx].classList.add("active");
      if(cur) cur.textContent = String(idx+1).padStart(2,"0");
    }
    function restart(){ clearInterval(timer); timer = setInterval(function(){ go(idx+1); }, DELAY); }

    var prev = document.getElementById("heroPrev");
    var next = document.getElementById("heroNext");
    if(prev) prev.addEventListener("click", function(){ go(idx-1); restart(); });
    if(next) next.addEventListener("click", function(){ go(idx+1); restart(); });

    // pause on hover
    var hero = document.getElementById("hero");
    if(hero){
      hero.addEventListener("mouseenter", function(){ clearInterval(timer); });
      hero.addEventListener("mouseleave", restart);
    }
    // touch swipe
    var sx = 0;
    hero.addEventListener("touchstart", function(e){ sx = e.touches[0].clientX; }, {passive:true});
    hero.addEventListener("touchend", function(e){
      var dx = e.changedTouches[0].clientX - sx;
      if(Math.abs(dx) > 50){ go(idx + (dx < 0 ? 1 : -1)); restart(); }
    }, {passive:true});

    go(0); restart();
  })();

  /* ---------- Counters ---------- */
  (function(){
    var els = document.querySelectorAll("[data-count]");
    if(!els.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1800, t0 = null;
        function tick(t){
          if(!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.innerHTML = Math.round(target * eased) + '<i>' + suffix + '</i>';
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, {threshold:.5});
    els.forEach(function(el){ io.observe(el); });
  })();

  /* ---------- Reveal on scroll ---------- */
  (function(){
    var els = document.querySelectorAll(".reveal");
    if(!els.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    els.forEach(function(el){ io.observe(el); });
  })();

  /* ---------- Testimonials ---------- */
  (function(){
    var slides = document.querySelectorAll(".testi-slide");
    if(!slides.length) return;
    var idx = 0, timer;
    function go(i){
      slides[idx].classList.remove("active");
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add("active");
    }
    function restart(){ clearInterval(timer); timer = setInterval(function(){ go(idx+1); }, 6000); }
    var p = document.getElementById("testiPrev"), n = document.getElementById("testiNext");
    if(p) p.addEventListener("click", function(){ go(idx-1); restart(); });
    if(n) n.addEventListener("click", function(){ go(idx+1); restart(); });
    restart();
  })();

  /* ---------- FAQ accordion ---------- */
  (function(){
    document.querySelectorAll(".faq-item").forEach(function(item){
      var q = item.querySelector(".faq-q"), a = item.querySelector(".faq-a");
      q.addEventListener("click", function(){
        var open = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function(o){
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = null;
        });
        if(!open){
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
    // open first by default
    var first = document.querySelector(".faq-item");
    if(first) first.querySelector(".faq-q").click();
  })();

  /* ---------- Gallery lightbox ---------- */
  (function(){
    var items = Array.prototype.slice.call(document.querySelectorAll(".gal-item"));
    if(!items.length) return;
    var lb = document.getElementById("lightbox");
    var img = lb.querySelector("img");
    var idx = 0;
    function show(i){
      idx = (i + items.length) % items.length;
      img.src = items[idx].querySelector("img").src;
      img.alt = items[idx].querySelector("img").alt || "";
    }
    items.forEach(function(it, i){
      it.addEventListener("click", function(){ show(i); lb.classList.add("open"); document.body.style.overflow="hidden"; });
    });
    function close(){ lb.classList.remove("open"); document.body.style.overflow=""; }
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function(e){ e.stopPropagation(); show(idx-1); });
    lb.querySelector(".lb-next").addEventListener("click", function(e){ e.stopPropagation(); show(idx+1); });
    lb.addEventListener("click", function(e){ if(e.target === lb) close(); });
    document.addEventListener("keydown", function(e){
      if(!lb.classList.contains("open")) return;
      if(e.key === "Escape") close();
      if(e.key === "ArrowLeft") show(idx-1);
      if(e.key === "ArrowRight") show(idx+1);
    });
  })();

  /* ---------- Enquiry / contact form -> WhatsApp ---------- */
  function sendToWhatsApp(form){
    var name = (form.querySelector("[name=name]")||{}).value || "";
    var phone = (form.querySelector("[name=phone]")||{}).value || "";
    var service = (form.querySelector("[name=service]")||{}).value || "";
    var msg = (form.querySelector("[name=message]")||{}).value || "";
    var text = "Assalam-o-Alaikum! I am " + name + " (" + phone + ").%0A" +
               "Service: " + service + "%0A" +
               "Message: " + msg;
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(decodeURIComponent(text)), "_blank");
  }
  document.querySelectorAll("form[data-wa-form]").forEach(function(f){
    f.addEventListener("submit", function(e){
      e.preventDefault();
      var btn = f.querySelector('button[type=submit]');
      var orig = btn ? btn.innerHTML : "";
      if(btn){ btn.innerHTML = "Opening WhatsApp…"; btn.disabled = true; }
      sendToWhatsApp(f);
      setTimeout(function(){
        if(btn){ btn.innerHTML = orig; btn.disabled = false; }
        f.reset();
      }, 1500);
    });
  });

  /* ---------- Package enquiry buttons ---------- */
  document.querySelectorAll("[data-pkg]").forEach(function(b){
    b.addEventListener("click", function(e){
      e.preventDefault();
      var pkg = b.getAttribute("data-pkg");
      window.open("https://wa.me/" + WA_NUMBER + "?text=" +
        encodeURIComponent("Assalam-o-Alaikum! I want to enquire about the '" + pkg + "' package. Please share details."), "_blank");
    });
  });

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if(yr) yr.textContent = new Date().getFullYear();
})();
