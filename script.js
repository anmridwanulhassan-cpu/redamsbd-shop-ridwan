let allProducts = [];
let cart = [];
let selectedSize = null;
let selectedColor = null;
let modalQty = 1;

const WHATSAPP_NUMBER = "8801894357549";

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (e) { console.log("Data error", e); }
}

function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-xl transition cursor-pointer" onclick="openModal(${p.id})">
            <img src="${p.images[0]}" class="w-full h-64 object-cover rounded-lg">
            <div class="p-3 text-center">
                <h3 class="font-bold text-gray-800 text-[12px] uppercase">${p.name}</h3>
                <p class="font-black text-black mt-1">৳ ${p.price}</p>
                <button class="mt-3 w-full bg-black text-white py-2 rounded text-[10px] font-black uppercase tracking-widest">Order Now</button>
            </div>
        </div>
    `).join('');
}

function openModal(id) {
    const p = allProducts.find(item => item.id === id);
    const content = document.getElementById('modal-content');
    selectedSize = null; selectedColor = null; modalQty = 1;

    content.innerHTML = `
        <div class="space-y-4">
            <img id="main-view" src="${p.images[0]}" class="w-full h-[400px] object-cover rounded-xl shadow-md">
            <div class="flex gap-2 overflow-x-auto p-1">
                ${p.images.map(img => `<img src="${img}" onclick="document.getElementById('main-view').src='${img}'" class="w-20 h-20 object-cover rounded cursor-pointer border hover:border-black">`).join('')}
            </div>
        </div>
        <div class="flex flex-col">
            <h2 class="text-2xl font-black mb-2 uppercase">${p.name}</h2>
            <p class="text-xl font-bold mb-6 text-gray-700">৳ ${p.price}</p>
            <div class="mb-4">
                <p class="text-[10px] font-black uppercase mb-2">Color</p>
                <div class="flex gap-2">
                    ${p.colors.map(c => `<button onclick="selectFeature('color','${c}',this)" class="px-4 py-2 border rounded-full text-[10px] font-black uppercase hover:border-black">${c}</button>`).join('')}
                </div>
            </div>
            <div class="mb-6">
                <p class="text-[10px] font-black uppercase mb-2">Size</p>
                <div class="flex gap-2">
                    ${p.sizes.map(s => `<button onclick="selectFeature('size','${s}',this)" class="w-10 h-10 border rounded-full text-[10px] font-black uppercase flex items-center justify-center hover:border-black">${s}</button>`).join('')}
                </div>
            </div>
            <div class="mb-8 flex items-center gap-4">
                <p class="text-[10px] font-black uppercase">Qty</p>
                <div class="flex items-center border border-black rounded-lg">
                    <button onclick="updateQty(-1)" class="px-3 py-1 font-bold">-</button>
                    <span id="modal-qty" class="px-5 font-black">1</span>
                    <button onclick="updateQty(1)" class="px-3 py-1 font-bold">+</button>
                </div>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg">Add To Cart</button>
        </div>
    `;
    document.getElementById('product-modal').classList.replace('hidden', 'flex');
}

function updateQty(val) { modalQty = Math.max(1, modalQty + val); document.getElementById('modal-qty').innerText = modalQty; }

function selectFeature(type, val, el) {
    const btns = el.parentElement.getElementsByTagName('button');
    for (let b of btns) b.classList.remove('bg-black', 'text-white');
    el.classList.add('bg-black', 'text-white');
    if(type === 'size') selectedSize = val; else selectedColor = val;
}

function addToCart(id) {
    if(!selectedSize || !selectedColor) return alert("Select Color & Size first!");
    const p = allProducts.find(item => item.id === id);
    cart.push({ ...p, selectedSize, selectedColor, qty: modalQty });
    
    updateCartUI();
    closeModal();
    toggleCart(true); // সরাসরি কার্ট ওপেন করবে
}

function updateCartUI() {
    const itemsEl = document.getElementById('cart-items');
    let total = 0;
    itemsEl.innerHTML = cart.map((item, index) => {
        total += (item.price * item.qty);
        return `
            <div class="flex gap-4 bg-white p-3 rounded-lg border border-gray-100 relative">
                <img src="${item.images[0]}" class="w-16 h-20 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-bold text-[10px] uppercase">${item.name}</h4>
                    <p class="text-[8px] text-gray-400 font-bold uppercase">${item.selectedColor} | ${item.selectedSize}</p>
                    <p class="font-black text-xs mt-1">৳ ${item.price * item.qty} (x${item.qty})</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 text-xs font-bold">✕</button>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').innerText = `৳ ${total}`;
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-count-drawer').innerText = cart.length;
}

function removeFromCart(index) { cart.splice(index, 1); updateCartUI(); }

function toggleCart(open = false) {
    const drawer = document.getElementById('cart-drawer');
    if (open === true) drawer.classList.remove('translate-x-full');
    else drawer.classList.toggle('translate-x-full');
}

function sendOrderToWhatsApp() {
    // Input field gulo theke value neya
    const n = document.getElementById('cust-name').value.trim();
    const ph = document.getElementById('cust-phone').value.trim();
    const ad = document.getElementById('cust-address').value.trim();

    // Jodi kono field khali thake
    if (!n || !ph || !ad) {
        alert("Doya kore Name, Phone ebong Address sob gulo puron korun!");
        return;
    }

    // Jodi cart khali thake
    if (cart.length === 0) {
        alert("Apnar cart khali! Age product add korun.");
        return;
    }

    let msg = `*NEW ORDER - REDAMS*%0A`;
    msg += `*Customer:* ${n}%0A`;
    msg += `*Phone:* ${ph}%0A`;
    msg += `*Address:* ${ad}%0A`;
    msg += `---------------------------%0A`;

    let total = 0;
    cart.forEach((item, index) => {
        msg += `${index + 1}. ${item.name} (${item.selectedColor}, ${item.selectedSize}) x ${item.qty} = ৳${item.price * item.qty}%0A`;
        total += (item.price * item.qty);
    });

    msg += `---------------------------%0A`;
    msg += `*TOTAL AMOUNT: ৳${total}*%0A`;
    msg += `*(Cash on Delivery)*%0A%0A`;
    msg += `Please confirm my order!`;

    // WhatsApp-e niye jaoa
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(url, '_blank');
}
function closeModal() { document.getElementById('product-modal').classList.replace('flex', 'hidden'); }
function filterCategory(c) { displayProducts(c==='all' ? allProducts : allProducts.filter(p => p.category === c)); }
window.onload = loadProducts;
