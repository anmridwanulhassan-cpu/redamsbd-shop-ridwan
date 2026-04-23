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

// ১. ডাটা লোড করা
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error("প্রোডাক্ট লোড হয়নি:", error);
    }
}

// ২. মেইন পেজে প্রোডাক্ট কার্ড দেখানো
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = "";

    products.forEach(p => {
        grid.innerHTML += `
            <div class="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-500">
                <div class="relative overflow-hidden aspect-[3/4]">
                    <img src="${p.images[0]}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                         onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
                </div>
                <div class="p-5 text-center">
                    <h3 class="font-bold text-gray-900 text-sm md:text-base uppercase tracking-tight">${p.name}</h3>
                    <p class="text-black font-black mt-2 text-lg">৳ ${p.price}</p>
                    <button onclick="openModal(${p.id})" 
                            class="mt-4 w-full bg-black text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg">
                        View Details
                    </button>
                </div>
            </div>
        `;
    });
}

// ৩. পপ-আপে সব ডিটেইলস দেখানো
function openModal(id) {
    const p = allProducts.find(item => item.id === id);
    const content = document.getElementById('modal-content');
    selectedSize = null; selectedColor = null; // রিসেট

    content.innerHTML = `
        <div class="space-y-4">
            <img id="main-view" src="${p.images[0]}" class="w-full h-[400px] md:h-[500px] object-cover rounded-xl shadow-lg">
            <div class="flex gap-3 pb-2 overflow-x-auto">
                ${p.images.map(img => `
                    <img src="${img}" onclick="document.getElementById('main-view').src='${img}'" 
                         class="w-20 h-24 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-black transition">
                `).join('')}
            </div>
        </div>

        <div class="flex flex-col justify-center">
            <h2 class="text-3xl font-black text-gray-900 mb-2 leading-none uppercase tracking-tighter">${p.name}</h2>
            <p class="text-2xl font-bold text-black mb-8">৳ ${p.price}</p>
            
            <div class="mb-6">
                <p class="text-xs font-black uppercase mb-3 tracking-widest">Select Color</p>
                <div class="flex flex-wrap gap-2" id="color-options">
                    ${p.colors.map(c => `<button onclick="selectItem('color', '${c}', this)" class="px-5 py-2 border-2 border-gray-100 rounded-full text-xs font-bold uppercase hover:border-black transition">${c}</button>`).join('')}
                </div>
            </div>

            <div class="mb-10">
                <p class="text-xs font-black uppercase mb-3 tracking-widest">Select Size</p>
                <div class="flex flex-wrap gap-2" id="size-options">
                    ${p.sizes.map(s => `<button onclick="selectItem('size', '${s}', this)" class="w-12 h-12 border-2 border-gray-100 rounded-full flex items-center justify-center text-xs font-bold uppercase hover:border-black transition">${s}</button>`).join('')}
                </div>
            </div>

            <button onclick="handleOrder('${p.name}', ${p.price})" class="w-full bg-black text-white py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl">
                Order Now
            </button>
        </div>
    `;
    
    document.getElementById('product-modal').classList.remove('hidden');
    document.getElementById('product-modal').classList.add('flex');
}

function selectItem(type, val, el) {
    const btns = document.getElementById(type === 'size' ? 'size-options' : 'color-options').getElementsByTagName('button');
    for (let b of btns) b.classList.remove('bg-black', 'text-white', 'border-black');
    el.classList.add('bg-black', 'text-white', 'border-black');
    if(type==='size') selectedSize = val; else selectedColor = val;
}

function handleOrder(name, price) {
    if(!selectedSize || !selectedColor) return alert("দয়া করে সাইজ এবং কালার সিলেক্ট করুন!");
    alert(`Order Placed: ${name}\nColor: ${selectedColor}\nSize: ${selectedSize}\nPrice: ৳ ${price}`);
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
    document.getElementById('product-modal').classList.remove('flex');
}

window.onload = loadProducts;
