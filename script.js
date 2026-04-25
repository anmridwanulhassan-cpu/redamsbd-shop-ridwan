let allProducts = [];
let cart = [];
let selectedSize = null;
let selectedColor = null;
let modalQty = 1;

const WHATSAPP_NUMBER = "8801894357549"; 

// ১. ইউআরএল থেকে ক্যাটাগরি নাম বের করার নিয়ম
function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('cat'); 
}

// ২. প্রোডাক্ট লোড এবং পেজ অনুযায়ী ফিল্টার করা
function loadProducts() {
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            
            const isShopPage = window.location.pathname.toLowerCase().includes('shop.html');
            const selectedCat = getCategoryFromURL();

            if (isShopPage) {
                if (selectedCat) {
                    const filtered = allProducts.filter(p => 
                        p.category.trim().toLowerCase() === selectedCat.trim().toLowerCase()
                    );
                    displayProducts(filtered, true); 
                    
                    const title = document.querySelector('h2');
                    if(title) title.innerText = selectedCat.replace('-', ' ').toUpperCase();
                } else {
                    displayProducts(allProducts, true);
                }
            } else {
                displayProducts(allProducts, false); // হোমপেজে ৮টি
            }
        })
        .catch(err => console.error("Error loading products:", err));
}

// ৩. প্রোডাক্ট গ্রিড রেন্ডার করা
function displayProducts(products, showAll = false) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const productsToShow = showAll ? products : products.slice(0, 8);

    if (productsToShow.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center"><p class="text-gray-400 font-bold uppercase tracking-widest text-sm">No items found</p></div>`;
    } else {
        grid.innerHTML = productsToShow.map(p => `
            <div class="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-2xl transition-all cursor-pointer group" onclick="openModal(${p.id})">
                <div class="relative overflow-hidden rounded-lg aspect-[3/4]">
                    <img src="${p.images[0]}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                </div>
                <div class="p-3 text-center">
                    <h3 class="font-bold text-gray-800 text-[11px] uppercase tracking-tighter">${p.name}</h3>
                    <p class="font-black text-black mt-1">৳ ${p.price}</p>
                    <button class="mt-3 w-full bg-black text-white py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest group-hover:bg-green-600 transition">Order Now</button>
                </div>
            </div>
        `).join('');
    }

    const viewAllBtn = document.getElementById('view-all-container');
    if (viewAllBtn) {
        viewAllBtn.style.display = (showAll || products.length <= 8) ? 'none' : 'block';
    }
}

// ৪. 'View All' বাটন ফাংশন
function showAllProducts() {
    displayProducts(allProducts, true);
    document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ৫. পপ-আপ (Modal) ওপেন
function openModal(id) {
    const p = allProducts.find(item => item.id === id);
    const content = document.getElementById('modal-content');
    selectedSize = null; selectedColor = null; modalQty = 1;

    content.innerHTML = `
        <div class="space-y-4">
            <img id="main-view" src="${p.images[0]}" class="w-full h-[400px] object-cover rounded-xl shadow-md">
            <div class="flex gap-2 overflow-x-auto p-1">
                ${p.images.map(img => `<img src="${img}" onclick="document.getElementById('main-view').src='${img}'" class="w-20 h-20 object-cover rounded cursor-pointer border hover:border-black transition">`).join('')}
            </div>
        </div>
        <div class="flex flex-col">
            <h2 class="text-2xl font-black mb-1 uppercase tracking-tighter">${p.name}</h2>
            <p class="text-xl font-bold mb-6 text-gray-800">৳ ${p.price}</p>
            <div class="mb-4">
                <p class="text-[10px] font-black uppercase mb-2 text-gray-400">Color</p>
                <div class="flex gap-2">
                    ${p.colors.map(c => `<button onclick="selectFeature('color','${c}',this)" class="px-4 py-2 border rounded-full text-[10px] font-black uppercase hover:bg-black hover:text-white transition">${c}</button>`).join('')}
                </div>
            </div>
            <div class="mb-6">
                <p class="text-[10px] font-black uppercase mb-2 text-gray-400">Size</p>
                <div class="flex gap-2">
                    ${p.sizes.map(s => `<button onclick="selectFeature('size','${s}',this)" class="w-10 h-10 border rounded-full text-[10px] font-black uppercase flex items-center justify-center hover:bg-black hover:text-white transition">${s}</button>`).join('')}
                </div>
            </div>
            <div class="mb-8 flex items-center gap-4">
                <div class="flex items-center border border-black rounded-lg overflow-hidden">
                    <button onclick="updateQty(-1)" class="px-3 py-1 bg-gray-50 hover:bg-black hover:text-white transition font-bold">-</button>
                    <span id="modal-qty" class="px-5 font-black">1</span>
                    <button onclick="updateQty(1)" class="px-3 py-1 bg-gray-50 hover:bg-black hover:text-white transition font-bold">+</button>
                </div>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition">Add To Cart</button>
        </div>
    `;
    document.getElementById('product-modal').classList.replace('hidden', 'flex');
}

function updateQty(val) { modalQty = Math.max(1, modalQty + val); document.getElementById('modal-qty').innerText = modalQty; }

function selectFeature(type, val, el) {
    const btns = el.parentElement.getElementsByTagName('button');
    for (let b of btns) b.classList.remove('bg-black', 'text-white');
    el.classList.add('bg-black', 'text-white');
    if (type === 'size') selectedSize = val; else selectedColor = val;
}

// ৬. কার্ট ফাংশনালিটি
function addToCart(id) {
    // SweetAlert for validation
    if (!selectedSize || !selectedColor) {
        Swal.fire({
            icon: 'warning',
            title: 'Wait!',
            text: 'Please select Color and Size.',
            confirmButtonColor: '#000'
        });
        return;
    }

    const p = allProducts.find(item => item.id === id);
    cart.push({ ...p, selectedSize, selectedColor, qty: modalQty, image: p.images[0] });
    
    // Toast notification for Success
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    });

    Toast.fire({
        icon: 'success',
        title: 'Added to Bag'
    });

    updateCartUI();
    closeModal();
    toggleCart(true);
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const freeDeliveryMsg = document.getElementById('free-delivery-msg');
    
    let subtotal = 0;
    let itemCount = 0;

    cartContainer.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.qty;
        itemCount += item.qty;
        return `
            <div class="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" class="w-12 h-12 object-cover rounded">
                    <div>
                        <h4 class="text-[10px] font-bold uppercase text-gray-800">${item.name}</h4>
                        <p class="text-[9px] text-gray-500">${item.selectedSize} | ${item.selectedColor}</p>
                        <p class="text-xs font-black">৳${item.price} x ${item.qty}</p>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:scale-110 transition">&times;</button>
            </div>
        `;
    }).join('');

    const deliveryOption = document.querySelector('input[name="delivery"]:checked');
    let deliveryCharge = parseInt(deliveryOption ? deliveryOption.value : 80);

    if (itemCount >= 3) {
        deliveryCharge = 0;
        if (freeDeliveryMsg) {
            freeDeliveryMsg.classList.remove('opacity-60', 'text-gray-500');
            freeDeliveryMsg.classList.add('opacity-100', 'text-green-600', 'scale-105');
            freeDeliveryMsg.innerHTML = "You've unlocked FREE DELIVERY! 🚚✅";
        }
    } else {
        if (freeDeliveryMsg) {
            freeDeliveryMsg.classList.add('opacity-60', 'text-gray-500');
            freeDeliveryMsg.classList.remove('opacity-100', 'text-green-600', 'scale-105');
            freeDeliveryMsg.innerHTML = "Buy 3 or more items to get FREE DELIVERY 🚚";
        }
    }

    const finalTotal = subtotal + deliveryCharge;

    if (totalElement) {
        totalElement.innerHTML = `
            <div class="space-y-1 mb-3">
                <div class="flex justify-between text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    <span>Subtotal</span>
                    <span>৳${subtotal}</span>
                </div>
                <div class="flex justify-between text-[10px] uppercase font-bold ${deliveryCharge === 0 ? 'text-green-600' : 'text-gray-400'} tracking-widest">
                    <span>Delivery</span>
                    <span>${deliveryCharge === 0 ? 'FREE' : '৳' + deliveryCharge}</span>
                </div>
                <div class="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
                    <span class="text-xs font-black uppercase">Final Total</span>
                    <span class="text-2xl font-black text-black tracking-tighter">৳${finalTotal}</span>
                </div>
            </div>
        `;
    }

    document.getElementById('cart-count-drawer').innerText = itemCount;
    const floatCount = document.getElementById('cart-count-float');
    if (floatCount) floatCount.innerText = itemCount;
}

function removeFromCart(index) { cart.splice(index, 1); updateCartUI(); }

function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    if (forceOpen === true) drawer.classList.remove('translate-x-full');
    else drawer.classList.toggle('translate-x-full');
}

function closeModal() { document.getElementById('product-modal').classList.replace('flex', 'hidden'); }

function confirmOrderWhatsApp() {
    const name = document.getElementById('final-name').value.trim();
    const phone = document.getElementById('final-phone').value.trim();
    const address = document.getElementById('final-address').value.trim();
    const deliveryOption = document.querySelector('input[name="delivery"]:checked');

    // SweetAlert for Order Validation
    if (!name || !phone || !address) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please provide your full shipping details.',
            confirmButtonColor: '#000'
        });
        return;
    }

    let subtotal = 0;
    let itemCount = 0;
    let itemsText = "";

    cart.forEach((item, index) => {
        itemsText += `${index + 1}. ${item.name} (${item.selectedSize}/${item.selectedColor}) x ${item.qty} = ৳${item.price * item.qty}%0A`;
        subtotal += item.price * item.qty;
        itemCount += item.qty;
    });

    let deliveryCharge = parseInt(deliveryOption ? deliveryOption.value : 80);
    let area = (deliveryCharge === 80) ? "Inside Dhaka" : "Outside Dhaka";
    let deliveryStatus = (itemCount >= 3) ? "FREE (Offer Applied 🚚)" : `৳${deliveryCharge}`;

    const finalTotal = subtotal + (itemCount >= 3 ? 0 : deliveryCharge);

    let message = `*NEW ORDER - REDAMS*%0A---------------------------%0A*Customer:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A*Area:* ${area}%0A---------------------------%0A*Items:*%0A${itemsText}---------------------------%0A*Subtotal:* ৳${subtotal}%0A*Delivery:* ${deliveryStatus}%0A*Final Total: ৳${finalTotal}*%0A---------------------------%0A_Order from Redams Website_`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

window.onload = loadProducts;
