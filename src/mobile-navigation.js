import './mobile-navigation.css'

// Mobile controls proxy the existing buttons: one scene and one configuration state.
// No desktop node is moved or replaced, and its selected tab is independent.
export function setupMobileNavigation() {
  const breakpoint = window.matchMedia('(max-width: 767px)')
  const sources = {
    animal: document.querySelector('.animal-section'),
    surface: document.querySelector('#tray-panel-surface'),
    form: document.querySelector('#tray-panel-form'),
    colour: document.querySelector('.colour-rail'),
  }
  const titles = { animal: 'Choose your animal', surface: 'Choose your surface', form: 'Shape your animal', colour: 'Choose your colour' }
  const icons = {
    animal: 'M8 5 5 3 2 8l3 3V8m11-3 3-2 3 5-3 3V8M5 8c0-6 14-6 14 0v7c0 8-14 8-14 0Zm4 4h.01M15 12h.01M10 16h4l-2 2Z',
    surface: 'm12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3ZM20 2v4m-2-2h4',
    form: 'm12 2 4 7H8ZM3 17a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm13-4h6v8h-6Z',
    colour: 'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4 2 2 0 0 1 1-4h3c5 0 3-10-6-10ZM7 9h.01M11 6h.01M16 7h.01M6 14h.01',
  }
  const root = document.createElement('div')
  root.className = 'mobile-configurator'
  root.innerHTML = `
    <section class="mobile-sheet" id="mobile-config-sheet" aria-labelledby="mobile-sheet-title" hidden>
      <header class="mobile-sheet-header"><h2 id="mobile-sheet-title"></h2>
        <button type="button" class="mobile-sheet-close" aria-label="Close configuration panel">×</button>
      </header>
      <div class="mobile-sheet-content"></div>
    </section>
    <nav class="mobile-nav" aria-label="Mobile configurator">
      ${Object.keys(sources).map(name => `<button type="button" data-mobile-tab="${name}" aria-expanded="false" aria-controls="mobile-config-sheet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name]}"/></svg><span>${name[0].toUpperCase() + name.slice(1)}</span></button>`).join('')}
    </nav>`
  document.querySelector('#app').append(root)
  const sheet = root.querySelector('.mobile-sheet')
  const content = root.querySelector('.mobile-sheet-content')
  const tabs = [...root.querySelectorAll('[data-mobile-tab]')]
  let active = null
  let pairs = []

  function synchronize() {
    for (const [source, copy] of pairs) {
      for (const attribute of ['class', 'aria-pressed', 'disabled', 'style']) {
        if (source.hasAttribute(attribute)) copy.setAttribute(attribute, source.getAttribute(attribute))
        else copy.removeAttribute(attribute)
      }
      // Desktop tab visibility never controls the mobile sheet.
      if (source !== sources[active]) copy.hidden = source.hidden
      if (source.hasAttribute('data-flower-note')) copy.textContent = source.textContent
    }
  }

  function close(restoreFocus = true) {
    const previous = tabs.find(tab => tab.dataset.mobileTab === active)
    active = null
    pairs = []
    sheet.hidden = true
    tabs.forEach(tab => tab.setAttribute('aria-expanded', 'false'))
    if (restoreFocus) previous?.focus()
  }

  function open(name) {
    if (!breakpoint.matches) return
    if (name === active) return close()
    active = name
    const source = sources[name]
    const copy = source.cloneNode(true)
    pairs = [[source, copy], ...[...source.querySelectorAll('*')].map((node, index) => [node, copy.querySelectorAll('*')[index]])]
    for (const [original, clone] of pairs) {
      // Avoid duplicate IDs and prevent desktop selectors binding to mobile copies.
      for (const attribute of [...clone.attributes]) {
        if (attribute.name.startsWith('data-') || ['id', 'role', 'aria-labelledby', 'aria-controls'].includes(attribute.name)) clone.removeAttribute(attribute.name)
      }
      if (original.matches('button[data-control]')) clone.addEventListener('click', () => original.click())
    }
    copy.hidden = false
    content.replaceChildren(copy)
    root.querySelector('#mobile-sheet-title').textContent = titles[name]
    tabs.forEach(tab => tab.setAttribute('aria-expanded', String(tab.dataset.mobileTab === name)))
    synchronize()
    sheet.hidden = false
    content.querySelector('button:not([disabled])')?.focus()
  }

  tabs.forEach(tab => tab.addEventListener('click', () => open(tab.dataset.mobileTab)))
  root.querySelector('.mobile-sheet-close').addEventListener('click', () => close())
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) { event.preventDefault(); close() }
  })
  breakpoint.addEventListener('change', () => {
    if (!breakpoint.matches) close(false)
  })
  new MutationObserver(synchronize).observe(document.querySelector('.config-panel'), {
    subtree: true, attributes: true, childList: true, characterData: true,
  })
}
