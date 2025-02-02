// Données des produits
const products = [
  { id: 1, name: "Carte du site web", price: 2, image: "face1.png", description: "Une carte détaillée de votre site web pour une meilleure navigation." },
  // Ajoutez d'autres produits ici
];

// Panier
let cart = [];

// Solde utilisateur
let userBalance = 0; // Solde initial à 0

// Sélection des éléments du DOM
const productList = document.querySelector(".product-list");
const cartPopup = document.getElementById("cart-popup");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const userBalanceElement = document.getElementById("user-balance");
const openCartButton = document.getElementById("open-cart");
const closePopupButton = document.getElementById("close-popup");
const checkoutButton = document.getElementById("checkout-button");
const setBalanceButton = document.getElementById("set-balance-button");
const balanceInput = document.getElementById("balance-input");

// Affichage des produits
products.forEach(product => {
  const productDiv = document.createElement("div");
  productDiv.classList.add("product");
  productDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px; object-fit: cover;" />
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <p>Prix : ${product.price} €</p>
    <button onclick="addToCart(${product.id})">Ajouter au panier</button>
  `;
  productList.appendChild(productDiv);
});

// Ajouter un produit au panier
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

// Réduire une quantité ou supprimer un produit du panier
function removeFromCart(productId) {
  const productIndex = cart.findIndex(item => item.id === productId);

  if (productIndex !== -1) {
    cart[productIndex].quantity--;

    // Si la quantité atteint zéro, retirer l'article du panier
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1);
    }

    updateCart();
  }
}

// Affichage du panier
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");
    cartItemDiv.innerHTML = `
      <h4>${item.name}</h4>
      <p>Prix : ${item.price} €</p>
      <p>Quantité : ${item.quantity}</p>
      <button onclick="removeFromCart(${item.id})">Supprimer une quantité</button>
    `;
    cartItems.appendChild(cartItemDiv);
  });

  cartTotal.textContent = total;

  // Mise à jour du solde
  userBalanceElement.textContent = userBalance - total;
}

// Ouvrir la popup du panier
openCartButton.addEventListener("click", () => {
  cartPopup.style.display = "flex";
});

// Fermer la popup
closePopupButton.addEventListener("click", () => {
  cartPopup.style.display = "none";
});

// Passer la commande
checkoutButton.addEventListener("click", () => {
  const total = parseFloat(cartTotal.textContent);
  
  // Vérification que le total est un nombre valide
  if (isNaN(total)) {
    alert("Erreur : le total du panier n'est pas valide !");
    return;
  }

  if (total <= userBalance) {
    userBalance -= total; // Déduction du solde
    alert(`Commande passée de ${total} € avec succès ! Votre nouveau solde est de ${userBalance} €.`);

    cart = []; // Vider le panier après la commande
    updateCart(); // Mettre à jour l'affichage du panier

    // Mettre à jour l'affichage du solde
    userBalanceElement.textContent = userBalance;
  } else {
    alert("Solde insuffisant pour passer la commande.");
  }
});

// Définir le solde
setBalanceButton.addEventListener("click", () => {
  const balance = parseFloat(balanceInput.value);
  if (isNaN(balance) || balance < 0) {
    alert("Veuillez entrer un montant valide pour votre solde.");
  } else {
    userBalance = balance;
    userBalanceElement.textContent = userBalance;
    balanceInput.disabled = true; // Désactiver l'input après la saisie
    setBalanceButton.disabled = true; // Désactiver le bouton
    alert("Solde mis à jour avec succès ! Votre nouveau solde est de " + userBalance + " €.");
    setBalanceButton.style.display = "none";
    balanceInput.style.display = "none";
    document.querySelector(".balance").style.display = "none";
  }
});
