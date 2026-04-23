let allProducts = [];
let cart = [];
let selectedSize = null;
let selectedColor = null;
let modalQty = 1;

const WHATSAPP_NUMBER = "8801894357549"; // Apnar WhatsApp number

// ১. Data Load
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (e) {
        console.error("Data error", e);
    }
}

// ২. Display Products
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="bg-white rounded-3xl border border-gray-50 p-4 hover:shadow-2xl transition duration-500 cursor-pointer group" onclick="openModal(${p.id})">
            <div class="overflow-hidden rounded-2xl">
                <img src="${p.images[0]}" class="w-full h-72 object-cover group-hover:scale-110 transition duration-700">
            </div>
            <div class="pt-4 text-center">
                <h3 class="font-bold text-gray-800 text-[13px] uppercase tracking-tight">${p.name}</h3>
                <p class="font-black text-black mt-1 text-lg">৳ ${p.price}</p>
                <button class="mt-4 w-full bg-black text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-gray-800">Order Now</button>
            </div>
        </div>
    `).join('');
}

// ৩. Open Product Details
function openModal(id) {
    const p = allProducts.find(item => item.id === id);
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    
    selectedSize = null; 
    selectedColor = null; 
    modalQty = 1;

    content.innerHTML = `
        <div class="space-y-4">
            <img id="main-view" src="${p.images[0]}" class="w-full h-[450px] object-cover rounded-3xl shadow-xl">
            <div class="flex gap-3 overflow-x-auto p-1 no-scrollbar">
                ${p.images.map(img => `
                    <img src="${img}" onclick="document.getElementById('main-view').src='${img}'" 
                    class="w-20 h-24 object-cover rounded-xl cursor-pointer border-2 border-transparent hover:border-black transition shadow-sm">
                `).join('')}
            </div>
        </div>
        <div class="flex flex-col justify-center py-4">
            <span class="text-xs font-black uppercase text-gray-400 mb-2">${p.category}</span>
            <h2 class="text-3xl font-black mb-2 uppercase leading-none tracking-tighter text-gray-900">${p.name}</h2>
            <p class="text-2xl font-bold mb-8 text-black">৳ ${p.price}</p>
            
            <div class="mb-6">
                <p class="text-[10px] font-black uppercase mb-3 text-gray-400 tracking-widest">Select Color</p>
                <div class="flex flex-wrap gap-2">
                    ${p.colors.map(c => `<button onclick="selectFeature('color','${c}',this)" class="px-5 py-2 border-2 border-gray-100 rounded-full text-[10px] font-black uppercase hover:border-black transition-all">${c}</button>`).join('')}
                </div>
            </div>

            <div class="mb-8">
                <p class="text-[10px] font-black uppercase mb-3 text-gray-400 tracking-widest">Select Size</p>
                <div class="flex flex-wrap gap-2">
                    ${p.sizes.map(s => `<button onclick="selectFeature('size','${s}',this)" class="w-12 h-12 border-2 border-gray-100 rounded-2xl text-[12px] font-black uppercase flex items-center justify-center hover:border-black transition-all">${s}</button>`).join('')}
                </div>
            </div>

            <div class="mb-8 flex items-center gap-6">
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Quantity</p>
                <div class="flex items-center bg-gray-100 rounded-2xl p-1">
                    <button onclick="updateQty(-1)" class="w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-white rounded-xl transition">-</button>
                    <span id="modal-qty" class="px-6 font-black text-lg">1</span>
                    <button onclick="updateQty(1)" class="w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-white rounded-xl transition">+</button>
                </div>
            </div>

            <button onclick="addToCart(${p.id})" class="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10">
                Add To Bag
            </button>
        </div>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function updateQty(val) {
    modalQty = Math.max(1, modalQty + val);
    const qtyEl = document.getElementById('modal-qty');
    if(qtyEl) qtyEl.innerText = modalQty;
}

function selectFeature(type, val, el) {
    const btns = el.parentElement.getElementsByTagName('button');
    for (let b of btns) {
        b.classList.remove('bg-black', 'text-white', 'border-black');
        b.classList.add('border-gray-100');
    }
    el.classList.add('bg-black', 'text-white', 'border-black');
    el.classList.remove('border-gray-100');
    if(type === 'size') selectedSize = val; else selectedColor = val;
}

// ৪. Add To Cart
function addToCart(id) {
    if(!selectedSize || !selectedColor) {
        alert("Please select Color and Size!");
        return;
    }
    const p = allProducts.find(item => item.id === id);
    cart.push({ ...p, selectedSize, selectedColor, qty: modalQty });
    
    updateCartUI();
    closeModal();
    toggleCart(true); // Cart drawer open hobe
}

// ৫. Update Cart Sidebar
function updateCartUI() {
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countNav = document.getElementById('cart-count');
    const countDrawer = document.getElementById('cart-count-drawer');
    
    let total = 0;
    itemsEl.innerHTML = cart.map((item, index) => {
        total += (item.price * item.qty);
        return `
            <div class="flex gap-4 bg-white p-4 rounded-3xl border border-gray-100 relative group">
                <img src="${item.images[0]}" class="w-20 h-24 object-cover rounded-2xl shadow-sm">
                <div class="flex-1 flex flex-col justify-center">
                    <h4 class="font-black text-[11px] uppercase tracking-tight leading-tight">${item.name}</h4>
                    <p class="text-[9px] text-gray-400 font-bold uppercase mt-1">${item.selectedColor} / Size ${item.selectedSize}</p>
                    <div class="flex justify-between items-end mt-2">
                        <p class="font-black text-black">৳ ${item.price * item.qty}</p>
                        <p class="text-[10px] font-bold text-gray-300">QTY: ${item.qty}</p>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="absolute top-2 right-2 w-7 h-7 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-[10px] hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
            </div>
        `;
    }).join('');

    totalEl.innerText = `৳ ${total}`;
    countNav.innerText = cart.length;
    countDrawer.innerText = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cart-drawer');
    if (forceOpen === true) drawer.classList.remove('translate-x-full');
    else drawer.classList.toggle('translate-x-full');
}

function sendOrderToWhatsApp() {
    // HTML এর ID গুলোর সাথে মিলিয়ে ভ্যালু নেওয়া
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    // চেক করা হচ্ছে সব তথ্য দেওয়া হয়েছে কি না
    if (!name || !phone || !address) {
        alert("দয়া করে নাম, ফোন নম্বর এবং সম্পূর্ণ ঠিকানা লিখুন!");
        return;
    }

    if (cart.length === 0) {
        alert("আপনার কার্ট খালি!");
        return;
    }

    let message = `*NEW ORDER - REDAMS*%0A`;
    message += `---------------------------%0A`;
    message += `*Customer Details:*%0A`;
    message += `Name: ${name}%0A`;
    message += `Phone: ${phone}%0A`;
    message += `Address: ${address}%0A`;
    message += `---------------------------%0A`;
    message += `*Order Items:*%0A`;

    let total = 0;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.selectedColor}, ${item.selectedSize}) x ${item.qty} = ৳${item.price * item.qty}%0A`;
        total += (item.price * item.qty);
    });

    message += `---------------------------%0A`;
    message += `*Total Amount: ৳${total}*%0A`;
    message += `*Payment: Cash on Delivery*%0A`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
}
function closeModal() {
    document.getElementById('product-modal').classList.replace('flex', 'hidden');
}

window.onload = loadProducts;
