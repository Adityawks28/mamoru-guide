import { createSprite } from './sprite';

export function initFooterMascot(): void {
  const host = document.getElementById('footer-mascot');
  if (!host) return;
  const sprite = createSprite({ pose: 'stand', gender: 'male' });
  sprite.classList.add('footer-mascot');
  host.replaceChildren(sprite);
}
