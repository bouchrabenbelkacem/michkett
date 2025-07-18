// Configuration
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_aLqxY0ceJ92E05keBGDf3--SZjwvA2t-XwtEHKiBU9IN6yt1uQwNFs74lkIBa5dr/exec"


// Remplacer les données des produits par des trophées :

const products = [
  {
    id: "001",
    hiddenId: "001",
    name: "Trophée 1 - Excellence BAC",
    description: "Trophée de félicitation pour réussite au Baccalauréat avec gravure personnalisée",
    price: "2500 dzd",
    image: "images/img1.jpg",
  },
  {
    id: "002",
    hiddenId: "002",
    name: "Trophée 2 - Réussite BEM",
    description: "Trophée de félicitation pour obtention du Brevet d'Enseignement Moyen",
    price: "2500 dzd",
    image: "images/img2.jpg",
  },
  {
    id: "003",
    hiddenId: "003",
    name: "Trophée 3 - Mention Très Bien",
    description: "Trophée spécial pour mention Très Bien au BAC ou BEM",
    price: "2500 dzd",
    image: "images/img3.jpg",
  },
  {
    id: "004",
    hiddenId: "004",
    name: "Trophée 4 - Mérite Scolaire",
    description: "Trophée de reconnaissance pour excellence scolaire générale",
    price: "2500 dzd",
    image: "images/img4.jpg",
  },
  {
    id: "005",
    hiddenId: "005",
    name: "Trophée 5 - Persévérance",
    description: "Trophée pour récompenser l'effort et la persévérance scolaire",
    price: "2500 dzd",
    image: "images/img5.jpg",
  },
  {
    id: "006",
    hiddenId: "006",
    name: "Trophée 6 - Diplômé",
    description: "Trophée universel pour toute réussite de diplôme",
    price: "2500 dzd",
    image: "images/img6.jpg",
  },
]

// Variables globales
let selectedProduct = ""
let selectedProductId = ""

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  generateProducts()
  setupEventListeners()
  setupFAQ() // AJOUTER cette ligne
})

// Générer les produits
function generateProducts() {
  const productsGrid = document.getElementById("productsGrid")

  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.onclick = () => selectProduct(product, productCard)

    productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200/fbbf24/000000?text=${encodeURIComponent(product.name)}'">
                <div class="product-badge">ID: ${product.id}</div>
                <div class="selected-overlay">
                    <div class="selected-badge">✓ Sélectionné</div>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <button class="select-btn">Sélectionner</button>
                </div>
            </div>
            <input type="hidden" class="product-hidden-id" value="${product.hiddenId}">
        `

    productsGrid.appendChild(productCard)
  })
}

// Sélectionner un produit
function selectProduct(product, cardElement) {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.classList.remove("selected")
  })

  cardElement.classList.add("selected")
  selectedProduct = product.name
  selectedProductId = product.hiddenId

  document.getElementById("produit").value = product.name
  document.getElementById("produit").style.background = "#fffbeb"
  document.getElementById("produit").style.borderColor = "#fbbf24"

  document.getElementById("productHelp").style.display = "none"
  updateSubmitButton()
  scrollToSection("order-form")

  console.log(`Produit sélectionné: ${product.name} (ID caché: ${product.hiddenId})`)
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
  const form = document.getElementById("orderForm")
  const inputs = form.querySelectorAll("input, textarea, select")

  inputs.forEach((input) => {
    input.addEventListener("input", updateSubmitButton)
    input.addEventListener("change", updateSubmitButton) // Pour les select
  })

  form.addEventListener("submit", handleSubmit)
}

// Ajouter la fonctionnalité FAQ après la fonction setupEventListeners

// Ajouter cette fonction après setupEventListeners() :
function setupFAQ() {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    question.addEventListener("click", () => {
      // Fermer tous les autres items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active")
        }
      })

      // Toggle l'item actuel
      item.classList.toggle("active")
    })
  })
}

// Modifier le champ personnalisation pour qu'il soit requis dans updateSubmitButton :
function updateSubmitButton() {
  const form = document.getElementById("orderForm")
  const submitBtn = document.getElementById("submitBtn")
  const formData = new FormData(form)

  let isValid = true

  // Vérifier tous les champs requis (personnalisation maintenant requis)
  const requiredFields = ["nom", "prenom", "telephone", "produit", "quantite", "personalisation", "adresse"]

  for (const field of requiredFields) {
    const value = formData.get(field)
    if (!value || !value.toString().trim()) {
      isValid = false
      break
    }
  }

  // Vérifier qu'un produit est sélectionné
  if (!selectedProduct || !selectedProductId) {
    isValid = false
  }

  submitBtn.disabled = !isValid
}

// Gérer la soumission du formulaire
function handleSubmit(e) {
  e.preventDefault()

  const submitBtn = document.getElementById("submitBtn")
  const submitMessage = document.getElementById("submitMessage")
  const form = document.getElementById("orderForm")

  // Désactiver le bouton
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...'

  // Préparer les données (AVEC les nouveaux champs)
  const formData = new FormData(form)
  const data = {
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    telephone: formData.get("telephone"),
    produit: formData.get("produit"),
    produitId: selectedProductId,
    quantite: formData.get("quantite"), // NOUVEAU
    personalisation: formData.get("personalisation") || "Aucune", // NOUVEAU
    adresse: formData.get("adresse"),
    timestamp: new Date().toISOString(),
  }

  console.log("🚀 Envoi des données:", data)

  // Construire l'URL avec les paramètres GET
  const params = new URLSearchParams(data)
  const urlWithParams = `${GOOGLE_SCRIPT_URL}?${params.toString()}`

  console.log("🌐 URL complète:", urlWithParams)

  // Créer une image invisible pour envoyer la requête GET
  const img = new Image()

  img.onload = () => {
    console.log("✅ Requête envoyée avec succès")
    showSuccess()
  }

  img.onerror = () => {
    console.log("✅ Requête traitée (erreur normale pour une image)")
    showSuccess()
  }

  // Envoyer la requête
  img.src = urlWithParams

  function showSuccess() {
    // Succès
    submitMessage.className = "submit-message success"
    submitMessage.textContent = "✅ Commande envoyée avec succès ! Nous vous contacterons bientôt."

    // Réinitialiser le formulaire
    form.reset()
    selectedProduct = ""
    selectedProductId = ""
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.remove("selected")
    })
    document.getElementById("productHelp").style.display = "block"

    // Réactiver le bouton
    submitBtn.disabled = false
    submitBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Passer votre commande'
    updateSubmitButton()
  }

  // Timeout de sécurité
  setTimeout(() => {
    if (submitBtn.disabled) {
      showSuccess()
    }
  }, 3000)
}

// Fonction de scroll fluide
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Gestion du scroll pour le header
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.background = "rgba(0, 0, 0, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.background = "#000"
    header.style.backdropFilter = "none"
  }
})
