var body = document.querySelector("body");

function get_json(){
	var con = new XMLHttpRequest();
	con.responseType = 'json';
	con.onreadystatechange = function () {
		if(con.readyState == 4 && con.status == 200){
			const json = con.response;
			load_data(json);
		}
	}
	con.open('GET', 'https://api.themoviedb.org/3/movie/popular?api_key=3109a8b52a2b9477564cdfe422add54f&language=en-US&page=1');
	con.send();
}

function fetch_movie_credits(id, div_director, div_actors){
	var con = new XMLHttpRequest();
	con.responseType = 'json';
	con.onreadystatechange = function () {
		if(con.readyState == 4 && con.status == 200){
			const json_meta = con.response;
			for (var i = 0 ; i<json_meta.crew.length; i++) {
				if(json_meta.crew[i].job == "Director") {
					div_director.innerHTML = `<a href=""> ${json_meta.crew[i].name} </a>`;
					break;
				}
			}
			// Value defaults to "NO DATA" if unset
			if(div_director.innerHTML === "") div_director.innerHTML = `<a href="">NO DATA</a>`;
			div_actors.innerHTML = "";
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

function load_data(json){
	var ul = document.createElement("ul");
	var counter = 1;
	for (var i = 0 ; i < json.results.length; i++) {

		var div_actors = document.createElement("div");
		var div_audience = document.createElement("div");
		var div_critics = document.createElement("div");
		var div_director = document.createElement("div");
		var div_info = document.createElement("div");
		var div_listrank = document.createElement("div");
		var div_metadata = document.createElement("div");
		var div_movie = document.createElement("div");
		var div_rating = document.createElement("div");
		var img_audience = document.createElement("img");
		var img_cover = document.createElement("img");
		var img_flag = document.createElement("img");

		div_actors.className = "actors";

		div_director.className = "director";

		// Sets actors and director
		fetch_movie_credits(json.results[i].id, div_director, div_actors);

		div_audience.className = "audience";
		div_audience.innerHTML = `${json.results[i].vote_count}`;

		div_critics.className = "critics";

		div_info.className = "info";
		div_info.innerHTML = `<strong>${json.results[i].title} (${json.results[i].release_date.substring(0, 4)})</strong>` // Substring gets only the year

		div_listrank.className = "listrank";
		div_listrank.innerHTML = counter;

		div_metadata.className = "metadata";

		div_movie.className = "movie";

		div_rating.className = "rating";
		div_rating.innerHTML = `${json.results[i].vote_average}`

		img_audience.className = "userimg";
		img_audience.src =  "https://www.fkbga.com/wp-content/uploads/2018/07/person-icon-6.png";

		img_cover.className = "cover";
		img_cover.src = `https://image.tmdb.org/t/p/w500/${json.results[i].poster_path}`

		img_flag.className = "flag";
		img_flag.src = "https://www.filmaffinity.com/imgs/countries/US.jpg";

		/*
		Adding childs should follow this structure
			movie
				listrank
				img_cover
				metadata
					info
						img_flag
						director
						actors
					critics
						rating
						audience
							img
		*/
		div_audience.appendChild(img_audience);
		div_critics.appendChild(div_rating);
		div_critics.appendChild(div_audience);
		div_info.appendChild(img_flag);
		div_info.appendChild(div_director);
		div_info.appendChild(div_actors);
		div_metadata.appendChild(div_info);
		div_metadata.appendChild(div_critics);
		div_movie.appendChild(div_listrank);
		div_movie.appendChild(img_cover);
		div_movie.appendChild(div_metadata);
		ul.appendChild(div_movie);

		++counter;
	}
	body.appendChild(ul);
}
