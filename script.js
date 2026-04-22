// ১. আপনার প্রোডাক্ট লিস্ট (এখানে আপনি যত খুশি প্রোডাক্ট যোগ করতে পারবেন)
const products = [
    { id: 1, name: "Premium Drop Shoulder", price: 850, category: "drop-shoulder", img: "images/cat1.jpg" },
    { id: 2, name: "Basic Half Sleeve", price: 650, category: "half-sleeve", img: "images/cat2.jpg" }
];

let cart = [];

// ২. ক্যাটাগরি অনুযায়ী প্রোডাক্ট দেখানোর ফাংশন
function filterCategory(cat) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ""; // আগের প্রোডাক্ট মুছে ফেলা
    
    const filtered = products.filter(p => p.category === cat);
    
    filtered.forEach(p => {
        grid.innerHTML += `
            <div class="group bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition">
                <img src="${p.img}" class="w-full h-64 object-cover rounded-md">
                <h3 class="mt-4 font-semibold text-gray-800">${p.name}</h3>
                <p class="text-gray-500 font-bold">৳ ${p.price}</p>
                <button onclick="addToCart('${p.name}', ${p.price})" class="mt-3 w-full bg-black text-white py-2 rounded text-sm uppercase">Add to Cart</button>
            </div>
        `;
    });
    grid.scrollIntoView({ behavior: 'smooth' });
}

// ৩. কার্ট এবং হোয়াটসঅ্যাপ অর্ডার ফাংশন
function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').innerText = cart.length;
    alert(name + " কার্টে যোগ হয়েছে!");
}

function sendToWhatsApp() {
    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    
    if(!name || !address) return alert("সব তথ্য দিন");

    let items = cart.map(i => i.name).join(", ");
    const msg = `New Order from Redams:%0AName: ${name}%0AAddress: ${address}%0AProducts: ${items}`;
    window.open(`https://wa.me/8801XXXXXXXXX?text=${msg}`); // এখানে আপনার নম্বর দিন
}
