import React, { useEffect, useState } from 'react';
import formatCurrency from '../util';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../actions/cartActions';
import { clearOrderAction, createOrderAction } from '../actions/orderActions';

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const order = useSelector((state) => state.order.order);
  const dispatch = useDispatch();

  useEffect(() => {});

  const [state, setState] = useState({
    name: '',
    email: '',
    address: '',
    showCheckout: false,
  });

  const handleInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const createOrder = (e) => {
    e.preventDefault();

    const order = {
      name: state.name,
      email: state.email,
      address: state.address,
      cartItems: cartItems,
      total: cartItems.reduce((a, c) => a + c.price * c.count, 0),
    };

    dispatch(createOrderAction(order));
  };

  const closeModal = () => {
    dispatch(clearOrderAction());
  };

  return (
    <div>
      {cartItems.length === 0 ? (
        <div className='cart cart-header'>Cart is empty</div>
      ) : (
        <div className='cart cart-header'>
          You have {cartItems.length} in the cart{' '}
        </div>
      )}

      {order && (
        <Modal isOpen={true} onRequestClose={closeModal} ariaHideApp={false}>
          <Zoom>
            <button className='close-modal' onClick={closeModal}>
              x
            </button>
            <div className='order-details'>
              <h3 className='success-message'>Your order has been placed.</h3>
              <h2>Order {order._id}</h2>
              <ul>
                <li>
                  <div>Name:</div>
                  <div>{order.name}</div>
                </li>
                <li>
                  <div>Email:</div>
                  <div>{order.email}</div>
                </li>
                <li>
                  <div>Address:</div>
                  <div>{order.address}</div>
                </li>
                <li>
                  <div>Date:</div>
                  <div>{new Date(order.createdAt).toLocaleString()}</div>
                </li>
                <li>
                  <div>Total:</div>
                  <div>{formatCurrency(order.total)}</div>
                </li>
                <li>
                  <div>Cart Items:</div>
                  <div>
                    {order.cartItems.map((x) => (
                      <div>
                        {x.count} {' x '} {x.title}
                      </div>
                    ))}
                  </div>
                </li>
              </ul>
            </div>
          </Zoom>
        </Modal>
      )}

      <div>
        <div className='cart'>
          <Fade left cascade>
            <ul className='cart-items'>
              {cartItems.map((item) => (
                <li key={item._id}>
                  <div>
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div>
                    <div>{item.title}</div>
                    <div className='right'>
                      {formatCurrency(item.price)} x {item.count}{' '}
                      <button
                        className='button'
                        onClick={() => {
                          dispatch(removeFromCart(item));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Fade>
        </div>
        {cartItems.length !== 0 && (
          <div>
            <div className='cart'>
              <div className='total'>
                <div>
                  Total:{' '}
                  {formatCurrency(
                    cartItems.reduce((a, c) => a + c.price * c.count, 0)
                  )}
                </div>
                <button
                  onClick={() => {
                    setState({ ...state, showCheckout: true });
                  }}
                  className='button primary'
                >
                  Proceed
                </button>
              </div>
            </div>
            {state.showCheckout && (
              <Fade right cascade>
                <div className='cart'>
                  <form onSubmit={createOrder}>
                    <ul className='form-container'>
                      <li>
                        <label htmlFor='email'>Email</label>
                        <input
                          type='email'
                          name='email'
                          id='email'
                          required
                          onChange={handleInput}
                        />
                      </li>
                      <li>
                        <label htmlFor='name'>Name</label>
                        <input
                          type='text'
                          name='name'
                          id='name'
                          required
                          onChange={handleInput}
                        />
                      </li>
                      <li>
                        <label htmlFor='address'>Address</label>
                        <input
                          type='text'
                          name='address'
                          id='address'
                          required
                          onChange={handleInput}
                        />
                      </li>
                      <li>
                        <button className='button primary' type='submit'>
                          Checkout
                        </button>
                      </li>
                    </ul>
                  </form>
                </div>
              </Fade>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
