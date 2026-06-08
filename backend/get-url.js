const test = async () => {
  try {
    const jsUrl = 'http://ecommerce-assignment-1-g5ly.onrender.com/assets/index-CeyuRay4.js';
    const r2 = await fetch(jsUrl);
    const js = await r2.text();
    
    // Search for onrender.com
    const onrenderMatch = js.match(/[a-zA-Z0-9-]+\.onrender\.com/g);
    console.log('onrender.com URLs:', onrenderMatch);
    
    // Search for localhost:5000
    const localhost5000Match = js.match(/localhost:5000/g);
    console.log('localhost:5000 URLs:', localhost5000Match);
  } catch (err) {
    console.error(err);
  }
};
test();
