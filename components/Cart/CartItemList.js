import {
  Header,
  Segment,
  Button,
  Icon,
  Item,
  Message
} from "semantic-ui-react";
import { useRouter } from "next/router";

function CartItemList({ products, user, handleRemoveFromCart, success }) {
  const router = useRouter();

  function mapCartProductsToItems(products) {
    console.log(products);
    return products.map(p => ({
      childKey: p.product && p.product._id,
      header: (
        <Item.Header
          as="a"
          onClick={() => router.push(`/product?_id=${p.product._id}`)}
        >
          {p.product && p.product.name}
        </Item.Header>
      ),
      image: p.product && p.product.mediaUrl,
      meta: `${p.quantity} x ${p.product && p.product.price}€`,
      fluid: "true",
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => handleRemoveFromCart(p.product && p.product._id)}
        />
      )
    }));
  }

  if (success) {
    return (
      <Message
        success
        header="Valider!"
        content="Votre commande et votre paiement ont été acceptés"
        icon="star outline"
      />
    );
  }

  if (products.length === 0) {
    return (
      <Segment secondary color="red" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          Aucun produit dans votre panier. Ajoutez-en!
        </Header>
        <div>
          {user ? (
            <Button color="grey" onClick={() => router.push("/")}>
              Voir les produits
            </Button>
          ) : (
            <Button color="grey" onClick={() => router.push("/login")}>
              Connectez-vous pour ajouter des produits
            </Button>
          )}
        </div>
      </Segment>
    );
  }

  return <Item.Group divided items={mapCartProductsToItems(products)} />;
}

export default CartItemList;
