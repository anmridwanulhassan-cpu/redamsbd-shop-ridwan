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

// ১. JSON ফাইল থেকে ডাটা লোড করা
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error("প্রোডাক্ট লোড করতে সমস্যা হয়েছে:", error);
    }
}

// ২. গ্রিডে প্রোডাক্ট দেখানো
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = "";

    products.forEach(p => {
        grid.innerHTML += `
            <div class="group bg-white p-4 border border-gray-100 hover:shadow-xl transition cursor-pointer" onclick="openModal(${p.id})">
                <img src="${p.images[0]}" class="w-full h-72 object-cover rounded">
                <h3 class="mt-4 font-bold text-gray-800 text-sm md:text-base">${p.name}</h3>
                <p class="text-gray-600 mt-1">৳ ${p.price}</p>
                <button class="mt-3 w-full bg-black text-white py-2 text-xs uppercase tracking-widest hover:bg-gray-800 transition">View Details</button>
            </div>
        `;
    });
}

// ৩. পপ-আপ (Modal) ফাংশন - সাইজ, কালার ও ৩টি ছবিসহ
function openModal(id) {
    const p = allProducts.find(item => item.id === id);
    const content = document.getElementById('modal-content');
    
    // সিলেকশন রিসেট করা
    selectedSize = null;
    selectedColor = null;

    content.innerHTML = `
        <div class="space-y-4">
            <img id="main-img" src="${p.images[0]}" class="w-full h-[450px] object-cover rounded shadow-md">
            <div class="flex gap-2 pb-2 overflow-x-auto">
                ${p.images.map(img => `
                    <img src="${img}" onclick="document.getElementById('main-img').src='${img}'" 
                    class="w-24 h-24 object-cover cursor-pointer border-2 border-transparent hover:border-black rounded transition">
                `).join('')}
            </div>
        </div>

        <div class="flex flex-col">
            <h2 class="text-2xl font-black text-gray-900 mb-2 tracking-tighter">${p.name}</h2>
            <p class="text-2xl font-bold text-black mb-6">৳ ${p.price}</p>
            <p class="text-xs text-gray-500 uppercase mb-8 tracking-widest">Category: ${p.category}</p>
            
            <div class="mb-6">
                <h4 class="text-sm font-bold uppercase mb-3 text-gray-800">Select Color</h4>
                <div class="flex flex-wrap gap-2" id="color-options">
                    ${p.colors.map(color => `
                        <button onclick="selectOption('color', '${color}', this)" 
                        class="px-5 py-2.5 border border-gray-200 rounded-full text-xs font-bold uppercase hover:border-black transition">
                            ${color}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="mb-8">
                <h4 class="text-sm font-bold uppercase mb-3 text-gray-800">Select Size</h4>
                <div class="flex flex-wrap gap-2" id="size-options">
                    ${p.sizes.map(size => `
                        <button onclick="selectOption('size', '${size}', this)" 
                        class="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold uppercase hover:border-black transition">
                            ${size}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="mt-auto space-y-3">
                <button onclick="handleAddToCart('${p.name}', ${p.price})" 
                class="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition">
                    ADD TO CART
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('product-modal').classList.remove('hidden');
    document.getElementById('product-modal').classList.add('flex');
}

// ৪. সাইজ বা কালার সিলেক্ট করার ফাংশন
function selectOption(type, value, element) {
    const parentId = type === 'size' ? 'size-options' : 'color-options';
    const buttons = document.getElementById(parentId).getElementsByTagName('button');
    
    // আগের সিলেকশন রিমুভ করা
    for (let btn of buttons) {
        btn.classList.remove('bg-black', 'text-white', 'border-black');
        btn.classList.add('border-gray-200', 'text-black');
    }
    
    // নতুন সিলেকশন অ্যাড করা
    element.classList.remove('border-gray-200', 'text-black');
    element.classList.add('bg-black', 'text-white', 'border-black');
    
    // ভ্যালু সেভ করা
    if (type === 'size') selectedSize = value;
    if (type === 'color') selectedColor = value;
}

// ৫. কার্টে অ্যাড করার আগে সিলেকশন চেক করা
function handleAddToCart(name, price) {
    if (!selectedColor) {
        alert("দয়া করে একটি কালার সিলেক্ট করুন।");
        return;
    }
    if (!selectedSize) {
        alert("দয়া করে একটি সাইজ সিলেক্ট করুন।");
        return;
    }
    
    // আপনার আগের addToCart ফাংশনটি কল হবে (যদি থাকে)
    if (typeof addToCart === 'function') {
        addToCart(`${name} (${selectedColor}, ${selectedSize})`, price);
    } else {
        alert(`${name} (${selectedColor}, ${selectedSize}) কার্টে যোগ হয়েছে!`);
    }
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
    document.getElementById('product-modal').classList.remove('flex');
}

function filterCategory(cat) {
    const filtered = (cat === 'all') ? allProducts : allProducts.filter(p => p.category === cat);
    displayProducts(filtered);
    document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth' });
}

window.onload = loadProducts;
