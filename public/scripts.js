document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('nav ul li.menu');
  const menuList = menu.querySelector('.menuList');

  menu.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent window click from firing immediately
    if (menuList.style.display === 'block') {
      slideUp(menuList, 400);
    } else {
      slideDown(menuList, 400);
    }
  });

  window.addEventListener('click', () => {
    if (menuList.style.display === 'block') {
      slideUp(menuList, 400);
    }
  });
  const flashMessages = document.querySelectorAll('.flash-message');
    
  flashMessages.forEach(msg => {
      setTimeout(() => {
          msg.classList.add('hide');
          setTimeout(() => {
              msg.style.display = 'none';
          }, 500); // match CSS transition
      }, 5000); // show for 5 seconds
  });

  const quickLinks = document.querySelectorAll(".quickLink");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-slide-up");
      } else {
        // Reset so it animates again when coming back into view
        entry.target.classList.remove("animate-slide-up");
      }
    });
  }, {
    threshold: 0.2 // Trigger when 20% of the element is visible
  });

  quickLinks.forEach(link => observer.observe(link));
});

function slideDown(element, duration = 600) {
  element.style.removeProperty('display');
  let display = window.getComputedStyle(element).display;
  if (display === 'none') display = 'block';
  element.style.display = display;

  let height = element.offsetHeight;
  element.style.height = 0;
  element.style.overflow = 'hidden';
  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = duration + 'ms';
  element.offsetHeight;
  element.style.height = height + 'px';

  window.setTimeout(() => {
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-property');
    element.style.removeProperty('transition-duration');
  }, duration);
}

function slideUp(element, duration = 400) {
  element.style.height = element.offsetHeight + 'px';
  element.style.overflow = 'hidden';
  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = duration + 'ms';
  element.offsetHeight;
  element.style.height = 0;

  window.setTimeout(() => {
    element.style.display = 'none';
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-property');
    element.style.removeProperty('transition-duration');
  }, duration);
}