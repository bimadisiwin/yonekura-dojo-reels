async () => {
  const nonce = window.wpApiSettings.nonce;
  async function getBySlug(type, slug) {
    const res = await fetch(`/wp-json/wp/v2/${type}?slug=${encodeURIComponent(slug)}&context=edit&status=any`, {
      headers: { 'X-WP-Nonce': nonce },
    });
    const arr = await res.json();
    return Array.isArray(arr) ? arr[0] : null;
  }
  async function update(type, id, content) {
    const res = await fetch(`/wp-json/wp/v2/${type}/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    return { status: res.status, id: data.id, link: data.link, message: data.message };
  }
  function ensureLink(content, html) {
    if (content.includes('jiujitsu-interest-kagoshima')) return { content, changed: false };
    return { content: content + '\n' + html, changed: true };
  }
  const linkP =
    '<p class="wp-block-paragraph">柔術・ブラジリアン柔術に興味がある方は、<a href="https://yonekura-dojo.com/jiujitsu-interest-kagoshima/">鹿児島で柔術に興味がある方へ</a>と<a href="https://yonekura-dojo.com/newaza-class/">寝技クラス</a>をご覧ください。</p>';
  const results = {};

  const classInfo = await getBySlug('pages', 'class-info');
  if (classInfo) {
    const next = ensureLink(classInfo.content.raw || '', linkP);
    results.classInfo = next.changed ? await update('pages', classInfo.id, next.content) : { skipped: true };
  } else results.classInfo = { missing: true };

  let adult = await getBySlug('posts', 'adult-judo-beginner-health');
  if (!adult) adult = await getBySlug('posts', 'adult-beginner-judo');
  if (adult) {
    const next = ensureLink(adult.content.raw || '', linkP);
    results.adult = next.changed ? await update('posts', adult.id, next.content) : { skipped: true };
  } else results.adult = { missing: true };

  const sd = await getBySlug('posts', 'self-defense-judo');
  if (sd) {
    const next = ensureLink(sd.content.raw || '', linkP);
    results.selfDefense = next.changed ? await update('posts', sd.id, next.content) : { skipped: true };
  } else results.selfDefense = { missing: true };

  const settings = await (await fetch('/wp-json/wp/v2/settings', { headers: { 'X-WP-Nonce': nonce } })).json();
  if (settings.page_on_front) {
    const home = await (await fetch('/wp-json/wp/v2/pages/' + settings.page_on_front + '?context=edit', {
      headers: { 'X-WP-Nonce': nonce },
    })).json();
    const homeLink =
      '<p class="wp-block-paragraph">柔術に興味がある方へ：<a href="https://yonekura-dojo.com/jiujitsu-interest-kagoshima/">柔道の寝技クラスという入口</a>（<a href="https://yonekura-dojo.com/newaza-class/">寝技クラス詳細</a>）</p>';
    const next = ensureLink(home.content?.raw || '', homeLink);
    results.home = next.changed ? await update('pages', home.id, next.content) : { skipped: true };
    results.homeId = home.id;
  } else results.home = { missing: true };

  return results;
}
