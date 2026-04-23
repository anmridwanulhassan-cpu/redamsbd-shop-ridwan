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
let allProducts = []; // এখানে ডাটা অটোমেটিক লোড হবে

// ১. JSON ফাইল থেকে ডাটা নিয়ে আসার ফাংশন
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        displayProducts(allProducts); // শুরুতে সব দেখাবে
    } catch (error) {
        console.error("প্রোডাক্ট লোড করতে সমস্যা হয়েছে:", error);
    }
}

// ২. প্রোডাক্ট দেখানোর মেইন ফাংশন
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = "";

    products.forEach(p => {
        grid.innerHTML += `
            <div class="group bg-white p-4 border border-gray-100 hover:shadow-xl transition cursor-pointer" onclick="openModal(${p.id})">
                <img src="${p.images[0]}" class="w-full h-72 object-cover rounded">
                <h3 class="mt-4 font-bold text-gray-800">${p.name}</h3>
                <p class="text-gray-600">৳ ${p.price}</p>
                <button class="mt-3 w-full bg-black text-white py-2 text-xs uppercase tracking-widest hover:bg-gray-800">View Details</button>
            </div>
        `;
    });
}

// ৩. পপ-আপ (Modal) ফাংশন
function openModal(id) {
    const p = allProducts.find(item => item.id === id);
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="space-y-4">
            <img id="main-img" src="${p.images[0]}" class="w-full h-96 object-cover rounded shadow">
            <div class="flex gap-2">
                ${p.images.map(img => `<img src="${img}" onclick="document.getElementById('main-img').src='${img}'" class="w-20 h-20 object-cover cursor-pointer border hover:border-black">`).join('')}
            </div>
        </div>
        <div class="flex flex-col justify-center">
            <h2 class="text-2xl font-bold mb-2">${p.name}</h2>
            <p class="text-xl font-bold text-gray-700 mb-6">Price: ৳ ${p.price}</p>
            <p class="text-sm text-gray-500 uppercase mb-8 tracking-tighter">Category: ${p.category}</p>
            <button onclick="addToCart('${p.name}', ${p.price})" class="w-full bg-black text-white py-4 font-bold hover:bg-gray-800">ADD TO CART</button>
        </div>
    `;
    document.getElementById('product-modal').classList.remove('hidden');
    document.getElementById('product-modal').classList.add('flex');
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
    document.getElementById('product-modal').classList.remove('flex');
}

// ৪. ক্যাটাগরি ফিল্টার
function filterCategory(cat) {
    const filtered = (cat === 'all') ? allProducts : allProducts.filter(p => p.category === cat);
    displayProducts(filtered);
    document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth' });
}

// ৫. পেজ লোড হলে ফাংশনটি চালু হবে
window.onload = loadProducts;
