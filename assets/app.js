const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const statusNode = document.getElementById('form-status');
const leadForm = document.getElementById('lead-form');
const revealNodes = document.querySelectorAll('.reveal');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('is-open');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add('is-visible'));
}

if (leadForm) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    statusNode.textContent = '';

    const honeypot = leadForm.elements.website?.value?.trim();
    if (honeypot) {
      statusNode.textContent = 'Solicitud no válida.';
      return;
    }

    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      statusNode.textContent = 'Revisá los campos obligatorios.';
      return;
    }

    const data = new FormData(leadForm);
    const message = [
      'Hola, quiero reservar una clase de prueba en Evolución.',
      `Nombre: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `WhatsApp: ${data.get('phone')}`,
      `Objetivo: ${data.get('goal')}`
    ].join('\n');

    const url = `https://wa.me/59891367421?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    statusNode.textContent = 'Abriendo WhatsApp...';
    leadForm.reset();
  });
}
