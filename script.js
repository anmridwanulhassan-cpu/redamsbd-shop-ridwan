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
// ১. এখানে আপনি যত ইচ্ছা প্রোডাক্ট অ্যাড করতে পারবেন
const allProducts = [
    { id: 1, name: "Premium Drop Shoulder Blue", price: 850, img: "images/p1.jpg" },
    { id: 2, name: "Black Signature T-Shirt", price: 750, img: "images/p2.jpg" },
    { id: 3, name: "White Minimalist Tee", price: 650, img: "images/p3.jpg" },
    { id: 4, name: "Olive Cargo Drop Shoulder", price: 950, img: "images/p4.jpg" },
    { id: 5, name: "Redams Special Edition", price: 1200, img: "images/p5.jpg" }
    // নতুন প্রোডাক্ট বাড়াতে চাইলে শুধু ওপরের লাইনটি কপি করে নিচে বসান
];

// ২. প্রোডাক্টগুলো স্ক্রিনে দেখানোর ফাংশন
function displayProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ""; // আগের কন্টেন্ট ক্লিয়ার করা

    allProducts.forEach(product => {
        grid.innerHTML += `
            <div class="group bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition">
                <div class="relative overflow-hidden rounded-md bg-gray-100">
                    <img src="${product.img}" alt="${product.name}" class="w-full h-64 object-cover group-hover:scale-105 transition duration-300">
                </div>
                <h3 class="mt-4 font-semibold text-gray-800 text-sm md:text-base">${product.name}</h3>
                <p class="text-gray-500 font-bold mt-1">৳ ${product.price}</p>
                <button onclick="addToCart('${product.name}', ${product.price})" class="mt-3 w-full bg-black text-white py-2 rounded text-sm hover:bg-gray-800 uppercase">Add to Cart</button>
            </div>
        `;
    });
}

// ৩. পেজ লোড হওয়ার সাথে সাথে ফাংশনটি চালু হবে
window.onload = function() {
    displayProducts();
    // যদি আপনার স্লাইডার বা অন্য কোনো ফাংশন থাকে সেগুলোও এখানে থাকবে
};
