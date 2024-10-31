const Cart = require('../../model/cart');

// Controller to add a product to the cart.....
const addToCart = async (req, res) => {
    try {
        console.log("vannu njnnnnn")
        const { userId, product } = req.body;
        if (product.quantity <= 0 || product.quantity > product.stock) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

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


//Getting cart detais to chek is the purticlar size of theprpduct is alredy in the cart..
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
            return res.status(200).json({
                inCart: true,
                message: "Product with this size already in cart"
            });
        } else {
            return res.status(200).json({
                inCart: false,
                message: "Product with this size not in cart"
            });
        }

    } catch (error) {
        console.error("Error fetching cart details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//Get the cart items details...
const getAllCartItems = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartItems = await Cart.findOne({ userId })
            .populate({
                path: 'products.productId',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            });
        if (!cartItems) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cartItems.products.forEach((item) => {

            const product = item.productId;
            const sizeData = product.sizes.find((s) => s.size === item.size);
            // console.log("productss:=>", product)
            // console.log("sizedata vann :", sizeData);
            if (sizeData) {
                if (item.quantity > sizeData.stock) {
                    item.quantity = sizeData.stock;
                } else if (item.quantity == 0 && sizeData.stock > 1) {
                    item.quantity = 1;
                }
                item.totalProductPrice = item.offerPrice * item.quantity;
            }
        })
        cartItems.totalCartPrice = cartItems.products.reduce((total, item) => {
            return total + item.totalProductPrice;
        }, 0);

        await cartItems.save();



        res.status(200).json({
            success: true,
            message: "CART ITEM FETCHED",
            cartItems
        });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

//To delete the purticukar item from the cart......
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


//Incrse count and handle hte size - stock also incremeting the price based on the purticular quantity..
const incrementCartItemQuantity = async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        console.log(userId)
        console.log(itemId)

        const cart = await Cart.findOne({ userId }).populate("products.productId");
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }


        const cartItem = cart.products.find(item => item._id.toString() === itemId);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        const product = cartItem.productId;
        const sizeData = product.sizes.find(s => s.size === cartItem.size);
        if (!sizeData) {
            return res.status(400).json({ success: false, message: 'Size not available' });
        }


        if (cartItem.quantity < sizeData.stock && cartItem.quantity < 5) {
            cartItem.quantity += 1;
            cartItem.totalProductPrice = cartItem.offerPrice * cartItem.quantity;


            cart.totalCartPrice = cart.products.reduce((total, item) => total + item.totalProductPrice, 0);

            await cart.save();

            res.status(200).json({
                success: true,
                message: 'Cart item quantity incremented',
                cart
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Maximum quantity exceeded'
            });
        }
    } catch (error) {
        console.error('Error incrementing cart item quantity:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

//Decrese count and handle hte size - stock also decrementing the price based on the purticular quantity..
const decrementCartItemQuantity = async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        console.log(userId)
        console.log(itemId)


        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const cartItem = cart.products.find(item => item._id.toString() === itemId);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            cartItem.totalProductPrice = cartItem.offerPrice * cartItem.quantity;

            cart.totalCartPrice = cart.products.reduce((total, item) => total + item.totalProductPrice, 0);

            await cart.save();

            res.status(200).json({
                success: true,
                message: 'Cart item quantity decremented',
                cart
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }
    } catch (error) {
        console.error('Error decrementing cart item quantity:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};



//Cart length display....
const getUserCartProductCount = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        console.log("ivide vanuu")
        const cart = await Cart.findOne({ userId: id });
        console.log(cart)
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }
        const productCount = cart.products.length;
        res.status(200).json({ success: true, productCount });
    } catch (error) {
        console.error("Error fetching product count:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addToCart, getCartDetails, getAllCartItems, deleteItem, incrementCartItemQuantity, decrementCartItemQuantity, getUserCartProductCount };
