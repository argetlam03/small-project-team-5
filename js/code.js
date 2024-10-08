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

	let tmp = { Login: login, Password: password };
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

	let tmp = { FirstName: firstName, LastName: lastName, Login: login, Password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SignUp.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("signupResult").innerHTML = jsonObject.error;
					return;
				}

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

	document.getElementById("error").innerHTML = "";
	document.getElementById("searchList").innerHTML = "";

	if (name == "" || phone == "" || email == "") {
		document.getElementById("error").innerHTML = "Missing values. Please populate all fields.";
		return;
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
				document.getElementById("error").innerHTML = name + " has been successfully added as a contact.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("error").innerHTML = err.message;
	}
}

function searchContacts() {
	let name = document.getElementById("name").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	document.getElementById("error").innerHTML = "";

	let tmp = { userId: userId, name: name, phone: phone, email: email };

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error != "") {
					document.getElementById("error").innerHTML = jsonObject.error;
					document.getElementById("searchList").innerHTML = "";
					return;
				}

				searchListResults = jsonObject;
				buildSearchList(-1);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("error").innerHTML = err.message;
	}
}

function buildSearchList(index) {
	let results = `<tr><th>Name</th><th>Phone Number</th><th>Email</th><th></th><th></th></tr>`;

	for (let i = 0; i < searchListResults.results.length; i++) {
		let contact = searchListResults.results[i];
		if (i == index) {
			results += `<tr><td class="col-space"><input type="text" id="name` + i + `" placeholder="Name" value="` + contact.name + `" /></td>`;
			results += `<td class="col-space"><input type="text" id="phone` + i + `" placeholder="Phone Number" value="` + contact.phone + `" /></td>`;
			results += `<td class="col-space"><input type="text" id="email` + i + `" placeholder="Email" value="` + contact.email + `" /></td>`;
			results += `<td><button type="button" id="updateButton` + i + `" class="buttons" onclick="updateContact(` + i + `);"> <i class="fa-solid fa-floppy-disk"></i> </button></td>`;
			results += `<td><button type="button" id="deleteButton` + i + `" class="buttons" onclick="deleteContact(` + i + `);"> <i class="fa-solid fa-trash"></i> </button></td></tr>`;
		}
		else { 
			results += `<tr><td class="col-space">` + contact.name + `</td><td class="col-space">` + contact.phone + `</td><td class="col-space">` + contact.email + `</td>`;
			results += `<td><button type="button" id="updateButton` + i + `" class="buttons" onclick="buildSearchList(` + i + `);"> <i class="fa-solid fa-pen"></i> </button></td>`;
			results += `<td><button type="button" id="deleteButton` + i + `" class="buttons" onclick="deleteContact(` + i + `);"> <i class="fa-solid fa-trash"></i> </button></td></tr>`;
		}

		if (i < searchListResults.results.length - 1) results += "<br />\r\n";
	}

	document.getElementById("error").innerHTML = "";
	document.getElementById("searchList").innerHTML = results;
}

function updateContact(index) {
	let name = document.getElementById("name" + index).value;
	let phone = document.getElementById("phone" + index).value;
	let email = document.getElementById("email" + index).value;
	let contactId = searchListResults.results[index].contactId;

	if (name == "" || phone == "" || email == "") {
		document.getElementById("error").innerHTML = "Missing values. Please populate all fields.";
		return;
	}

	let tmp = { ID: contactId, userId: userId, Name: name, Phone: phone, Email: email };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("error").innerHTML = err.message;
		return;
	}
}

function deleteContact(index) {
	let tmp = { id: searchListResults.results[index].contactId, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error != "") {
					document.getElementById("error").innerHTML = jsonObject.error;
					return;
				}
				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("error").innerHTML = err.message;
		return;
	}
}