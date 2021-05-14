const body = document.querySelector("body");
const list = document.querySelector(".list");
const input = document.querySelector("#movieInput");

input.focus();

function XMLRequest(url, callback){
	const con = new XMLHttpRequest();
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

input.onkeypress = function(event){
	if (event.keyCode === 13){
		if(input.value === ""){
			loadMovies();
		}
		else{
			enterSearch(input.value);
			input.value = "";
		}
	}
}

function loadMovies(){
	XMLRequest('https://api.themoviedb.org/3/movie/popular?api_key=3109a8b52a2b9477564cdfe422add54f&language=en-US&page=1', loadData);
}

loadMovies(); // Call inmediately

function fetchMovieCredits(id, div_director, div_actors, divFlag){
	const con = new XMLHttpRequest();
	con.responseType = 'json';
	con.onreadystatechange = function () {
		if(con.readyState === 4 && con.status === 200){
			const json_meta = con.response;
			for (let i = 0 ; i<json_meta.crew.length; i++) {
				if(json_meta.crew[i].job === "Director") {
					div_director.innerHTML = `<a href=""> ${json_meta.crew[i].name} </a>`;
					break;
				}
			}
			// Value defaults to "NO DATA" if unset
			if(div_director.innerHTML === "") div_director.innerHTML = `<a href="">NO DATA</a>`;
			div_actors.innerHTML = "";
			for (let i = 0 ; i<10; i++) {
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

	const con2 = new XMLHttpRequest();
	con2.responseType = 'json';
	con2.onreadystatechange = function () {
		if(con2.readyState === 4 && con2.status === 200){
			const json_meta_flag = con2.response;
			for(let i = 0; json_meta_flag.production_countries[i] !== undefined; ++i){
				divFlag.innerHTML += `<img class="imgflag" src="https://www.filmaffinity.com/imgs/countries/${json_meta_flag.production_countries[i].iso_3166_1}.jpg">`;
			}

		}
	}
	con2.open('GET', 'https://api.themoviedb.org/3/movie/' + id + '?api_key=3109a8b52a2b9477564cdfe422add54f');
	con2.send();
}

function loadData(json){
	const ul = document.createElement("ul");
	for (let i = 0 ; i < json.results.length; i++) {

		let id = json.results[i].id;
		const divActors = document.createElement("div");
		const divAudience = document.createElement("div");
		const divCritics = document.createElement("div");
		const divDirector = document.createElement("div");
		const divInfo = document.createElement("div");
		const divTitle = document.createElement("div");
		const divListrank = document.createElement("div");
		const divMetadata = document.createElement("div");
		const divMovie = document.createElement("div");
		const divRating = document.createElement("div");
		const imgAudience = document.createElement("img");
		const imgCover = document.createElement("img");
		const divFlag = document.createElement("div");

		divActors.className = "actors";

		divDirector.className = "director";

		// Sets actors, director and flags
		fetchMovieCredits(json.results[i].id, divDirector, divActors, divFlag);

		divAudience.className = "audience";
		divAudience.innerHTML = `${json.results[i].vote_count}`;

		divCritics.className = "critics";

		divInfo.className = "info";
		divTitle.className = "title";
		divTitle.innerHTML = `<strong>${json.results[i].title} (${json.results[i].release_date.substring(0, 4)})</strong>` // Substring gets only the year
		divTitle.onclick = function(){showSearched(id)};

		divListrank.className = "listrank";
		divListrank.innerHTML = i + 1;

		divMetadata.className = "metadata";

		divMovie.className = "movie";

		divRating.className = "rating";
		divRating.innerHTML = `${json.results[i].vote_average}`

		imgAudience.className = "userimg";
		imgAudience.src =  "https://www.fkbga.com/wp-content/uploads/2018/07/person-icon-6.png";

		imgCover.className = "cover";
		// Will show a default image in case no image was provided
		if(json.results[i].poster_path != null)
			imgCover.src = `https://image.tmdb.org/t/p/w500/${json.results[i].poster_path}`;
		else
			imgCover.src = 'img/notfound.png';
		imgCover.onclick = function(){showSearched(id)};

		divFlag.className = "flag";

		/*
		Adding childs should follow this structure
			movie
				listrank
				img_cover
				metadata
					info
						title
						img_flag
						director
						actors
					critics
						rating
						audience
							img
							*/
		divAudience.appendChild(imgAudience);
		divCritics.appendChild(divRating);
		divCritics.appendChild(divAudience);
		divInfo.appendChild(divTitle);
		divTitle.appendChild(divFlag);
		divInfo.appendChild(divDirector);
		divInfo.appendChild(divActors);
		divMetadata.appendChild(divInfo);
		divMetadata.appendChild(divCritics);
		divMovie.appendChild(divListrank);
		divMovie.appendChild(imgCover);
		divMovie.appendChild(divMetadata);
		ul.appendChild(divMovie);

	}
	list.innerHTML = "";
	list.appendChild(ul);
}

function enterSearch(query){
	query = query.replace(' ', '+');
	XMLRequest('https://api.themoviedb.org/3/search/movie?api_key=c4e60bc3e1f1a5b42b5ec05649fd28ce&query=' + query, loadData);
}

function showSearched(movie_id){
	window.open("../detail/index.html?id=" + movie_id);
}
