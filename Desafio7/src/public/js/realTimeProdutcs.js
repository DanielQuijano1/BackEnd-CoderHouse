const socket = io();

console.log("socket conectado desd JS")
//const btnFormAdd = document.getElementById('btn-formCreate');
const AddForm = document.getElementById('addForm')
const deleteForm = document.getElementById('deleteForm')
const viewProducts = document.getElementById('viewProducts')




socket.on('products', products => {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    for (const prod of products.reverse()) {
        productsContainer.innerHTML += `
			<div class="container">
				<div class="collection-list mt-4 row gx-0 gy-3" >
					<div class="col-md-6 col-lg-4 col-xl-3 p-2 ">
						<div class="card" style="width: 18rem;">
            				<h2>${prod.title}</h2>
							<div class="card-body">
            					<p><b>Descripción:</b> ${prod.description}</p>
            					<p><b>Categoría:</b> ${prod.category}</p>
            					<p><b>Precio: $</b>${prod.price}</p>
            					<p><b>Código:</b> ${prod.code}</p>
            					<p><b>Stock:</b> ${prod.stock}</p>
							</div>
						</div>
					</div>
				</div>
        	</div>
		`;
    }
});

viewProducts.addEventListener('click', async () => {

    await socket.emit('products')

})

AddForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target) //Me genera un objeto iterador
    const newProd = Object.fromEntries(datForm) //De un objeto iterable genero un objeto simple
    await socket.emit('addProd', newProd)
    //await socket.emit('products');
    e.target.reset()
})


deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const code = deleteForm.elements["code"].value;
    await socket.emit('deleteProduct', { code })
    e.target.reset()
})

//btnFormAdd.addEventListener('click', newProd);