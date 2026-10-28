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

// Optional contact photos: preserve the normal FormSubmit multipart POST.
(function(){
  var form = document.getElementById('contactForm');
  var input = document.getElementById('cf-photos');
  if (!form || !input) return;
  var status = document.getElementById('cf-photos-status');
  var error = document.getElementById('cf-photos-error');
  var clear = document.getElementById('cf-photos-clear');
  function validatePhotos(){
    var files = Array.from(input.files);
    var total = files.reduce(function(sum, file){ return sum + file.size; }, 0);
    var message = '';
    if (files.length > 5) message = 'Please choose no more than 5 photos.';
    else if (total > 10000000) message = 'Your photos exceed 10 MB combined. Please choose smaller or fewer photos.';
    else if (files.some(function(file){
      return !/\.(jpe?g|png|webp)$/i.test(file.name) ||
        (file.type && !/^image\/(jpeg|png|webp)$/i.test(file.type));
    })) message = 'Please choose JPG, PNG or WebP photos. Convert HEIC photos to JPG first.';
    input.setCustomValidity(message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = message;
    status.textContent = files.length ? files.length + ' photo' + (files.length === 1 ? '' : 's') +
      ' selected (' + (total / 1000000).toFixed(2) + ' MB total): ' +
      files.map(function(file){ return file.name; }).join(', ') : '';
    clear.hidden = files.length === 0;
    return !message;
  }
  input.addEventListener('change', validatePhotos);
  clear.addEventListener('click', function(){ input.value = ''; validatePhotos(); input.focus(); });
  form.addEventListener('submit', function(event){
    if (!validatePhotos()) { event.preventDefault(); input.reportValidity(); }
  });
  // Separate named file fields follow FormSubmit's documented multi-file pattern.
  form.addEventListener('formdata', function(event){
    event.formData.delete('attachment');
    Array.from(input.files).forEach(function(file, index){
      event.formData.append('attachment' + (index + 1), file, file.name);
    });
  });
  form.addEventListener('reset', function(){
    input.value = '';
    validatePhotos();
  });
})();
