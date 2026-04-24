let allProducts = [];
let cart = [];
let selectedSize = null;
let selectedColor = null;
let modalQty = 1;

const WHATSAPP_NUMBER = "8801894357549"; 

// ১. প্রোডাক্ট লোড করা
async function loadProducts() {
    try {
        const res = await fetch('products.json');
        allProducts = await res.json();
        displayProducts(allProducts);
    } catch (err) { console.error("JSON Error:", err); }
}

// ২. গ্রিডে প্রোডাক্ট দেখানো
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-xl transition cursor-pointer group" onclick="openModal(${p.id})">
            <div class="overflow-hidden rounded-lg">
                <img src="${p.images[0]}" class="w-full h-64 object-cover group-hover:scale-110 transition duration-500">
            </div>
            <div class="p-3 text-center">
                <h3 class="font-bold text-gray-800 text-[12px] uppercase">${p.name}</h3>
                <p class="font-black text-black mt-1">৳ ${p.price}</p>
                <button class="mt-3 w-full bg-black text-white py-2 rounded text-[10px] font-black uppercase tracking-widest">View Details</button>
            </div>
        </div>
    `).join('');
}

// ৩. পপ-আপ (Modal) ওপেন
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

// ৪. কার্টে আইটেম যোগ করা
function addToCart(id) {
    if (!selectedSize || !selectedColor) return alert("Select Color & Size!");
    const p = allProducts.find(item => item.id === id);
    cart.push({ ...p, selectedSize, selectedColor, qty: modalQty });
    updateCartUI();
    closeModal();
    toggleCart(true);
}

// ৫. কার্ট আপডেট
function updateCartUI() {
    const itemsEl = document.getElementById('cart-items');
    let total = 0;
    itemsEl.innerHTML = cart.map((item, index) => {
        total += (item.price * item.qty);
        return `<div class="flex gap-4 bg-white p-3 rounded-lg border border-gray-100 relative shadow-sm">
            <img src="${item.images[0]}" class="w-16 h-20 object-cover rounded shadow-xs">
            <div class="flex-1">
                <h4 class="font-bold text-[10px] uppercase">${item.name}</h4>
                <p class="text-[8px] text-gray-400 font-bold uppercase">${item.selectedColor} | ${item.selectedSize} (x${item.qty})</p>
                <p class="font-black text-xs mt-1">৳ ${item.price * item.qty}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="text-red-400 text-xs font-bold p-1">✕</button>
        </div>`;
    }).join('');

    document.getElementById('cart-total').innerText = `৳ ${total}`;
    document.getElementById('cart-count-drawer').innerText = cart.length;
    const navCount = document.getElementById('cart-count');
    if(navCount) navCount.innerText = cart.length;
}

function removeFromCart(index) { cart.splice(index, 1); updateCartUI(); }

function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    if (forceOpen === true) drawer.classList.remove('translate-x-full');
    else drawer.classList.toggle('translate-x-full');
}
// এই ফাংশনটি অটোমেটিক কাজ করবে যখনই আপনি কোনো ফিল্ডে লিখবেন
document.addEventListener('input', function(e) {
    // ইনপুট ফিল্ড থেকে তথ্য নেওয়া
    const name = document.getElementById('final-name')?.value.trim() || "";
    const phone = document.getElementById('final-phone')?.value.trim() || "";
    const address = document.getElementById('final-address')?.value.trim() || "";
    
    // কার্ট থেকে আইটেমগুলো সাজানো
    let orderDetails = "";
    let grandTotal = 0;
    
    if (cart && cart.length > 0) {
        cart.forEach((item, index) => {
            orderDetails += `${index + 1}. ${item.name} (${item.selectedColor}, ${item.selectedSize}) x ${item.qty}%0A`;
            grandTotal += (item.price * item.qty);
        });
    }

    // মেসেজ তৈরি করা
    let message = `*NEW ORDER - REDAMS*%0A`;
    message += `*Customer:* ${name}%0A`;
    message += `*Phone:* ${phone}%0A`;
    message += `*Address:* ${address}%0A`;
    message += `---------------------------%0A`;
    message += `*Items:*%0A${orderDetails}`;
    message += `---------------------------%0A`;
    message += `*Total: ৳${grandTotal}*`;

    // লিঙ্কে মেসেজটি পুশ করা
    const confirmBtn = document.getElementById('confirm-link');
    if (confirmBtn) {
        confirmBtn.href = `https://wa.me/8801894357549?text=${message}`;
    }
});

// বাটন ক্লিক করার সময় চেক করা (নিরাপত্তার জন্য)
document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'confirm-link' || e.target.closest('#confirm-link'))) {
        const name = document.getElementById('final-name')?.value.trim();
        if (!name || name === "") {
            e.preventDefault(); // লিঙ্কটি ওপেন হতে বাধা দেবে
            alert("দয়া করে আপনার নাম, ফোন এবং ঠিকানা আগে লিখুন!");
        }
    }
});
function closeModal() { document.getElementById('product-modal').classList.replace('flex', 'hidden'); }
function filterCategory(c) { displayProducts(c==='all' ? allProducts : allProducts.filter(p => p.category === c)); }

window.onload = loadProducts;
