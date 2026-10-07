document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if(!wasOpen){ item.classList.add('open'); }
    });
  });

  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      document.getElementById('formSuccess').classList.add('show');
      contactForm.reset();
    });
  }

  // photo upload in the contact form: validation, previews and removal
  (function(){
    var input = document.getElementById('cf-photos');
    if(!input) return;
    var drop = document.getElementById('uploadDrop');
    var list = document.getElementById('uploadList');
    var msg = document.getElementById('uploadMsg');
    var form = input.form;
    var MAX_FILES = 5, MAX_BYTES = 10 * 1024 * 1024;
    var files = [], urls = [];

    function isImage(f){ return /^image\//.test(f.type) || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(f.name); }
    function niceSize(b){ return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }

    // keep the real <input> in step so the files travel with the form when it is submitted
    function sync(){
      try {
        var dt = new DataTransfer();
        files.forEach(function(f){ dt.items.add(f); });
        input.files = dt.files;
      } catch(e) {}
    }

    function placeholderIcon(box){
      box.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
    }

    function render(){
      urls.forEach(function(u){ URL.revokeObjectURL(u); });
      urls = [];
      list.innerHTML = '';
      files.forEach(function(f, i){
        var li = document.createElement('li');
        li.className = 'upload-item';

        var thumb = document.createElement('span');
        thumb.className = 'upload-thumb';
        var img = document.createElement('img');
        var url = URL.createObjectURL(f);
        urls.push(url);
        img.alt = '';
        img.onerror = function(){ placeholderIcon(thumb); };
        img.src = url;
        thumb.appendChild(img);

        var meta = document.createElement('span');
        meta.className = 'upload-meta';
        var name = document.createElement('span');
        name.className = 'upload-name';
        name.textContent = f.name;
        var size = document.createElement('span');
        size.className = 'upload-size';
        size.textContent = niceSize(f.size);
        meta.appendChild(name);
        meta.appendChild(size);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'upload-remove';
        btn.setAttribute('aria-label', 'Remove ' + f.name);
        btn.innerHTML = '&times;';
        btn.addEventListener('click', function(){
          files.splice(i, 1);
          sync(); render();
          msg.textContent = '';
        });

        li.appendChild(thumb);
        li.appendChild(meta);
        li.appendChild(btn);
        list.appendChild(li);
      });
    }

    function add(picked){
      var problems = [];
      var tooMany = false;
      picked.forEach(function(f){
        if(!isImage(f)){ problems.push(f.name + ' is not an image.'); return; }
        if(f.size > MAX_BYTES){ problems.push(f.name + ' is over 10 MB.'); return; }
        if(files.some(function(x){ return x.name === f.name && x.size === f.size; })) return;
        if(files.length >= MAX_FILES){ tooMany = true; return; }
        files.push(f);
      });
      if(tooMany) problems.push('You can add up to ' + MAX_FILES + ' photos.');
      sync(); render();
      msg.textContent = problems.join(' ');
    }

    input.addEventListener('change', function(){
      add(Array.prototype.slice.call(input.files));
    });

    ['dragenter', 'dragover'].forEach(function(t){
      drop.addEventListener(t, function(e){ e.preventDefault(); drop.classList.add('is-dragover'); });
    });
    ['dragleave', 'drop'].forEach(function(t){
      drop.addEventListener(t, function(e){ e.preventDefault(); drop.classList.remove('is-dragover'); });
    });
    drop.addEventListener('drop', function(e){
      if(e.dataTransfer && e.dataTransfer.files) add(Array.prototype.slice.call(e.dataTransfer.files));
    });

    if(form) form.addEventListener('reset', function(){
      files = []; render(); msg.textContent = '';
    });
  })();

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
