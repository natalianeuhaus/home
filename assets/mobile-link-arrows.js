/* Mobile link icons only. Existing SVG/CSS arrows, slideshow controls and desktop stay unchanged. */
(() => {
  'use strict';
  if (document.getElementById('mobile-link-arrow-styles')) return;
  const mobile = window.matchMedia('(max-width: 980px) and (hover: none) and (pointer: coarse)');
  const paths = {
    '\u2197': 'M5 19L19 5M5 5H19V19',
    '\u2198': 'M5 5L19 19M5 19H19V5',
    '\u2196': 'M19 19L5 5M5 19V5H19',
    '\u2199': 'M19 5L5 19M5 5V19H19',
    '\u2192': 'M4 12H20M13 5L20 12L13 19',
    '\u2190': 'M20 12H4M11 5L4 12L11 19',
    '\u2191': 'M12 20V4M5 11L12 4L19 11',
    '\u2193': 'M12 4V20M5 13L12 20L19 13'
  };
  const directions = {'\u2197':'ne','\u2198':'se','\u2196':'nw','\u2199':'sw','\u2192':'e','\u2190':'w','\u2191':'n','\u2193':'s'};
  const aliases = {'\u27a1':'\u2192','\u2b05':'\u2190','\u2b06':'\u2191','\u2b07':'\u2193'};
  const arrow = /[\u2190-\u2193\u2196-\u2199\u27a1\u2b05-\u2b07][\ufe0e\ufe0f]?/g;
  const containsArrow = text => /[\u2190-\u2193\u2196-\u2199\u27a1\u2b05-\u2b07]/.test(text || '');
  const protectedArea = 'script,style,svg,textarea,pre,code,dialog,[role="dialog"],.site-mobile-arrow,.intermission-lightbox,.healers-lightbox,.burlesque-lightbox,.lightbox,.intermission-navigation-controls,.niagara-photo-story,.waterfalls-control,.waterfalls-progress,.slide-hit,#slideControls,.intermission-enter-series,.burlesque-enter-series';
  const style = document.createElement('style');
  style.id = 'mobile-link-arrow-styles';
  style.textContent = `
    .site-mobile-arrow,.site-mobile-arrow-original{display:contents}
    .site-mobile-arrow-icon{display:none!important}
    @media(max-width:980px) and (hover:none) and (pointer:coarse){
      .site-mobile-arrow{position:relative;display:inline-block;width:1em;height:1em;line-height:1;vertical-align:-.12em;letter-spacing:0;text-shadow:none;pointer-events:none}
      .site-mobile-arrow-original{display:inline;visibility:hidden}
      .site-mobile-arrow-icon{position:absolute;inset:0;display:block!important;width:100%;height:100%;max-width:none;overflow:visible;color:inherit;pointer-events:none}
    }
  `;
  document.head.append(style);

  function eligible(node) {
    const parent = node.parentElement;
    if (!parent || !containsArrow(node.nodeValue) || parent.closest(protectedArea)) return false;
    const control = parent.closest('a,button,summary,[role="button"]');
    if (!control) return false;
    // Do not change a control whose only accessible name is its arrow.
    if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby') && !control.textContent.replace(arrow, '').trim()) return false;
    // A zero-size glyph is already replaced by the page's own drawn arrow.
    return parseFloat(getComputedStyle(parent).fontSize) > 0;
  }

  function replaceNode(node) {
    if (!eligible(node)) return;
    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let offset = 0;
    for (const match of text.matchAll(arrow)) {
      fragment.append(document.createTextNode(text.slice(offset, match.index)));
      const symbol = aliases[match[0][0]] || match[0][0];
      // Dedicated inline tags avoid existing rules such as .hero-bottom span:first-child.
      const wrapper = document.createElement('site-arrow');
      wrapper.className = 'site-mobile-arrow';
      wrapper.dataset.direction = directions[symbol];
      const original = document.createElement('site-arrow-original');
      original.className = 'site-mobile-arrow-original';
      original.textContent = match[0];
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'site-mobile-arrow-icon');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');
      icon.setAttribute('stroke-width', '1.5');
      icon.setAttribute('stroke-linecap', 'round');
      icon.setAttribute('stroke-linejoin', 'round');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', paths[symbol]);
      icon.append(path);
      wrapper.append(original, icon);
      fragment.append(wrapper);
      offset = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(text.slice(offset)));
    node.replaceWith(fragment);
  }

  function scan(root) {
    if (!mobile.matches || !root.isConnected) return;
    if (root.nodeType === Node.TEXT_NODE) { replaceNode(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE || root.closest(protectedArea)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (containsArrow(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    nodes.forEach(replaceNode);
  }

  // Chapter switches can create new video links. Observe only inserted text,
  // never attributes, so animations, layout and the existing click handlers are untouched.
  const observer = new MutationObserver(records => {
    observer.disconnect();
    for (const record of records) {
      if (record.type === 'characterData') scan(record.target);
      else record.addedNodes.forEach(node => {
        if (containsArrow(node.textContent)) scan(node);
      });
    }
    if (mobile.matches) observe();
  });
  function observe() { observer.observe(document.body, {childList:true,subtree:true,characterData:true}); }
  function update() {
    observer.disconnect();
    if (mobile.matches) { scan(document.body); observe(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', update, {once:true});
  else update();
  if (mobile.addEventListener) mobile.addEventListener('change', update);
  else mobile.addListener(update);
})();
