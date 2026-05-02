// GET /data -> lire les données
// POST /data -> sauvegarder les données

export async function onRequestGet(context) {
  try {
    const kv = context.env.KV;
    if (!kv) {
      return new Response(JSON.stringify({ error: 'KV non configuré' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const [planData, shopData, myRecipes, weekExtras] = await Promise.all([
      kv.get('planData'),
      kv.get('shopData'),
      kv.get('myRecipes'),
      kv.get('weekExtras'),
    ]);

    return new Response(JSON.stringify({
      planData: planData ? JSON.parse(planData) : {},
      shopData: shopData ? JSON.parse(shopData) : {},
      myRecipes: myRecipes ? JSON.parse(myRecipes) : [],
      weekExtras: weekExtras ? JSON.parse(weekExtras) : {},
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function onRequestPost(context) {
  try {
    const kv = context.env.KV;
    if (!kv) {
      return new Response(JSON.stringify({ error: 'KV non configuré' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const body = await context.request.json();

    await Promise.all([
      body.planData !== undefined ? kv.put('planData', JSON.stringify(body.planData)) : Promise.resolve(),
      body.shopData !== undefined ? kv.put('shopData', JSON.stringify(body.shopData)) : Promise.resolve(),
      body.myRecipes !== undefined ? kv.put('myRecipes', JSON.stringify(body.myRecipes)) : Promise.resolve(),
      body.weekExtras !== undefined ? kv.put('weekExtras', JSON.stringify(body.weekExtras)) : Promise.resolve(),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
