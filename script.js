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
const allProducts = [
    { id: 1, name: "Premium Drop Shoulder Blue", price: 850, category: "drop-shoulder", img: "images/p1.jpg" },
    { id: 2, name: "Black Half Sleeve Tee", price: 650, category: "half-sleeve", img: "images/p2.jpg" },
    { id: 3, name: "Solid Regular Fit T-Shirt", price: 550, category: "regular-tshirt", img: "images/p3.jpg" },
    { id: 4, name: "Black Winter Hoodie", price: 1250, category: "hoodie", img: "images/p4.jpg" },
    { id: 5, name: "King & Queen Couple Set", price: 1100, category: "couple-tshirt", img: "images/p5.jpg" }
];

// ক্যাটাগরি ফিল্টার করার ফাংশন
function filterCategory(categoryName) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ""; // আগের সব প্রোডাক্ট মুছে ফেলা

    // শুধু সিলেক্ট করা ক্যাটাগরির প্রোডাক্টগুলো খুঁজে বের করা
    const filteredProducts = allProducts.filter(product => product.category === categoryName);

    if (filteredProducts.length === 0) {
        grid.innerHTML = "<p class='col-span-full text-center text-gray-500'>এই ক্যাটাগরিতে বর্তমানে কোনো প্রোডাক্ট নেই।</p>";
    } else {
        filteredProducts.forEach(product => {
            grid.innerHTML += `
                <div class="group bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition">
                    <img src="${product.img}" class="w-full h-64 object-cover rounded-md">
                    <h3 class="mt-4 font-semibold text-gray-800 text-sm">${product.name}</h3>
                    <p class="text-gray-500 font-bold">৳ ${product.price}</p>
                    <button onclick="addToCart('${product.name}', ${product.price})" class="mt-3 w-full bg-black text-white py-2 rounded text-xs uppercase">Add to Cart</button>
                </div>
            `;
        });
    }

    // ক্লিক করার পর অটোমেটিক স্ক্রল করে প্রোডাক্ট সেকশনে নিয়ে যাবে
    grid.scrollIntoView({ behavior: 'smooth' });
}
