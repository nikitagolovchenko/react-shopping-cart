import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../actions/productActions';
import formatCurrency from '../util';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import Modal from 'react-modal';
import { addToCart } from '../actions/cartActions';

export default function Products(props) {
  const products = useSelector((state) => state.products.filteredItems);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    product: null,
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const openModal = (product) => {
    setState({
      ...state,
      product: product,
    });
  };

  const closeModal = () => {
    setState({
      ...state,
      product: null,
    });
  };

  return (
    <div>
      <Fade bottom cascade>
        {!products ? (
          <div>Loading...</div>
        ) : (
          <ul className='products'>
            {products.map((product) => (
              <li key={product._id}>
                <div className='product'>
                  <a
                    href={'#' + product._id}
                    onClick={() => openModal(product)}
                  >
                    <img src={product.image} alt={product.title} />
                    <p>{product.title}</p>
                  </a>
                  <div className='product-price'>
                    <div>{formatCurrency(product.price)}</div>
                    <button
                      className='button primary'
                      onClick={() => {
                        dispatch(addToCart(product));
                      }}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Fade>
      {state.product && (
        <Modal isOpen={true} onRequestClose={closeModal} ariaHideApp={false}>
          <Zoom>
            <button className='close-modal' onClick={closeModal}>
              x
            </button>
            <div className='product-details'>
              <img src={state.product.image} alt={state.product.title} />
              <div className='product-details-description'>
                <p>
                  <strong>{state.product.title}</strong>
                </p>
                <p>{state.product.description}</p>
                <p>
                  Available Sizes:{' '}
                  {state.product.availableSizes.map((x) => (
                    <span>
                      {' '}
                      <button className='button'>{x}</button>
                    </span>
                  ))}
                </p>
                <div className='product-price'>
                  <div>{formatCurrency(state.product.price)}</div>
                  <button
                    className='button primary'
                    onClick={() => {
                      props.addToCart(state.product);
                      closeModal();
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </Zoom>
        </Modal>
      )}
    </div>
  );
}
