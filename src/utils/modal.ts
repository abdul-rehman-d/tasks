export function openModal(id: string) {
  if (document) {
    (document.getElementById(id) as HTMLFormElement).showModal();
  }
}

export function closeModal(id: string) {
  if (document) {
    (document.getElementById(id) as HTMLFormElement).close();
  }
}