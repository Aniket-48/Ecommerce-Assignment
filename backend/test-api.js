const testAPI = async () => {
  const baseUrl = 'http://localhost:5000/api';
  console.log('--- Starting API Tests ---\n');

  try {
    // 1. Register User
    console.log('1. Registering user...');
    const registerRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      })
    });
    const registerData = await registerRes.json();
    console.log('Register Response:', registerData);
    if (!registerData.token) {
        console.log('User might already exist, trying login...');
    }

    // 2. Login User
    console.log('\n2. Logging in...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    const token = loginData.token;

    if (!token) {
        console.log('Login failed, aborting tests.');
        return;
    }

    // 3. Get Products (will be empty initially if no seed data)
    console.log('\n3. Fetching products...');
    const productsRes = await fetch(`${baseUrl}/products`);
    const productsData = await productsRes.json();
    console.log('Products count:', productsData.length);

    // Let's create a mock product directly in JSON DB just to test cart and orders if none exists
    let productId = 'mock_product_123';
    if (productsData.length > 0) {
        productId = productsData[0]._id;
    }

    // 4. Update Cart
    console.log('\n4. Updating cart...');
    const cartRes = await fetch(`${baseUrl}/cart`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [{ productId: productId, quantity: 2 }]
      })
    });
    const cartData = await cartRes.json();
    console.log('Cart Response:', JSON.stringify(cartData, null, 2));

    // 5. Place Order
    console.log('\n5. Placing order...');
    const orderRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [{
            productId: productId,
            name: 'Mock Product',
            price: 99.99,
            quantity: 2,
            image: 'mock.jpg'
        }],
        shippingAddress: {
            fullName: 'Test User',
            street: '123 Test St',
            city: 'Test City',
            postalCode: '12345'
        },
        paymentMethod: 'Credit Card',
        totalAmount: 199.98
      })
    });
    const orderData = await orderRes.json();
    console.log('Order Response:', orderData);

    // 6. Get Order History
    console.log('\n6. Fetching order history...');
    const historyRes = await fetch(`${baseUrl}/orders/history`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    const historyData = await historyRes.json();
    console.log('Order History count:', historyData.length);

  } catch (error) {
    console.error('Test script error:', error);
  }
};

testAPI();
