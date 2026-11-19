(async () => {
  const url = 'https://cdn.jsdelivr.net/gh/bimadisiwin/yonekura-dojo-reels@main/tmp/reigi_wp_payload.json';
  const payload = await (await fetch(url + '?t=' + Date.now())).json();
  const nonce = window.wpApiSettings?.nonce;
  if (!nonce) return {ok:false, error:'no nonce'};
  const headers = {'Content-Type':'application/json','X-WP-Nonce':nonce};
  async function api(path, opts={}) {
    const res = await fetch('/wp-json/wp/v2/' + path, {headers, ...opts});
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch(e) { data = text; }
    if (!res.ok) throw new Error(path + ' ' + res.status + ' ' + String(text).slice(0,400));
    return data;
  }
  async function catId(slug) {
    const arr = await api('categories?slug=' + slug);
    if (!arr[0]) throw new Error('cat missing ' + slug);
    return arr[0].id;
  }
  async function upsertPost(article) {
    const cat = await catId(article.category);
    const existing = await api('posts?slug=' + article.slug + '&status=any');
    const body = {
      title: article.title,
      slug: article.slug,
      content: article.content,
      status: 'publish',
      categories: [cat],
      excerpt: article.meta_description,
      meta: {
        the_page_meta_description: article.meta_description,
        the_page_seo_title: article.title,
      }
    };
    if (existing[0]) {
      return await api('posts/' + existing[0].id, {method:'POST', body: JSON.stringify(body)});
    }
    return await api('posts', {method:'POST', body: JSON.stringify(body)});
  }
  const created = await upsertPost(payload.new_post);
  const updated = await upsertPost(payload.reigi);
  const bridge = payload.bridge_html;
  const linkResults = [];
  for (const t of payload.link_targets) {
    let item;
    if (t.kind === 'pages' && !t.slug) {
      const settings = await api('settings');
      item = await api('pages/' + settings.page_on_front + '?context=edit');
    } else {
      const arr = await api(t.kind + '?slug=' + t.slug + '&status=any&context=edit');
      if (!arr[0]) { linkResults.push({slug:t.slug, status:'missing'}); continue; }
      item = arr[0];
    }
    const content = item.content?.raw || '';
    const label = t.slug || 'home';
    if (content.includes('manners-budo-kids-kagoshima')) {
      linkResults.push({slug:label, status:'already', id:item.id});
      continue;
    }
    const newContent = content + '\n\n' + bridge;
    const usePath = (item.type === 'page' || t.kind === 'pages') ? ('pages/' + item.id) : ('posts/' + item.id);
    await api(usePath, {method:'POST', body: JSON.stringify({content: newContent})});
    linkResults.push({slug:label, status:'updated', id:item.id});
  }
  return {
    ok: true,
    created: {id: created.id, link: created.link},
    updated: {id: updated.id, link: updated.link},
    linkResults
  };
})()
