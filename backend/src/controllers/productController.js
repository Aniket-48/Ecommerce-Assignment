const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    // Fetch all products first to apply unified in-memory filters, 
    // ensuring identical behavior between Mongo and JSON fallbacks.
    let products = await Product.find({});

    // 1. Filter by Search Query
    if (search) {
      const query = search.toLowerCase().trim();
      products = products.filter(
        p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Category
    if (category && category !== 'All' && category.trim() !== '') {
      products = products.filter(
        p => p.category.toLowerCase() === category.toLowerCase().trim()
      );
    }

    // 3. Filter by Price Limits
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // 4. Sorting logic
    if (sort) {
      switch (sort) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating_desc':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Dynamic related products generator (max 4 products from the same category)
    const allProductsInSameCategory = await Product.find({ category: product.category });
    const relatedProducts = allProductsInSameCategory
      .filter(p => p._id.toString() !== product._id.toString())
      .slice(0, 4);

    res.json({
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error while fetching product detail.' });
  }
};

module.exports = {
  getProducts,
  getProductById
};
