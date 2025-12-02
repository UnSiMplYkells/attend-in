
import styled from 'styled-components';
import { useCartItem } from './useCartItems';
import CartItem from './CartMenuItem';
import Loader from "../../ui/Loader"


const MenuContainer = styled.ul`
  display: flex;
  flex-direction: column;
`;

export default function CartMenu() {
  const { cartItems, isLoading } = useCartItem();

  if (isLoading) {
    return <Loader />; // Show loading state
  }

  if (!cartItems || cartItems.length === 0) {
    return <p>Your cart is empty.</p>; // Handle empty cart
  }

  return (
    <>
      <MenuContainer>
        {cartItems
          .map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
      </MenuContainer>
    </>
  );
}