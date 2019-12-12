var body = document.querySelector('body');
var overlay = document.querySelector('.overlay');
var fullimg = document.querySelector('.fullimg');
var input_selector = document.querySelector('.input');
var div_images = document.querySelector('.images');

function get_dog_list(){
	let con = new XMLHttpRequest();
	con.responseType = 'json';
	con.onreadystatechange = function () {
		if(con.readyState === 4 && con.status === 200){
			var json = con.response;
			for (let i in json.message) {
				// TODO add subspecies
				// i = i.charAt(0).toUpperCase() + i.slice(1);
				input_selector.innerHTML += `<option value="${i}">${i}</option>`;
			}
		}
	}
	con.open('GET', 'https://dog.ceo/api/breeds/list/all');
	con.send();
}

get_dog_list(); // Call inmediately

function update_pics(json_breed){
	div_images.innerHTML = ``;
	let counter=0;
	for(let i in json_breed.message){
		counter++;
		let tmp_img = document.createElement("img");
		tmp_img.className = "image";
		tmp_img.src = json_breed.message[i];
		div_images.appendChild(tmp_img);
		tmp_img.onclick = function(){show_doggo(tmp_img.src)};
		if(counter===100) break;
	}
}

overlay.onclick = function(){
	overlay.style.opacity = 0;
	overlay.style.pointerEvents = "none";
}

function show_doggo(url){
	// Overwrites last doggo
	console.log(url);
	fullimg.innerHTML = `<img src="${url}" />`
	overlay.style.opacity = 1;
	overlay.style.pointerEvents = "auto";
}

function query_breed(breed){
	let con = new XMLHttpRequest();
	con.responseType = 'json';
	con.onreadystatechange = function () {
		if(con.readyState === 4 && con.status === 200){
			let json_breed = con.response;
			update_pics(json_breed);
		}
	}
	con.open('GET', 'https://dog.ceo/api/breed/' + breed + '/images');
	con.send();
}

function select_breed(){
	breed = input_selector.value;
	query_breed(breed);
}
