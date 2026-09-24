export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function createElement(tag, { className, text, html, attrs = {}, dataset = {} } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  if (html != null) el.innerHTML = html;
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  for (const [key, value] of Object.entries(dataset)) el.dataset[key] = value;
  return el;
}

export function clearNode(node) {
  node.replaceChildren();
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}