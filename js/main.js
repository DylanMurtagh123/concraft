document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if(!wasOpen){ item.classList.add('open'); }
    });
  });

  // The enquiry form posts directly to FormSubmit, including without JavaScript.

  // burger menu: opens a list of every section; links scroll to the section
  (function(){
    var btn = document.getElementById('burgerBtn');
    var menu = document.getElementById('siteMenu');
    if(!btn || !menu) return;
    var backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);

    function setOpen(open){
      menu.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.documentElement.classList.toggle('menu-open', open);
    }
    btn.addEventListener('click', function(){ setOpen(!menu.classList.contains('is-open')); });
    backdrop.addEventListener('click', function(){ setOpen(false); });
    menu.addEventListener('click', function(e){ if(e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && menu.classList.contains('is-open')){ setOpen(false); btn.focus(); }
    });
  })();

  // custom cursor
  (function(){
    if(window.matchMedia('(pointer: coarse)').matches) return;
    var ring = document.getElementById('cursorRing');
    var dot = document.getElementById('cursorDot');
    var ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    var shown = false;

    window.addEventListener('mousemove', function(e){
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      if(!shown){
        ringX = mouseX; ringY = mouseY;
        shown = true;
      }
      ring.classList.add('active');
      dot.classList.add('active');
    });
    window.addEventListener('mouseleave', function(){
      ring.classList.remove('active');
      dot.classList.remove('active');
    });

    function animate(){
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animate);
    }
    animate();

    var hoverTargets = 'a, button, input, select, textarea, .svc2-card, .g-item, .faq-q, .rev-card';
    document.addEventListener('mouseover', function(e){
      if(e.target.closest(hoverTargets)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', function(e){
      if(e.target.closest(hoverTargets)) ring.classList.remove('hover');
    });
  })();  // bullet-point reveal animation
  (function(){
    var lists = document.querySelectorAll('.reveal-list');
    if(!('IntersectionObserver' in window)){
      lists.forEach(function(l){ l.classList.add('in-view'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    lists.forEach(function(l){ observer.observe(l); });
  })();
