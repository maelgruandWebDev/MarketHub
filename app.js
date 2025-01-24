import { db, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Panier
let cart = [];
let userBalance = 0; // Solde utilisateur

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

// Ajouter des produits à Firestore
async function addProductToFirestore(name, price) {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      name: name,
      price: price,
    });
    console.log("Produit ajouté avec ID : ", docRef.id);
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit : ", error);
  }
}

// Récupérer les produits depuis Firestore
async function fetchProductsFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const products = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return products;
}

// Afficher les produits
async function displayProducts() {
  const products = await fetchProductsFromFirestore();
  productList.innerHTML = ""; // Réinitialiser la liste
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <h3>${product.name}</h3>
      <p>Prix : ${product.price} €</p>
      <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Ajouter au panier</button>
    `;
    productList.appendChild(productDiv);
  });
}

// Ajouter au panier
function addToCart(productId, name, price) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: productId, name, price, quantity: 1 });
  }
  updateCart();
}

// Supprimer du panier
function removeFromCart(productId) {
  const productIndex = cart.findIndex(item => item.id === productId);
  if (productIndex !== -1) {
    cart[productIndex].quantity--;
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1);
    }
    updateCart();
  }
}

// Mettre à jour le panier
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
      <button onclick="removeFromCart('${item.id}')">Supprimer</button>
    `;
    cartItems.appendChild(cartItemDiv);
  });

  cartTotal.textContent = total;
  userBalanceElement.textContent = userBalance - total;
}

// Passer la commande
checkoutButton.addEventListener("click", () => {
  const total = parseFloat(cartTotal.textContent);
  if (total <= userBalance) {
    userBalance -= total;
    alert("Commande passée !");
    cart = [];
    updateCart();
  } else {
    alert("Solde insuffisant !");
  }
});

// Définir le solde
setBalanceButton.addEventListener("click", () => {
  const balance = parseFloat(balanceInput.value);
  if (!isNaN(balance) && balance >= 0) {
    userBalance = balance;
    userBalanceElement.textContent = userBalance;
    balanceInput.disabled = true;
    setBalanceButton.disabled = true;
  } else {
    alert("Montant invalide !");
  }
});

// Charger les produits au démarrage
document.addEventListener("DOMContentLoaded", displayProducts);
