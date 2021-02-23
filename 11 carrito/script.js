var app = window.app || {},
business_paypal = ''; 


(function($){
	'use strict';


	app.init = function(){
		var total = 0,
		items = 0
		
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ;
		
		if(undefined != cart.items && cart.items != null && cart.items != '' && cart.items.length > 0){
			_.forEach(cart.items, function(n, key) {
			   items = (items + n.cant)
			   total = total  + (n.cant * n.price)
			});

		}

		$('#totalItems').text(items)
		$('.totalAmount').text('$ '+total+ ' MXM')
		
	}

	app.createProducts = function(){
		var productos = [
			{
				id : 1,
				img : '4.png',
				name : 'Arete Triángulo',
				price : 299.00,
				price1: 500,
				desc : 'Este arete se puede modificar, intentalo, tu mismo ahora!',
				stock : 40
			},{
				id : 2,
				img : '4.png',
				name : 'Arete Triángulo',
				price : 400.00,
				price1: 510,
				desc : 'Este arete se puede modificar, intentalo, tu mismo ahora!',
				stock : 40
			},
			{
				id : 3,
				img : '4.png',
				name : 'Arete Triángulo',
				price : 499.00,
				price1: 501,
				desc : 'Este arete se puede modificar, intentalo, tu mismo ahora!',
				stock : 40
			},{
				id : 4,
				img : '4.png',
				name : 'Arete Triángulo',
				price : 259.00,
				price1: 300,
				desc : 'Este arete se puede modificar, intentalo, tu mismo ahora!',
				stock : 4
			},
			{
				id : 5,
				img : '4.png',
				name : 'Arete Triángulo',
				price : 299.00,
				price1: 300,
				desc : 'Este arete se puede modificar, intentalo, tu mismo ahora!',
				stock : 40
			},
			
			
		],
		wrapper = $('.productosWrapper'),
		contenido = ''

		for(var i = 0; i < productos.length; i++){

			if(productos[i].stock > 0){
			
			
				contenido+= '<div class="coin-wrapper">'
				
				contenido+= '<span class="large-12 columns product-details">'
				
				contenido+= '<img src="'+productos[i].img+'" alt="'+productos[i].name+'">'
				
				contenido+= '<h5>'+productos[i].name+' </h5>'
			
				contenido+= '<span class="price">$'+productos[i].price+ ' - $'+productos[i].price1+' MX</span>'
				
				contenido+= '<h3>Tenemos: <span class="stock">'
				
				+productos[i].stock+'</span></h3>'

				contenido+= '<div  class="carousel-item__details--img">'
				contenido+= '<div class="heart" data-id="2"></div>'
				
				contenido+= '<img src="ll.png ">'
				
				
				
				contenido+= '</span>'
				
				contenido+= '<a class="large-8 columns btn submit ladda-button prod-'+productos[i].id+'" data-style="slide-right" onclick="app.addtoCart('+productos[i].id+');">Añadir al carrito</a>'

				contenido+= '<div class="clearfix"></div>'
				contenido+= '</div>'
				contenido+= '</div>'
				
			}

		}

		wrapper.html(contenido)

		localStorage.setItem('productos',JSON.stringify(productos))
	}

	app.addtoCart = function(id){
		var l = Ladda.create( document.querySelector( '.prod-'+id ) );

		l.start();
		var productos = JSON.parse(localStorage.getItem('productos')),
		producto = _.find(productos,{ 'id' : id }),
		cant = 1
		if(cant <= producto.stock){
			if(undefined != producto){
				if(cant > 0){
					setTimeout(function(){
						var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ;
						app.searchProd(cart,producto.id,parseInt(cant),producto.name,producto.price,producto.img,producto.stock)
						l.stop();
					},2000)
				}else{
					alert('Solo se permiten cantidades mayores a cero')
				}
			}else{
				alert('Oops! algo malo ocurrió, inténtalo de nuevo más tarde')
			}
		}else{
			alert('No se pueden añadir más de este producto')
		}
	}

	app.searchProd = function(cart,id,cant,name,price,img,available){
		var curProd = _.find(cart.items, { 'id': id })

		if(undefined != curProd && curProd != null){
			if(curProd.cant < available){
				curProd.cant = parseInt(curProd.cant + cant)
			}else{
				alert('No se pueden añadir más de este producto')
			}
			
		}else{
			var prod = {
				id : id,
				cant : cant,
				name : name,
				price : price,
				img : img,
				available : available
			}
			cart.items.push(prod)
			
		}
		localStorage.setItem('cart',JSON.stringify(cart))
		app.init()
		app.getProducts()
		app.updatePayForm()
	}

	app.getProducts = function(){
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []},
		msg = '',
		wrapper = $('.cart'),
		total = 0
		wrapper.html('')

		if(undefined == cart || null == cart || cart == '' || cart.items.length == 0){
			wrapper.html('<li>¡Tu canasta está vacía!</li>');
			$('.cart').css('left','-400%')
		}else{
			var items = '';
			_.forEach(cart.items, function(n, key) {
	
			   total = total  + (n.cant * n.price)
			   items += '<li>'
			   items += '<img src="'+n.img+'" />'
			   items += '<h3 class="title">'+n.name+'<br><span class="price">'+n.cant+' x $ '+n.price+' USD</span> <button class="add" onclick="app.updateItem('+n.id+','+n.available+')"><i class="icon ion-minus-circled"></i></button> <button onclick="app.deleteProd('+n.id+')" ><i class="icon ion-close-circled"></i></button><div class="clearfix"></div></h3>'
			   items += '</li>'
			});

			items += '<li id="total">Total : $ '+total+' MXM <div id="submitForm"></div></li>'
			wrapper.html(items)
			$('.cart').css('left','-500%')
		}
	}

	app.updateItem = function(id,available){
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ,
		curProd = _.find(cart.items, { 'id': id })
			curProd.cant = curProd.cant - 1;
			if(curProd.cant > 0){
				localStorage.setItem('cart',JSON.stringify(cart))
				app.init()
				app.getProducts()
				app.updatePayForm()
			}else{
				app.deleteProd(id,true)
			}
	}

	app.delete = function(id){
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ;
		var curProd = _.find(cart.items, { 'id': id })
		_.remove(cart.items, curProd);
		localStorage.setItem('cart',JSON.stringify(cart))
		app.init()
		app.getProducts()
		app.updatePayForm()
	}

	app.deleteProd = function(id,remove){
		if(undefined != id && id > 0){
			
			if(remove == true){
				app.delete(id)
			}else{
				var conf = confirm('¿Deseas eliminar este producto?')
				if(conf){
					app.delete(id)
				}
			}
			
		}
	}

	app.updatePayForm = function(){
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ;
		var statics = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_cart"><input type="hidden" name="upload" value="1"><input type="hidden" name="currency_code" value="MXM" /><input type="hidden" name="business" value="'+business_paypal+'">',
		dinamic = '',
		wrapper = $('#submitForm')

		wrapper.html('')
		
		if(undefined != cart && null != cart && cart != ''){
			var i = 1;
			_.forEach(cart.items, function(prod, key) {
					dinamic += '<input type="hidden" name="item_name_'+i+'" value="'+prod.name+'">'
					dinamic += '<input type="hidden" name="amount_'+i+'" value="'+prod.price+'">'
					dinamic += '<input type="hidden" name="item_number_'+i+'" value="'+prod.id+'" />'
					dinamic += '<input type="hidden" name="quantity_'+i+'" value="'+prod.cant+'" />'
				i++;
			})

			statics += dinamic + '<button type="submit" class="pay">Pagar &nbsp;<i class="ion-chevron-right"></i></button></form>'

			wrapper.html(statics)
		}
	}

	$(document).ready(function(){
		app.init()
		app.getProducts()
		app.updatePayForm()
		app.createProducts()
	})
	
	$(function() {
		$(".heart").on("click", function() {
		  $(this).toggleClass("is-active");
		})
	  })



})(jQuery)

