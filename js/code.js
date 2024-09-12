const urlBase = 'http://www.processescop4331.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let searchListResults = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doSignUp() {
	userId = 0;
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;

	let login = document.getElementById("signupName").value;
	let password = document.getElementById("signupPassword").value;

	document.getElementById("signupResult").innerHTML = "";

	if (firstName == "" || lastName == "" || login == "" || password == "") {
		document.getElementById("signupResult").innerHTML = "Missing value. Please populate all fields.";
		return;
	}

	let tmp = { firstName: firstName, lastName: lastName, login: login, password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SignUp.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("firstName").value = "";
				document.getElementById("lastName").value = "";
				document.getElementById("signupName").value = "";
				document.getElementById("signupPassword").value = "";
				document.getElementById("signupResult").innerHTML = "Successfully signed up. Please Log In.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("signupResult").innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function createContact() {
	let name = document.getElementById("name").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	if (name == "" || phone == "" || email == "") {
		document.getElementById("createResult").innerHTML = "Missing values. Please populate all fields.";
	}

	let tmp = { userId: userId, Name: name, Phone: phone, Email: email };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/CreateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("name").value = "";
				document.getElementById("phone").value = "";
				document.getElementById("email").value = "";
				document.getElementById("createResult").innerHTML = name + " has been successfully added as a contact.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("createResult").innerHTML = err.message;
	}
}

function searchContacts() {
	let name = document.getElementById("name").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	let results = "";

	let tmp = { userId: userId, Name: name, Phone: phone, Email: email };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				searchListResults = jsonObject;

				for (let i = 0; i < jsonObject.results.length; i++) {
					let contact = jsonObject.results[i]
					results += contact.name + " " + contact.phone + " " + contact.email;
					results += `<button type="button" id="updateButton` + i + `" class="buttons" onclick="updateContact(` + i + `);"> Update </button>`;
					results += `<button type="button" id="deleteButton` + i + `" class="buttons" onclick="deleteContact(` + i + `);"> Delete </button>`;

					if (i < jsonObject.results.length - 1) results += "<br />\r\n";
				}

				document.getElementById("searchList").innerHTML = results;
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("searchError").innerHTML = err.message;
	}
}

function updateContact() {

}

function deleteContact() {

}