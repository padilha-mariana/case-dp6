/* Case Técnico MarTech DP6 - G-096NHNN8Q2 */

document.addEventListener('DOMContentLoaded', () => {

  const sendEvent = (eventName, params = {}) => {
    gtag('event', eventName, {
      page_location: window.location.href,
      ...params
    });
  };


  // TODAS AS PÁGINAS
 

  //  Evento: click - Disparado ao clicar em "Entre em Contato" no menu

  document.querySelectorAll('.menu-lista-contato').forEach(el => {
    el.addEventListener('click', () => {
      sendEvent('click', {
        element_name: 'entre_em_contato',
        element_group: 'menu'
      });
    });
  });

  // Evento: file_download - Disparado ao clicar em "Download PDF" no menu

  document.querySelectorAll('.menu-lista-download').forEach(el => {
    el.addEventListener('click', () => {
      sendEvent('file_download', {
        element_name: 'download_pdf',
        element_group: 'menu'
      });
    });
  });


  // PÁGINA analise.html
 

  // Evento: click - Disparado ao clicar nos cards "Ver Mais"

  if (window.location.pathname.includes('analise')) {
    document.querySelectorAll('.card-montadoras').forEach(card => {
      card.addEventListener('click', () => {
        sendEvent('click', {
          element_name: card.dataset.name || card.dataset.id,
          element_group: 'ver_mais'
        });
      });
    });
  }

 
  // PÁGINA sobre.html


  if (window.location.pathname.includes('sobre')) {
    const form = document.querySelector('.contato, form');

    if (form) {
      const formId = form.id || '';
      const formName = form.name || '';
      const formAction = form.action || window.location.href;
      let formStarted = false;

      // 3.1. Evento: form_start - Disparado quando o primeiro campo é preenchido
      const handleFormStart = () => {
        if (!formStarted) {
          formStarted = true;
          sendEvent('form_start', {
            form_id: formId,
            form_name: formName,
            form_destination: formAction
          });
        }
      };

      form.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type !== 'checkbox' && field.type !== 'radio') {
          field.addEventListener('input', () => {
            if (field.value && field.value.length > 0) handleFormStart();
          });
        } else {
          field.addEventListener('change', () => {
            if (field.checked) handleFormStart();
          });
        }
      });

      //  Evento: form_submit - Disparado ao enviar o formulário

      form.addEventListener('submit', () => {
        const submitBtn = form.querySelector('button[type="submit"]');
        sendEvent('form_submit', {
          form_id: formId,
          form_name: formName,
          form_destination: formAction,
          form_submit_text: submitBtn?.textContent.trim() || 'Enviar'
        });
      });

      // Evento: view_form_success - Disparado quando o pop up de sucesso é exibido
      
      const modal = document.querySelector('.lightbox');
      if (modal) {
        const observer = new MutationObserver(() => {
          if (document.body.classList.contains('lightbox-open')) {
            const modalTitle = document.querySelector('.lightbox-title');
            if (modalTitle && modalTitle.textContent.includes('Contato enviado')) {
              sendEvent('view_form_success', {
                form_id: formId,
                form_name: formName
              });
              observer.disconnect();
            }
          }
        });
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
    }
  }

});