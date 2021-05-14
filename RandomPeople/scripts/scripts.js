const allUsers = document.querySelector(".allusers");
const like = document.querySelector(".like");

function XMLRequest(url, callback){
	const con = new XMLHttpRequest();
	con.responseType = 'json';
	con.open('GET', url);
	con.onreadystatechange = function () {
		if(con.readyState === 4 && con.status === 200){
			callback(con.response.results);
		}
	}
	con.send();
}

XMLRequest("https://randomuser.me/api/?results=3", loadPeople);

function loadPeople(json){
	for(i in json){
		allUsers.innerHTML += `<div class="user" id="user-${i}">
				<img class="userimg" src="${json[i].picture.medium}">
				<div class="info">
					<div class="leftside">
						<span class="name"> ${json[i].name.title} ${json[i].name.first} ${json[i].name.last}</span>
						<span class="email"> <i class="far fa-envelope"></i> ${json[i].email} </span>
						<span class="twitter"> <i class="fab fa-twitter"></i> @${json[i].login.username}</span>
						<span class="like" onclick="toggleLike(${i})">Like</span>
					</div>
					<div class="rightside">
						<span class="date"> <i class="fas fa-birthday-cake"></i> ${json[i].dob.date.substring(0,10)} </span>
						<span class="cell"> <i class="fas fa-phone"></i> ${json[i].cell}</span>
						<span class="street"> <i class="fas fa-map-marker-alt"></i> ${json[i].location.street.number} ${json[i].location.street.name}</span>
						<span class="city"> ${json[i].location.city}</span>
						<span class="postCountry"> ${json[i].location.postcode} ${json[i].location.country}</span>
					</div>
				</div>
			</div>`;
	}
}
function toggleLike(i){
	let toggledLike = document.querySelector("#user-" + i + " .leftside .like");
	if(toggledLike.innerHTML === "Like") {
		toggledLike.innerHTML = "Dislike";
		toggledLike.style.backgroundColor = "#326E9C";
	}
	else{
		toggledLike.innerHTML = "Like";
		toggledLike.style.backgroundColor = "#FFFF02";
	}
}
