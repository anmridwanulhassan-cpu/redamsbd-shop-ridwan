let cart = [];

// কার্টে প্রোডাক্ট যোগ করার ফাংশন
function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').innerText = cart.length;
    alert(name + " কার্টে যোগ হয়েছে!");
}

// চেকআউট মডেল ওপেন/ক্লোজ করার ফাংশন
function toggleModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.toggle('hidden');
}

// হোয়াটসঅ্যাপে অর্ডার পাঠানোর মেইন ফাংশন
function sendToWhatsApp() {
    // ফর্ম থেকে তথ্য নেওয়া
    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    const phone = document.getElementById('cust-phone').value;

    // ভ্যালিডেশন
    if (cart.length === 0) {
        alert("আপনার কার্ট খালি! আগে প্রোডাক্ট যোগ করুন।");
        return;
    }

    if (!name || !address || !phone) {
        alert("দয়া করে নাম, ঠিকানা এবং ফোন নম্বর সবগুলো লিখুন।");
        return;
    }

    let productDetails = "";
    let totalPrice = 0;

    // কার্টের প্রোডাক্টগুলো সাজানো
    cart.forEach((item, index) => {
        productDetails += `${index + 1}. ${item.name} - ৳${item.price}%0A`;
        totalPrice += item.price;
    });

    // আপনার দেওয়া হোয়াটসঅ্যাপ নম্বর (৮৮ যোগ করা হয়েছে)
    const myNumber = "8801894357549"; 

    // মেসেজ ফরম্যাট
    const message = `*New Order - REDAMS*%0A%0A` +
                    `*Customer Details:*%0A` +
                    `Name: ${name}%0A` +
                    `Address: ${address}%0A` +
                    `Phone: ${phone}%0A%0A` +
                    `*Order Items:*%0A${productDetails}%0A` +
                    `*Total Bill:* ৳${totalPrice}%0A` +
                    `*Method:* Cash on Delivery`;

    // হোয়াটসঅ্যাপ ইউআরএল
    const whatsappUrl = `https://wa.me/${myNumber}?text=${message}`;

    // লিঙ্ক ওপেন করা
    window.open(whatsappUrl, '_blank');
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
let selectedSize = null;
let selectedColor = null;
let modalQty = 1; // কোয়ান্টিটি ট্র্যাকিং

const WHATSAPP_NUMBER = "8801894357549"; // আপনার নম্বর

async function loadProducts() {
    const res = await fetch('products.json');
    allProducts = await res.json();
    displayProducts(allProducts);
}

// ১. মেইন গ্রিডে প্রোডাক্ট দেখানো
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

// ২. পপ-আপে কোয়ান্টিটি এবং ডিজাইন আপডেট
function openModal(id) {
    const p = allProducts.find(item => item.id === id);
    const content = document.getElementById('modal-content');
    selectedSize = null; selectedColor = null; modalQty = 1; // রিসেট

    content.innerHTML = `
        <div class="space-y-4">
            <img id="main-view" src="${p.images[0]}" class="w-full h-[400px] object-cover rounded-xl shadow-md">
            <div class="flex gap-2 overflow-x-auto">
                ${p.images.map(img => `<img src="${img}" onclick="document.getElementById('main-view').src='${img}'" class="w-20 h-20 object-cover rounded cursor-pointer border hover:border-black">`).join('')}
            </div>
        </div>
        <div class="flex flex-col">
            <h2 class="text-2xl font-black mb-2 uppercase tracking-tighter">${p.name}</h2>
            <p class="text-xl font-bold mb-6 text-gray-700">৳ ${p.price}</p>
            
            <div class="mb-4">
                <p class="text-[10px] font-black uppercase mb-2">Select Color</p>
                <div class="flex gap-2" id="color-opts">
                    ${p.colors.map(c => `<button onclick="selectFeature('color','${c}',this)" class="px-4 py-2 border rounded-full text-[10px] font-black uppercase hover:border-black">${c}</button>`).join('')}
                </div>
            </div>

            <div class="mb-6">
                <p class="text-[10px] font-black uppercase mb-2">Select Size</p>
                <div class="flex gap-2" id="size-opts">
                    ${p.sizes.map(s => `<button onclick="selectFeature('size','${s}',this)" class="w-10 h-10 border rounded-full text-[10px] font-black uppercase hover:border-black flex items-center justify-center">${s}</button>`).join('')}
                </div>
            </div>

            <div class="mb-8 flex items-center gap-4">
                <p class="text-[10px] font-black uppercase">Quantity</p>
                <div class="flex items-center border border-black rounded-lg overflow-hidden">
                    <button onclick="updateQty(-1)" class="px-3 py-1 bg-gray-100 hover:bg-black hover:text-white transition font-bold border-r border-black">-</button>
                    <span id="modal-qty" class="px-5 font-black text-lg">1</span>
                    <button onclick="updateQty(1)" class="px-3 py-1 bg-gray-100 hover:bg-black hover:text-white transition font-bold border-l border-black">+</button>
                </div>
            </div>

            <button onclick="goToCheckout(${p.id})" class="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-lg">Confirm Order Details</button>
        </div>
    `;
    document.getElementById('product-modal').classList.replace('hidden', 'flex');
}

// ৩. কোয়ান্টিটি আপডেট ফাংশন
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

// ৪. কাস্টমার ডিটেইলস পেজে যাওয়ার ফাংশন
function goToCheckout(id) {
    if(!selectedSize || !selectedColor) return alert("দয়া করে সাইজ এবং কালার সিলেক্ট করুন!");
    const p = allProducts.find(item => item.id === id);
    
    // পপ-আপের কন্টেন্ট বদলে চেকআউট ফর্ম আনা
    const content = document.getElementById('modal-content');
    content.innerHTML = `
        <div class="col-span-full md:col-span-1 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
            <h3 class="text-sm font-black uppercase mb-4 text-center tracking-widest">Order Summary</h3>
            <div class="flex items-center gap-4">
                <img src="${p.images[0]}" class="w-20 h-24 object-cover rounded-lg border">
                <div>
                    <h4 class="font-bold text-sm uppercase">${p.name}</h4>
                    <p class="text-[10px] text-gray-500 font-bold uppercase mt-1">Color: ${selectedColor} | Size: ${selectedSize}</p>
                    <p class="font-black text-lg mt-1 text-black">৳ ${p.price * modalQty}</p>
                    <p class="text-[10px] text-gray-400 font-bold italic">(Qty: ${modalQty} x ৳${p.price})</p>
                </div>
            </div>
        </div>

        <div class="flex flex-col space-y-4">
            <h3 class="text-lg font-black uppercase tracking-tighter">Shipping Information</h3>
            <input type="text" id="cust-name" placeholder="আপনার পূর্ণ নাম" class="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-black transition">
            <input type="text" id="cust-phone" placeholder="ফোন নম্বর" class="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-black transition">
            <textarea id="cust-address" placeholder="সম্পূর্ণ ঠিকানা (গ্রাম/শহর, জেলা)" class="w-full p-4 border border-gray-200 rounded-xl outline-none h-24 focus:border-black transition"></textarea>
            
            <div class="bg-black text-white p-4 rounded-xl text-center">
                <p class="text-xs uppercase font-bold opacity-70">Total Amount (Cash on Delivery)</p>
                <p class="text-2xl font-black">৳ ${p.price * modalQty}</p>
            </div>

            <button onclick="finalWhatsAppOrder('${p.name}', ${p.price})" class="w-full bg-[#25D366] text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-green-600 transition shadow-xl flex items-center justify-center gap-2">
                <i class="fa-brands fa-whatsapp text-2xl"></i> Place Order on WhatsApp
            </button>
        </div>
    `;
}

// ৫. ফাইনাল হোয়াটসঅ্যাপ মেসেজ
function finalWhatsAppOrder(name, price) {
    const n = document.getElementById('cust-name').value;
    const ph = document.getElementById('cust-phone').value;
    const ad = document.getElementById('cust-address').value;

    if(!n || !ph || !ad) return alert("দয়া করে সব তথ্য পূরণ করুন!");

    let msg = `*NEW ORDER - REDAMS*%0A`;
    msg += `---------------------------%0A`;
    msg += `*Customer Details:*%0AName: ${n}%0APhone: ${ph}%0AAddress: ${ad}%0A`;
    msg += `---------------------------%0A`;
    msg += `*Product Info:*%0AProduct: ${name}%0AColor: ${selectedColor}%0ASize: ${selectedSize}%0AQty: ${modalQty}%0APrice: ৳${price * modalQty}%0A`;
    msg += `---------------------------%0A`;
    msg += `*Payment: Cash on Delivery*%0A`;
    msg += `Please confirm my order!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

function closeModal() { document.getElementById('product-modal').classList.replace('flex', 'hidden'); }
function filterCategory(c) { displayProducts(c==='all' ? allProducts : allProducts.filter(p => p.category === c)); }
window.onload = loadProducts;
