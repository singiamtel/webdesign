var url_string = window.location.href;
var url = new URL(url_string);
var id = url.searchParams.get("id");
var body = document.querySelector("body");
var movie = document.querySelector(".movie");
var overlay = document.querySelector(".overlay");

function XMLRequest(url, callback){
	var con = new XMLHttpRequest();
	con.responseType = 'json';
	con.open('GET', url);
	con.onreadystatechange = function () {
		if(con.readyState === 4 && con.status === 200){
			const json = con.response;
			callback(json);
		}
	}
	con.send();
}

XMLRequest('https://api.themoviedb.org/3/movie/' + id + '?api_key=3109a8b52a2b9477564cdfe422add54f', loadData);

function loadData(json){
	document.title = json.original_title;
	// TODO FLAG
	movie.innerHTML = `<div class="posterImg"><img class="poster" src="https://image.tmdb.org/t/p/w500/${json.poster_path}"></div>
		<div class="details">
		<span class="title"><strong>${json.original_title}</strong> (${json.release_date.substring(0,4)})<span class="flags"></span></span>

		<div class="director"><strong>Director</strong></div>
		<div class="directorName"></div>

		<div class="cast"><strong>Cast</strong></div>
		<div class="castNames"></div>

		<span class="overview"><strong>Overview</strong></span>
		<span class="overviewContent">${json.overview}</span>


		</div>`;
	let flags = document.querySelector(".flags");
	let director = document.querySelector(".directorName");
	let cast = document.querySelector(".castNames");
	let backImg = document.createElement("img");
	backImg.src = `https://image.tmdb.org/t/p/w500/${json.backdrop_path}`;
	backImg.className = "backImg";

	fetchMovieCredits(id, director,cast,backImg);
	overlay.appendChild(backImg);
	for(let i = 0; json.production_countries[i] !== undefined; ++i){
		flags.innerHTML += `<img class="imgflag" src="https://www.countryflags.io/${json.production_countries[i].iso_3166_1}/flat/64.png">`;
	}
}

function fetchMovieCredits(id, div_director, div_actors, divFlag){
	var con = new XMLHttpRequest();
	con.responseType = 'json';
	con.onreadystatechange = function () {
		if(con.readyState === 4 && con.status === 200){
			const json_meta = con.response;
			for (var i = 0 ; i<json_meta.crew.length; i++) {
				if(json_meta.crew[i].job === "Director") {
					div_director.innerHTML = json_meta.crew[i].name;
					break;
				}
			}
			// Value defaults to "NO DATA" if unset
			if(div_director.innerHTML === "") div_director.innerHTML = `<a href="">NO DATA</a>`;
			for (var i = 0 ; i<10; i++) {
				// Some movies don't get to 10 actors
				if(json_meta.cast[i] == undefined) break;
				div_actors.innerHTML += json_meta.cast[i].name + ", ";
			}
			// Removes last comma
			div_actors.innerHTML = div_actors.innerHTML.substring(0, div_actors.innerHTML.length-2);
			div_actors.innerHTML += "...";
		}
	}
	con.open('GET', 'https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=3109a8b52a2b9477564cdfe422add54f');
	con.send();
}
