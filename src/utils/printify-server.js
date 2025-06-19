/**
 * Server-side Printify utilities
 * This file should only be imported in server-side code (+server.js, +page.server.js files)
 */
import { printifyConfig } from './env';
import * as printify from './printify';

// Re-export all functions with config automatically injected
export const getProducts = () => printify.getProducts(printifyConfig);
export const getProduct = (productId) => printify.getProduct(productId, printifyConfig);
export const createProduct = (productData) => printify.createProduct(productData, printifyConfig);
export const updateProduct = (productId, productData) => printify.updateProduct(productId, productData, printifyConfig);
export const deleteProduct = (productId) => printify.deleteProduct(productId, printifyConfig);
export const createOrder = (orderData) => printify.createOrder(orderData, printifyConfig);
export const getOrders = () => printify.getOrders(printifyConfig);
export const getOrder = (orderId) => printify.getOrder(orderId, printifyConfig);
export const createCart = () => printify.createCart(printifyConfig);
export const loadCart = (cartId) => printify.loadCart(cartId, printifyConfig);
export const addToCart = (cartId, variantId, quantity) => printify.addToCart(cartId, variantId, quantity, printifyConfig);
export const updateCart = (cartId, lines) => printify.updateCart(cartId, lines, printifyConfig);
export const deleteCart = (cartId) => printify.deleteCart(cartId, printifyConfig);
export const getAllCollections = () => printify.getAllCollections(printifyConfig);
