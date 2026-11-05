export {};

const form = document.querySelector<HTMLFormElement>('.feedback-form');
const message = form?.querySelector<HTMLTextAreaElement>('#feedback-message');
const submit = form?.querySelector<HTMLButtonElement>('[data-feedback-submit]');
const feedbackStatus = form?.querySelector<HTMLElement>('.feedback-status');
const fallback = form?.querySelector<HTMLElement>('.draft-fallback');
const draft = form?.querySelector<HTMLTextAreaElement>('#feedback-draft');
const copy = form?.querySelector<HTMLButtonElement>('[data-copy-draft]');

function validateMessage() {
  if (!message) return;
  message.setCustomValidity(
    message.value.trim().length < 20 ? 'Escribe al menos 20 caracteres de contenido.' : ''
  );
}
message?.addEventListener('input', validateMessage);
if (submit) submit.disabled = false;
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!message || !draft || !fallback) return;
  validateMessage();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const body = message.value.trim();
  const title = String(values.get('title') ?? '');
  const endpoint = form.dataset.issuesUrl;
  const url = endpoint ? new URL(endpoint) : undefined;
  url?.searchParams.set('title', title);
  url?.searchParams.set('body', body);
  // Keep long messages out of query strings; the fallback never submits the form.
  if (url && url.href.length <= 7000) {
    window.location.assign(url.href);
    return;
  }
  draft.value = `${title}\n\n${body}`;
  fallback.hidden = false;
  if (feedbackStatus)
    feedbackStatus.textContent = endpoint
      ? 'Tu mensaje es largo. Copia el borrador y pégalo en GitHub; todavía no se ha enviado.'
      : 'Tu idea está lista para copiar. El canal público todavía no está disponible. No se ha enviado nada.';
  draft.focus();
  draft.select();
});
copy?.addEventListener('click', async () => {
  if (!draft || !feedbackStatus) return;
  try {
    await navigator.clipboard.writeText(draft.value);
    feedbackStatus.textContent = 'Borrador copiado. Tú decides cuándo compartirlo.';
  } catch {
    draft.focus();
    draft.select();
    feedbackStatus.textContent =
      'Seleccionamos el borrador. Usa copiar en el menú de tu dispositivo o Ctrl+C / ⌘C.';
  }
});
