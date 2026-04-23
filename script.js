let cart = []; // কার্ট লিস্ট

// কার্টে অ্যাড করার ফাংশন
function addToCart(id) {
    if(!selectedSize || !selectedColor) return alert("Please select Color and Size!");
    const p = allProducts.find(item => item.id === id);
    
    // কার্টে নতুন আইটেম যোগ করা
    cart.push({
        ...p,
        selectedSize,
        selectedColor,
        qty: modalQty
    });
    
    updateCartUI();
    closeModal();
    toggleCart(true); // কার্ট ড্রয়ার ওপেন হবে
}

// কার্ট আপডেট করা
function updateCartUI() {
    const itemsEl = document.getElementById('cart-items');
    const floatBtn = document.getElementById('floating-checkout');
    const navCount = document.getElementById('cart-count');
    const floatCount = document.getElementById('cart-count-float');
    let total = 0;

    itemsEl.innerHTML = cart.map((item, index) => {
        total += (item.price * item.qty);
        return `
            <div class="flex gap-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm relative">
                <img src="${item.images[0]}" class="w-16 h-20 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-bold text-[11px] uppercase">${item.name}</h4>
                    <p class="text-[9px] text-gray-400 font-bold uppercase">${item.selectedColor} | ${item.selectedSize}</p>
                    <p class="font-black text-sm mt-1">৳ ${item.price * item.qty} <span class="text-[10px] font-normal text-gray-400">(x${item.qty})</span></p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 text-xs">✕</button>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').innerText = `৳ ${total}`;
    navCount.innerText = cart.length;
    floatCount.innerText = cart.length;

    // কার্টে প্রোডাক্ট থাকলে ফ্লোটিং বাটন দেখাবে
    if (cart.length > 0) floatBtn.classList.remove('hidden');
    else floatBtn.classList.add('hidden');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart(open = false) {
    const drawer = document.getElementById('cart-drawer');
    if (open) drawer.classList.remove('translate-x-full');
    else drawer.classList.toggle('translate-x-full');
}

// হোয়াটসঅ্যাপে সব অর্ডার পাঠানো
function sendOrderToWhatsApp() {
    const n = document.getElementById('cust-name').value;
    const ph = document.getElementById('cust-phone').value;
    const ad = document.getElementById('cust-address').value;

    if(!n || !ph || !ad || cart.length === 0) return alert("Fill all details & add products!");

    let msg = `*NEW MULTIPLE ORDER - REDAMS*%0A*Customer:* ${n}%0A*Phone:* ${ph}%0A*Address:* ${ad}%0A-----------------%0A`;
    let total = 0;
    cart.forEach((item, i) => {
        msg += `${i+1}. ${item.name} (${item.selectedColor}, ${item.selectedSize}) x ${item.qty} = ৳${item.price * item.qty}%0A`;
        total += (item.price * item.qty);
    });
    msg += `-----------------%0A*TOTAL AMOUNT: ৳${total}*%0A(Cash on Delivery)`;
    
    window.open(`https://wa.me/${8801894357549}?text=${msg}`, '_blank');
}
// পপআপ বন্ধ করার ফাংশন
function closePopup() {
    document.getElementById('event-popup').classList.add('hidden');
}

// ওয়েবসাইট লোড হওয়ার ১০ সেকেন্ড পর পপআপ দেখানোর লজিক (একবার দেখাবে)
window.addEventListener('load', function() {
    // চেক করা হচ্ছে কাস্টমার কি আগে পপআপ দেখেছে কি না
    const hasSeenPopup = localStorage.getItem('hasSeenSpecialOffer');

    if (!hasSeenPopup) {
        setTimeout(function() {
            document.getElementById('event-popup').classList.remove('hidden');
            
            // পপআপ একবার দেখানোর পর লোকাল স্টোরেজে সেভ করে রাখা
            localStorage.setItem('hasSeenSpecialOffer', 'true');
        }, 10000); // ১০ সেকেন্ড দেরি
    }
});
let allProducts = [];
let cart = []; // একাধিক প্রোডাক্ট জমা রাখার জন্য
let selectedSize = null;
let selectedColor = null;
let modalQty = 1;

const WHATSAPP_NUMBER = "8801894357549"; // আপনার নম্বর

async function loadProducts() {
    const res = await fetch('products.json');
    allProducts = await res.json();
    displayProducts(allProducts);
}

// ১. মেইন পেজে প্রোডাক্ট দেখানো
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
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

// ২. পপ-আপ ওপেন করা (Add To Cart বাটনসহ)
function openModal(id) {
    const p = allProducts.find(item => item.id === id);
    const content = document.getElementById('modal-content');
    selectedSize = null; selectedColor = null; modalQty = 1; // রিসেট

    content.innerHTML = `
        <div class="space-y-4">
            <img id="main-view" src="${p.images[0]}" class="w-full h-[400px] object-cover rounded-xl shadow-md">
            <div class="flex gap-2 overflow-x-auto">
                ${p.images.map(img => `<img src="${img}" onclick="document.getElementById('main-view').src='${img}'" class="w-20 h-20 object-cover rounded cursor-pointer border hover:border-black transition">`).join('')}
            </div>
        </div>
        <div class="flex flex-col justify-center">
            <h2 class="text-2xl font-black mb-2 uppercase tracking-tighter">${p.name}</h2>
            <p class="text-xl font-bold mb-6 text-gray-700">৳ ${p.price}</p>
            
            <div class="mb-4">
                <p class="text-[10px] font-black uppercase mb-2">Select Color</p>
                <div class="flex gap-2" id="color-opts">
                    ${p.colors.map(c => `<button onclick="selectFeature('color','${c}',this)" class="px-4 py-2 border rounded-full text-[10px] font-black uppercase hover:border-black transition">${c}</button>`).join('')}
                </div>
            </div>

            <div class="mb-6">
                <p class="text-[10px] font-black uppercase mb-2">Select Size</p>
                <div class="flex gap-2" id="size-opts">
                    ${p.sizes.map(s => `<button onclick="selectFeature('size','${s}',this)" class="w-10 h-10 border rounded-full text-[10px] font-black uppercase hover:border-black flex items-center justify-center transition">${s}</button>`).join('')}
                </div>
            </div>

            <div class="mb-8 flex items-center gap-4">
                <p class="text-[10px] font-black uppercase">Quantity</p>
                <div class="flex items-center border border-black rounded-lg overflow-hidden">
                    <button onclick="updateQty(-1)" class="px-3 py-1 bg-gray-50 hover:bg-black hover:text-white transition font-bold border-r border-black">-</button>
                    <span id="modal-qty" class="px-5 font-black text-lg">1</span>
                    <button onclick="updateQty(1)" class="px-3 py-1 bg-gray-100 hover:bg-black hover:text-white transition font-bold border-l border-black">+</button>
                </div>
            </div>

            <button onclick="addToCart(${p.id})" class="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-lg">
                Add To Cart
            </button>
        </div>
    `;
    document.getElementById('product-modal').classList.replace('hidden', 'flex');
}

// ৩. কোয়ান্টিটি আপডেট
function updateQty(val) {
    modalQty = Math.max(1, modalQty + val);
    document.getElementById('modal-qty').innerText = modalQty;
}

function selectFeature(type, val, el) {
    const btns = el.parentElement.getElementsByTagName('button');
    for (let b of btns) b.classList.remove('bg-black', 'text-white');
    el.classList.add('bg-black', 'text-white');
    if(type === 'size') selectedSize = val; else selectedColor = val;
}

// ৪. কার্টে আইটেম যোগ করা
function addToCart(id) {
    if(!selectedSize || !selectedColor) return alert("দয়া করে সাইজ এবং কালার সিলেক্ট করুন!");
    const p = allProducts.find(item => item.id === id);
    
    // কার্টে নতুন অবজেক্ট হিসেবে পুশ করা
    cart.push({
        ...p,
        selectedSize,
        selectedColor,
        qty: modalQty
    });
    
    updateCartUI(); // কার্ট ইন্টারফেস আপডেট
    closeModal();   // পপ-আপ বন্ধ
    toggleCart(true); // কার্ট ড্রয়ার ওপেন
}

// ৫. কার্ট ইন্টারফেস আপডেট
function updateCartUI() {
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const navCount = document.getElementById('cart-count');
    const drawerCount = document.getElementById('cart-count-drawer');
    const floatBtn = document.getElementById('floating-checkout');
    
    let total = 0;
    itemsEl.innerHTML = cart.map((item, index) => {
        total += (item.price * item.qty);
        return `
            <div class="flex gap-4 bg-white p-3 rounded-lg border border-gray-100 relative">
                <img src="${item.images[0]}" class="w-16 h-20 object-cover rounded shadow-sm">
                <div class="flex-1">
                    <h4 class="font-bold text-[10px] uppercase">${item.name}</h4>
                    <p class="text-[8px] text-gray-400 font-bold uppercase">${item.selectedColor} | ${item.selectedSize}</p>
                    <p class="font-black text-xs mt-1">৳ ${item.price * item.qty} <span class="text-[9px] font-normal text-gray-400">(x${item.qty})</span></p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 text-xs">✕</button>
            </div>
        `;
    }).join('');

    totalEl.innerText = `৳ ${total}`;
    navCount.innerText = cart.length;
    drawerCount.innerText = cart.length;

    // কার্টে প্রোডাক্ট থাকলে ফ্লোটিং বাটন দেখাবে
    if (floatBtn) {
        cart.length > 0 ? floatBtn.classList.remove('hidden') : floatBtn.classList.add('hidden');
        document.getElementById('cart-count-float').innerText = cart.length;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cart-drawer');
    if (forceOpen) drawer.classList.remove('translate-x-full');
    else drawer.classList.toggle('translate-x-full');
}

// ৬. হোয়াটসঅ্যাপে সব ডিটেইলস পাঠানো
function sendOrderToWhatsApp() {
    const n = document.getElementById('cust-name').value;
    const ph = document.getElementById('cust-phone').value;
    const ad = document.getElementById('cust-address').value;

    if(!n || !ph || !ad || cart.length === 0) return alert("সব তথ্য পূরণ করুন এবং কার্টে প্রোডাক্ট যোগ করুন!");

    let msg = `*NEW ORDER - REDAMS*%0A*Customer:* ${n}%0A*Phone:* ${ph}%0A*Address:* ${ad}%0A-----------------%0A`;
    let total = 0;
    cart.forEach((item, i) => {
        msg += `${i+1}. ${item.name} (${item.selectedColor}, ${item.selectedSize}) x ${item.qty} = ৳${item.price * item.qty}%0A`;
        total += (item.price * item.qty);
    });
    msg += `-----------------%0A*TOTAL: ৳${total}*%0A(Cash on Delivery)`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

function closeModal() { document.getElementById('product-modal').classList.replace('flex', 'hidden'); }
function filterCategory(c) { displayProducts(c==='all' ? allProducts : allProducts.filter(p => p.category === c)); }
window.onload = loadProducts;
