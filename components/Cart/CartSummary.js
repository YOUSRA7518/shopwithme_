import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Button, Segment, Divider } from "semantic-ui-react";
import calculateCartTotal from "../../utils/calculateCartTotal";

function CartSummary({ products, handleCheckout, success }) {
  const [cartAmount, setCartAmount] = React.useState(0);
  const [stripeAmount, setStripeAmount] = React.useState(0);
  const [isCartEmpty, setCartEmpty] = React.useState(false);

  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong> Sous total :</strong> {cartAmount}€
        <StripeCheckout
          name="ShopWithMe"
          amount={stripeAmount}
          image={
            products.length > 0 && products[0].product
              ? products[0].product.mediaUrl
              : ""
          }
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey="pk_test_DoaDBT52fi3UoFLIkDC0r81c00gYXXP1GO"
          token={handleCheckout}
          triggerEvent="onClick"
        >
          <Button
            icon="cart"
            disabled={isCartEmpty || success}
            color="red"
            floated="right"
            content="Valider"
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
