const Cart = require('../../model/cart');
const Product = require('../../model/Product')

// Controller to add a product to the cart
const addToCart = async (req, res) => {
    try {
        console.log("vannu njnnnnn")
        const { userId, product } = req.body;
        if (product.quantity <= 0 || product.quantity > product.stock) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

        // Calculate discount and total price for the product
        const discount = ((product.price - product.offerPrice) / product.price) * 100;
        const totalProductPrice = product.offerPrice * product.quantity;


        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                products: [{
                    ...product,
                    discount,
                    totalProductPrice
                }],
                totalCartPrice: totalProductPrice
            });
        } else {

            const existingProduct = cart.products.find(p =>
                p.productId.toString() === product.productId && p.size === product.size
            );

            if (existingProduct) {
                existingProduct.totalProductPrice += totalProductPrice;
            } else {

                cart.products.push({ ...product, discount, totalProductPrice });
            }

            cart.totalCartPrice = cart.products.reduce((acc, item) => acc + item.totalProductPrice, 0);
        }
        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding product to cart' });
    }
};



const getCartDetails = async (req, res) => {
    try {
        const { userId, productId, size } = req.query;
        console.log("userid", userId)
        console.log("productid", productId)
        console.log(size)

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productInCart = cart.products.find(
            (product) =>
                product.productId.toString() === productId &&
                product.size === size
        );

        if (productInCart) {
            return res.status(200).json({ inCart: true, message: "Product with this size already in cart" });
        } else {
            return res.status(200).json({ inCart: false, message: "Product with this size not in cart" });
        }

    } catch (error) {
        console.error("Error fetching cart details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllCartItems = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'products.productId',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartItems = cart.products;
        res.status(200).json({ cartItems });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteItem = async (req, res) => {
    try {
        console.log("Delete request received...");
        const { id, pr_id } = req.params;

        console.log("User ID:", id);
        console.log("Product ID to delete:", pr_id);

        const cart = await Cart.findOne({ userId: id });

        if (!cart) {
            return res.status(404).json({ message: 'No cart exist..' });
        }


        console.log("Cart before delete:", cart.products);

        const updatedCart = await Cart.findOneAndUpdate(
            { userId: id },
            { $pull: { products: { _id: pr_id } } },
            { new: true }
        );


        console.log("Ucart after delete:", updatedCart);

        updatedCart.totalCartPrice = updatedCart.products.reduce((acc, item) => acc + item.totalProductPrice, 0);
        await updatedCart.save();

        res.status(200).json({ message: 'Product removed from cart', cart: updatedCart });
    } catch (err) {
        console.error("Error during deletion:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// const updateCartItemQuantity = async (req, res) => {
//     try {
//         const { userId, itemId } = req.params;
//         const { quantity } = req.body;

//         const cart = await Cart.findOne({ userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         const cartItem = cart.products.find(item => item._id.toString() === itemId);

//         if (!cartItem) {
//             return res.status(404).json({ message: 'Item not found...' });
//         }

//         cartItem.quantity = quantity;
//         cartItem.totalProductPrice = cartItem.price * quantity;

//         cart.totalCartPrice = cart.products.reduce((total, item) => total + item.totalProductPrice, 0);

//         await cart.save();

//         res.status(200).json({ message: 'Cart item quantity updated', cart });
//     } catch (error) {
//         console.error('Error....:', error);
//         res.status(500).json({ error: 'server error' });
//     }
// };


const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        const { quantity, size } = req.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false });
        }

        const cartItem = cart.products.find(item => item._id.toString() === itemId);

        if (!cartItem) {
            return res.status(404).json({ success: false });
        }

        const product = await Product.findById(cartItem.productId);
        const sizeData = product.sizes.find(s => s.size === size);

        if (!sizeData) {
            return res.status(400).json({ success: false});
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false
            });
        }
        
        if (quantity > cartItem.quantity && quantity > sizeData.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${sizeData.stock} items available for size ${size}`
            });
        }

        cartItem.quantity = quantity;
        cartItem.totalProductPrice = cartItem.price * quantity;

        cart.totalCartPrice = cart.products.reduce((total, item) => total + item.totalProductPrice, 0);

        await cart.save();

        res.status(200).json({ success: true, message: 'Cart item quantity updated', cart });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


module.exports = { addToCart, getCartDetails, getAllCartItems, deleteItem, updateCartItemQuantity };
