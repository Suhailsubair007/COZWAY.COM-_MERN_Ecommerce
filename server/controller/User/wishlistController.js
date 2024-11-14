const Wishlist = require('../../model/Wishlist');
const Cart = require('../../model/cart')
const Product = require('../../model/Product')


const AddItemToWishlist = async (req, res) => {

    try {
        const { userId, id } = req.body;

        console.log(userId)
        console.log(id)

        let wishlist = await Wishlist.findOne({ user: userId })
        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                items: [{ product: id }]
            })
        } else {
            const existingItem = wishlist.items.find(
                (item) => item.product.toString() === id
            );
            if (existingItem) {
                return res.status(400).json({
                    success: false,
                    message: 'Product already in wishlist',
                });
            }
            wishlist.items.push({ product: id });
        }
        await wishlist.save();
        res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
            wishlist,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false })
    }
}

const getAllWishlistItems = async (req, res) => {
    try {
        console.log("=====================================")
        const { userId } = req.params;
        console.log(userId);
        const wishlist = await Wishlist.findOne({ user: userId })
            .populate('items.product');



        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found for this user',
            });
        }
        res.status(200).json({
            success: true,
            wishlistItems: wishlist.items,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching wishlist items',
        });
    }
};


const isInWishlist = async (req, res) => {
    try {
        const { userId, id } = req.query;
        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ messgae: "Wishlist not found..." });
        }
        const existingItem = wishlist.items.find(
            (item) => item.product.toString() === id
        );
        if (existingItem) {
            return res.status(200).json({
                success: true,
                message: 'Product is already in the wishlist',
                isInWishlist: true,
            });
        } else {
            return res.status(200).json({
                success: true,
                message: 'Product is not in the wishlist',
                isInWishlist: false,
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error checking product in wishlist',
        });
    }
}

const removeItemFromWishlist = async (req, res) => {
    console.log("vannuu==========================")
    try {
        const { userId, id } = req.body;

        console.log('Removing from wishlist:', userId, id);

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found for this user',
            });
        }

        const itemIndex = wishlist.items.findIndex(
            (item) => item.product.toString() === id
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in wishlist',
            });
        }

        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error removing product from wishlist',
        });
    }
};


const moveToCart = async (req, res) => {
    try {
        const { userId, productId, size } = req.body;
        console.log(userId, productId, size);

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found."
            });
        }

        let itemIndex = wishlist.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in the wishlist"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();

        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            cart = new Cart({
                userId: userId,
                products: []
            });
        }

        let existingCartItem = cart.products.find(
            (item) => item.productId.toString() === productId && item.size === size
        );

        if (existingCartItem) {
            existingCartItem.quantity += 1;
            existingCartItem.totalProductPrice = existingCartItem.quantity * (existingCartItem.offerPrice || existingCartItem.price);
        } else {
            const newCartItem = {
                productId: product._id,
                size: size,
                stock: product.sizes.find(s => s.size === size)?.stock || 0,
                price: product.price,
                offerPrice: product.offerPrice,
                quantity: 1,
                totalProductPrice: product.offerPrice || product.price
            };

            if (newCartItem.offerPrice && newCartItem.offerPrice < newCartItem.price) {
                newCartItem.discount = ((newCartItem.price - newCartItem.offerPrice) / newCartItem.price) * 100;
            } else {
                newCartItem.discount = 0;
            }

            cart.products.push(newCartItem);
        }

        cart.totalCartPrice = cart.products.reduce((total, item) => total + item.totalProductPrice, 0);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item moved from wishlist to cart successfully",
            cart: cart
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getWishlishProductCount = async (req, res) => {
    try {
        const { id } = req.params;
        const wishlist = await Wishlist.findOne({ user: id })

        if (!wishlist) {
            return res.status(404).json({
                sucess: false,
                messgae: "Wishlist not found"
            })

        }
        const wishlist_length = wishlist.items.length;
        res.status(200).json({
            sucess: true,
            message: "fetched sucess",
            wishlist_length
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}



module.exports = {
    AddItemToWishlist,
    getAllWishlistItems,
    isInWishlist,
    removeItemFromWishlist,
    moveToCart,
    getWishlishProductCount
}