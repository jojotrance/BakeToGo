// <<<<<<< Updated upstream
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import algoliasearch from 'algoliasearch/lite';
// import axios from 'axios';
// import PropTypes from 'prop-types';

// const searchClient = algoliasearch('SKGEMY1IVJ', '90477025cfd3896f776e79b8d0625bca');
// const index = searchClient.initIndex('products');

// const useInfiniteScroll = (loading, hasMore, loadMore) => {
//   const handleScroll = useCallback(() => {
//     const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
//     if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
//       loadMore();
//     }
//   }, [loading, hasMore, loadMore]);

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [handleScroll]);
// };

// const ProductMenu = ({ query }) => {
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [totalHits, setTotalHits] = useState(0);
//   const observer = useRef();

//   const itemsPerPage = 20;

//   const resetPagination = useCallback(() => {
//     setProducts([]);
//     setPage(0);
//     setHasMore(true);
//   }, []);

//   const fetchProducts = useCallback(async (page) => {
//     setLoading(true);
//     try {
//       const { hits, nbHits, nbPages, page: currentPage } = await index.search('', { page, hitsPerPage: itemsPerPage });
//       setProducts((prevProducts) => (page === 0 ? hits : [...prevProducts, ...hits]));
//       setTotalHits(nbHits);
//       setHasMore(currentPage < nbPages - 1);
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const searchProducts = useCallback(async (query, page) => {
//     setLoading(true);
//     try {
//       const { hits, nbHits, nbPages, page: currentPage } = await index.search(query, { page, hitsPerPage: itemsPerPage });
//       setProducts((prevProducts) => (page === 0 ? hits : [...prevProducts, ...hits]));
//       setTotalHits(nbHits);
//       setHasMore(currentPage < nbPages - 1);
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//     } catch (error) {
//       console.error('Error searching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useInfiniteScroll(loading, hasMore, () => {
//     setPage((prevPage) => prevPage + 1);
//   });

//   useEffect(() => {
//     const handleSearchQuery = (event) => {
//       searchProducts(event.detail, 0);
//     };

//     window.addEventListener('search-query', handleSearchQuery);

//     if (query.trim() === '') {
//       fetchProducts(0);
//     } else {
//       searchProducts(query, 0);
//     }

//     return () => {
//       window.removeEventListener('search-query', handleSearchQuery);
//     };
//   }, [query, searchProducts, fetchProducts]);

//   useEffect(() => {
//     if (query.trim() === '') {
//       fetchProducts(page);
//     } else {
//       searchProducts(query, page);
//     }
//   }, [page, query, fetchProducts, searchProducts]);

//   const addToCart = async (product) => {
//     try {
//       await axios.post('/api/cart', { product_id: product.objectID });
//       alert('Product added to cart successfully!');
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       alert('Failed to add product to cart.');
//     }
//   };

//   const handlePageClick = (pageNum) => {
//     setPage(pageNum);
//     resetPagination();
//     fetchProducts(pageNum);
//   };

//   const totalPages = Math.ceil(totalHits / itemsPerPage);

//   return (
//     <div className="product-menu">
//       <h3>Products</h3>
//       <div className="product-cards">
//         {products.length > 0 ? (
//           products.map((product, index) => (
//             <div
//               key={product.objectID}
//               className="product-card"
//             >
//               <img
//                 src={product.image_url}
//                 alt={product.name}
//                 className="product-image"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = 'https://via.placeholder.com/150';
//                 }}
//               />
//               <div className="product-info">
//                 <h4 className="product-name">{product.name}</h4>
//                 <p className="product-description">{product.description}</p>
//                 <div className="product-pricing">
//                   <span className="product-price">${product.price}</span>
//                 </div>
//                 <button className="add-to-cart-button" onClick={() => addToCart(product)}>
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No products found</p>
//         )}
//       </div>
//       {loading && <p>Loading more products...</p>}
//       {!hasMore && <p>No more products to load</p>}
//       <div className="pagination">
//         {[...Array(totalPages).keys()].map((pageNum) => (
//           <button
//             key={pageNum}
//             className={`page-button ${pageNum === page ? 'active' : ''}`}
//             onClick={() => handlePageClick(pageNum)}
//           >
//             {pageNum + 1}
//           </button>
//         ))}
//       </div>
//       <button className="scroll-to-top-button" onClick={resetPagination}>⬆</button>
//     </div>
//   );
// };

// ProductMenu.defaultProps = {
//   query: '',
// };

// ProductMenu.propTypes = {
//   query: PropTypes.string,
// };

// export default ProductMenu;
// =======
// // // resources/js/components/ProductMenu.jsx
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// // const ProductMenu = () => {
// //   const [products, setProducts] = useState([]);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         const response = await axios.get('/api/products');
// //         if (Array.isArray(response.data.data)) {
// //           setProducts(response.data.data);
// //         } else {
// //           throw new Error('Data is not an array');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching products:', error);
// //         setError('Failed to fetch products, displaying placeholder data.');
// //         setProducts([
// //           {
// //             id: 1,
// //             name: 'Placeholder Product',
// //             description: 'This is a placeholder product description.',
// //             price: 0,
// //             image: 'https://via.placeholder.com/150',
// //           },
// //         ]);
// //       }
// //     };

// //     fetchProducts();
// //   }, []);

// //   const addToCart = async (product) => {
// //     try {
// //       await axios.post('/api/cart', { product_id: product.id });
// //       alert('Product added to cart successfully!');
// //     } catch (error) {
// //       console.error('Error adding to cart:', error);
// //       alert('Failed to add product to cart.');
// //     }
// //   };

// //   return (
// //     <div className="product-menu">
// //       <h3>Products</h3>
// //       <div className="product-cards">
// //         {products.map((product) => (
// //           <div key={product.id} className="product-card">
// //             <img src={product.image} alt={product.name} className="product-image" />
// //             <div className="product-info">
// //               <h4 className="product-name">{product.name}</h4>
// //               <p className="product-description">{product.description}</p>
// //               <div className="product-pricing">
// //                 <span className="product-price">${product.price}</span>
// //               </div>
// //               <button className="add-to-cart-button" onClick={() => addToCart(product)}>Add to Cart</button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductMenu;
// >>>>>>> Stashed changes
