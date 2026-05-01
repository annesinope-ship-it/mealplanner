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

    const [planData, shopList, myRecipes] = await Promise.all([
      kv.get('planData'),
      kv.get('shopList'),
      kv.get('myRecipes'),
    ]);

    return new Response(JSON.stringify({
      planData: planData ? JSON.parse(planData) : {},
      shopList: shopList ? JSON.parse(shopList) : [],
      myRecipes: myRecipes ? JSON.parse(myRecipes) : [],
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
      body.shopList !== undefined ? kv.put('shopList', JSON.stringify(body.shopList)) : Promise.resolve(),
      body.myRecipes !== undefined ? kv.put('myRecipes', JSON.stringify(body.myRecipes)) : Promise.resolve(),
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
