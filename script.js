(function(){
    const categoriesList = document.querySelector(".categories ul");
    const treeCardsContainer = document.querySelector(".tree-cards");
    const cartAside = document.querySelector(".cart");

    cartAside.innerHTML = `
    <h3>Your Cart</h3>
    <div class="cart-items"></div>
    <div class="cart-total" style="margin-top:12px; display:flex; justify-content: space-between; font-weight:700;">
    <span>Total:</span>
    <span class="cart-total-value">৳0</span>
    </div>

    `;
    const cartItemsContainer = cartAside.querySelector(".cart-items");
    const cartTotalValue = cartAside.querySelector(".cart-total-value");

    const API_BASE = 'https://openapi.programming-hero.com/api';
    const ENDPOINTS = {
        allPlants: `${API_BASE}/plants`,
        categories: `${API_BASE}/categories`,
        categoryById: id => `${API_BASE}/category/${id}`,
        plantById: id => `${API_BASE}/plant/${id}`
    };

    let cart = [];
    let currentPlants = [];

    function showLoader () {
        treeCardsContainer.innerHTML = `<p style="text-align:center; padding:30px;">Loading...</p>`;

    }
    function hideLoader(){

    }
    async function LoadCategories () {
        try{
            categoriesList.innerHTML = `<li style="padding:10px;">Loading</li>`;
            const res = await fetch(ENDPOINTS.categories);
            const data = await res.json();

            let categories = data.data || data.categories || data;

            if (!Array.isArray(categories) && categories && categories.data) {
                categories = categories.data;
            }

            if (!Array.isArray(categories)) {
                categories = [
                { id: '1', name: 'All Trees' },
                { id: '2', name: 'Fruit Trees' },
                { id: '3', name: 'Flowering Trees' }
                ];
            }    

                const fragment = document.createDocumentFragment();

                const allLi = document.createElement("li");
                allLi.innerHTML = `<a href="#" data-id="all">All Trees</a>`;
                fragment.appendChild(allLi);

                categories.forEach(cat => {
                    const id = cat.id || cat.category_id || cat.category_id || cat._id || cat.category_id;
                    const name = cat.name || cat.category_name || cat.category || cat.category_name;
                    const li = document.createElement('li');

                    li.innerHTML = `<a href="#" data-id="${id || name}">${name || cat}</a>`;
                    fragment.appendChild(li);
                });

                categoriesList.innerHTML = '';
                categoriesList.appendChild(fragment);
            }
            catch (err){
                console.error("category load error:", err);
                categoriesList.innerHTML = `<li style="padding:10px;">Failed to load categories</li>`;
            }
        }

        async function loadAllPlants() {
            try{
                showLoader();
                const res = await fetch(ENDPOINTS.allPlants);
                const data = await res.json();

                let plants = data.data || data.plants || data;

                if (!Array.isArray(plants) && plants && plants.data) plants = plants.data;
                if (!Array.isArray(plants)) plants = [];

                currentPlants = plants;
                renderCards(plants);
            }
            catch (err) {
                console.error("All plants load error:", err);
                treeCardsContainer.innerHTML = `<p style="text-aline:center;padding:20px;">Failed to load plants.</p>`;
            }
        }

        async function loadAllPlantsByCategory(id) {
            try{
                showLoader();
                if (!id || id === "all") {
                    return loadAllPlants();
                }

                const res = await fetch(ENDPOINTS.categoryById(id));
                const data = await res.json();

                let plants = data.data || data.plants || data || [];

                if (!Array.isArray(plants) && plants && plants.data) plants = plants.data;
                if (!Array.isArray(plants)) plants =[];

                currentPlants = plants;
                renderCards(plants);
            }
            catch (err) {
                console.error("category plants load error:", err);
                treeCardsContainer.innerHTML = `<p style="text-aline:center;padding:20px;">Failed to load category plants.</p>`;
            }
        }

        function renderCards(plants) {
            if (!plants || plants.length === 0){
                treeCardsContainer.innerHTML = `<p style="text-aline:center; padding:20px;">No Plants found.</p>`;
                return;
            }

            const fragment = document.createDocumentFragment();

            plants.forEach(plant => {
                const id = plant.id || plant._id || plant.plant_id || plant.plantId || plant.idPlant || plant.id;
                const name = plant.name || plant.plant_name || plant.common_name || "Unknown Plant";
                const image = plant.image || plant.picture || (plant.image && plant.images[0]) || 'https://i.ibb.co/7RWyzfX/tree1.jpg';
                const description = (plant.description && plant.description.slice(0, 120)) || (plant.short_description && plant.short_description.slice(0,120)) || "No Description available.";
                const category = plant.category || plant.category_name || plant.type || "General";
                const price = plant.price || plant.rate || plant.cost || Math.floor(Math.random()*400) +200;

                const card = document.createElement("div");
                card.className ="card";
                card.innerHTML= `
                <img src="${image}" alt="${escapeHtml(name)}"/>
                <h4 class= "tree-name" data-id="${id}" style="cursor:pointer;color:#0b6b3a;">${escapeHtml(name)}</h4>
                <p>${escapeHtml(description)}${description.length >= 120 ? "..." : ""}</p>
                <div class="categori-and-price-container">
                    <p class="name">${escapeHtml(category)}</p>
                    <p class="rates">৳${price}</p>
                </div>
                <button class= "add-to-cart" data-id="${id}" data-name="${escapeHtml(name)}" data-price="${price}">Add to Cart</button>

                `;
                fragment.appendChild(card);
            });
            treeCardsContainer.innerHTML = '';
            treeCardsContainer.appendChild(fragment);
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        }

        async function showPlantDetails(id) {
            try{
                const overlay = document.createElement("div");
                overlay.style.position = "fixed";
                overlay.style.left = 0;
                overlay.style.top = 0;
                overlay.style.right = 0;
                overlay.style.bottom = 0;
                overlay.style.background = "rgba(0,0,0,0.5)";
                overlay.style.display = "flex";
                overlay.style.justifyContent = "center";
                overlay.style.alignItems = "center";
                overlay.style.zIndex = "9999";


                const modal = document.createElement("div");
                modal.style.maxWidth = "800px";
                modal.style.width = "90%";
                modal.style.background = "white";
                modal.style.borderRadius = "8px";
                modal.style.padding = "20px";
                modal.style.position = "relative";
                modal.style.maxHeight = "80vh";
                modal.style.overflow = "auto";

                modal.innerHTML = `<p style="text-align:center;">Loading details...</p>`;
                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                overlay.addEventListener("click", e => {
                    if (e.target === overlay) overlay.remove();
                });

                const closeBtn = document.createElement("button");
                closeBtn.textContent = "Close";
                closeBtn.style.position = "absolute";
                closeBtn.style.right = "12px";
                closeBtn.style.top = "12px";
                closeBtn.style.padding = "¨6px 10px";
                closeBtn.style.border = "none";
                closeBtn.style.background = "#e74c3c";
                closeBtn.style.color = "white";
                closeBtn.style.borderRadius = "6px";
                closeBtn.style.cursor = "pointer";
                modal.appendChild(closeBtn);
                closeBtn.addEventListener("click", () => overlay.remove());

                const res = await fetch(ENDPOINTS.plantById(id));
                const data = await res.json();

                let plant = data.data || data.plant || data || null;
                if (plant && plant.data) plant = plant.data;
                if (Array.isArray(plant)) plant = plant[0];

                if (!plant) {
                    modal.innerHTML = '<p>Details not found.</p>';
                    modal.appendChild(closeBtn);
                    return;
                }

                const name = plant.name || plant.plant_name || plant.common_name || 'Plant';
                const image = plant.image || plant.img || plant.picture || (plant.images && plant.images[0]) || 'https://i.ibb.co/7RWyzfX/tree1.jpg';
                const longDesc = plant.description || plant.long_description || plant.details || 'No detailed description available.';
                const cat = plant.category || plant.category_name || plant.type || 'General';
                const price = plant.price || plant.rate || plant.cost || Math.floor(Math.random()*400)+200;


                modal.innerHTML = `

                <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
                <div style="flex:1 min-width:220px;">
                <img src="${image}" alt="${escapeHtml(name)}" style="width:100%; border-radius:8px;"/>
                </div>
                <div>
                <h2 style="flex:2; min-width:240px;">${escapeHtml(name)}</h2>
                <p style="color:#333;">${escapeHtml(longDesc)}</p>
                <p><strong>Category:</strong> ${escapeHtml(cat)}</p>
                <p><strong>Price:</strong> ৳${price}</p>
                <div style="margin-top:12px;">
                    <button class="modal-add-to-cart" style="background:#15803d; color:white; border:none; padding:10px;border-radius:8px; cursor:pointer;">Add to Cart</button></button>
                </div>
                </div>
                </div>

                `;
                modal.appendChild(closeBtn);

                modal.querySelector('.modal-add-to-cart').addEventListener('click', () => {
                    addToCart({ id, name, price });
                    overlay.remove();
                });
            }
            
                catch (err) {
                    console.error('Plant detail load error:', err);
                    alert('Failed to load plant details.');
                }
        }

        function addToCart(item) {
            const existing = cart.find(ci => String(ci.id) === String(item.id));
            if (existing) {
                existing.qty += 1;
            }
            else{
                cart.push({ id: item.id, name: item.name, price: Number(item.price), qty: 1 });
            }
            renderCart();
        }
        function removeFromCart(id){
            cart = cart.filter(ci => String(ci.id) !== String(id));
            renderCart();
        }

        function renderCart ( ) {
            cartItemsContainer.innerHTML = "";
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `<p style="color:gray;">No items yet</p>`;
                cartTotalValue.textContent = "৳0";
                return;
            }
            cart.forEach(ci => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "cart-container";
                itemDiv.style.display = 'flex';
                itemDiv.style.justifyContent = 'space-between';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.background = '#f0fdf4';
                itemDiv.style.padding = '8px';
                itemDiv.style.borderRadius = '8px';
                itemDiv.style.marginBottom = '8px';

                itemDiv.innerHTML = `
                    <div>
                    <h4 style="margin:0; font-size:14px; color:#0b6b3a;">${escapeHtml(ci.name)}</h4>
                    <p style="margin:0; font-size:12px; color:gray;">৳${ci.price} * ${ci.qty}</p>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                    <div style="font-weight:700;">৳${ci.price * ci.qty}</div>
                    <button class="remove-item" data-id="${ci.id}" style="color:white; border:none; padding:6px 8px; border-radius:6px; cursor:pointer;">❌</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
            const total = cart.reduce((s,it) => s+ it.price * it.qty, 0);
            cartTotalValue.textContent = `৳${total}`;
        }

        treeCardsContainer.addEventListener("click", function(e){
            const nameTarget = e.target.closest(".tree-name");
            if (nameTarget) {
                const id = nameTarget.dataset.id;
                if (id) showPlantDetails(id);
                return;
            }
            const addBtn = e.target.closest(".add-to-cart");
            if (addBtn) {
                const id = addBtn.dataset.id;
                const name = addBtn.dataset.name;
                const price = addBtn.dataset.price;
                addToCart({id, name, price: Number(price) });
                return;
            }

        });

        categoriesList.addEventListener('click', function(e) {
            const a = e.target.closest('a');
            if (!a) return;
            e.preventDefault();
            const id = a.dataset.id;

            categoriesList.querySelectorAll('a').forEach(el => {
                el.style.background = '';
                el.style.color = '';
            });
            a.style.background = '#15803d';
            a.style.color = 'white';
            
            if (id === 'all' || !id) {
            loadAllPlants();
            } else {
                loadAllPlantsByCategory(id);
            }

        });

        cartItemsContainer.addEventListener("click", function(e){
            const rem = e.target.closest(".remove-item");
            if (rem) {
                const id = rem.dataset.id;
                removeFromCart(id);
            }
        });

        LoadCategories();
        loadAllPlants();
        
        window._app = {
            LoadCategories,loadAllPlants,loadAllPlantsByCategory,showPlantDetails,cart
        };

})();