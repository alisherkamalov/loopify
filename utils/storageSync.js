export function setAndDispatch(key, value) {
  localStorage.setItem(key, value)
  window.dispatchEvent(new CustomEvent('localstorage-update', { detail: { key, value } }))
}
