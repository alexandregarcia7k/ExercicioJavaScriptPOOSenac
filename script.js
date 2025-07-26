//classe que representa um produto.
class Product {
    constructor(name, price, category) {
    this.name = name;
    this.price = price;
    this.category = category;
    }
}
//classe para gerenciar lista de produtos
class ProductManager {
    constructor() {
        this.list = JSON.parse(localStorage.getItem("products")) || [];
    }
    //adiciona um produto novo e salva no localstorage.
    addProduct(product){
        this.list.push(product);
        this.saveToStorage()
    }
    //remove um produto pelo indice e salva novamente no localstorage
    removeProduct(index) {
        this.list.splice(index, 1);
        this.saveToStorage()
    }
    //retorna a lista de produtos
    listProducts() {
        return this.list;
    //salva a lista de produto atual na propia maquina (localstorage)
    }
    saveToStorage(){
        localStorage.setItem("products",JSON.stringify(this.list));
    }
    
}
//cria uma instancia do gerenciador de produtos
const manager = new ProductManager();
// seleciona o formulario da pagina
const form = document.querySelector("form");
//seleciona o campo de preço do produto
const priceInput = document.getElementById("productprice");
// adiciona um filtro no campo de preço para impedir de colar letras e simbolos
priceInput.addEventListener("input", function(){
    this.value = this.value
        .replace(/[^0-9.]/g, '')      // Remove letras e símbolos
        .replace(/(\..*?)\..*/g, '$1'); // Permite só um ponto decimal
})
// adiciona o evento de envio do formulario
form.addEventListener("submit", function(event) {
    event.preventDefault();
//pega os valores digitados nos campos
    const name = form.name.value
    const price = parseFloat(form.price.value);
    const category = form.category.value   
    //cria um novo produto com os valores informados
    const newProduct = new Product(name, price, category);
    manager.addProduct(newProduct);  //adiciona o produto na lista
// limpa os campos do formulario
form.reset();
//atualiza a lista de produtos na tela
renderProducts();
});
//funcao para renderizar os produtos na tela
function renderProducts() {
    //seleciona a seção onde os produtos vao aparecer
    const productListSection = document.getElementById("productlist");
    //limpa o conteudo anterior
    productListSection.innerHTML = '';
    // percorre todos os produtos e cria o html para cada um
    manager.listProducts().forEach((product, index) =>{
        const productDiv = document.createElement("div");
        //define a estrutura HTML com nome, preço e cotegoria e o botao de remover
        productDiv.innerHTML = `
        <strong>${product.name}</strong> — R$${product.price.toFixed(2)} — <em>${product.category}</em>
        <button data-index="${index}">Remover</button>
        `;
        //adiciona o produto na pagina
    productListSection.appendChild(productDiv)
    });
    // seleciona todos os botoes de remover os produtos criados
    const buttons = productListSection.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index"); // pega o indice do produto
            manager.removeProduct(index); // remove da lista
            renderProducts(); //atualiza a lista
        })
    })
}
// mostra os produtos salvos assim que a pagina carrega
renderProducts()