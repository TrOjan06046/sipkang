const rootUrl = "https://sipkang.com";

// Dom7
var $ = Dom7;

// Theme
var theme = "auto";
if (document.location.search.indexOf("theme=") >= 0) {
	theme = document.location.search.split("theme=")[1].split("&")[0];
}

// var myApp = new Framework7();

var DeviceID;

document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady(){
	var push = PushNotification.init({ "android": {"senderID": "467818306482"}});
	push.on('registration', function(data) {
		// console.log(data.registrationId);
		// alert(data.registrationId);
		DeviceID = data.registrationId;
		// document.getElementById("gcm_id").innerHTML = data.registrationId;
	});

	push.on('notification', function(data) {
		// alert(data.title+" Message: " +data.message);
	});

	push.on('error', function(e) {
		// alert(e);
	});
}

// Init App
var app = new Framework7({
	id: "io.framework7.testapp",
	root: "#app",
	theme: theme,
	data: function() {
		return {
			user: {
				firstName: "John",
				lastName: "Doe"
			}
		};
	},
	methods: {
		helloWorld: function() {
			app.dialog.alert("Hello World!");
		}
	},
	routes: routes,
	on: {
		pageInit(page) {
			validatelogin();
		}
	},

	theme: "md",
	routes: [
		{
			path: "/about/",
			url: "./pages/about.html"
		},

		{
			path: "/profile/",
			url: "./pages/profile.html",
			on: {
				pageInit(page) {
					Profile();
				}
			}
		},

		{
			path: "/inbox/",
			url: "./pages/inbox.html",
			on: {
				pageInit(page) {
					Inbox();
				}
			}
		},

		{
			path: "/login/",
			url: "./index.html",
			on: {
				pageInit(page) {
					getAllInformasi();
				}
			}
		},

		{
			path: "/logout/",
			url: "./pages/login-screen.html",
			on: {
				pageInit(page) {
					app.params.swipePanel = false;
					Logout();
				}
			}
		},

		{
			path: "/change/",
			url: "./pages/change-password.html"
		},

		{
			path: "/home/",
			url: "./index.html",
			on: {
				pageInit(page) {
					getAllInformasi();
				}
			}
		},

		// {
		// 	path: "/signin/",
		// 	url: "./pages/login-screen.html",
		// 	on: {
		// 		pageInit(page) {
		// 			Logina();
		// 		}
		// 	}
		// },

		// {
		// 	path: "/detail/",
		// 	url: "./pages/detail.html",
		// 	on: {
		// 		pageInit: function(e, page){
		// 			const idFromQuery = page.route.query.id;
		// 			getInformasiSingle(idFromQuery);
		// 		}
		// 	}
		// },

		{
			path: "/detail-info/",
			url: "./pages/detail-info.html",
			on: {
				pageInit: function(e, page){
					const idFromQuery = page.route.query.id;
					getInformasiSingle(idFromQuery);
				}
			}
		},

		{
			path: "/detail-message/",
			url: "./pages/detail-pesan.html",
			on: {
				pageInit: function(e, page){
					const idFromQuery = page.route.query.id;
					getPesanSingle(idFromQuery);
				}
			}
		},

	],
	touch: {
		tapHold: true
	},
	view: {
		xhrCache: false,
		pushState: true,
		uniqueHistory: true
	},
	panel: {
		leftBreakpoint: 768,
		swipe: "left"
	},
	dialog: {
		title: "My App"
	},
	popup: {
		closeByBackdropClick: true
	},
	smartSelect: {
		openIn: "popup",
		searchbar: true
	},
	navbar: {
		hideOnPageScroll: false,
		scrollTopOnTitleClick: true
	},
	lazy: {
		threshold: 50
	},
	statusbar: {
		overlay: false,
		scrollTopOnClick: true
	}
});

// appName.onPageInit('screenName', function (page) {
//     appName.params.swipePanel = false;
// });

// function Logina() {
// 	app.dialog.alert("Hello World!");
// }

$(document).on('click', '.logout', function(e){
  	// Logina();
  	// var formData = app.form.convertToData('#form-login');
  	// alert(JSON.stringify(formData));
  	Logout();
});

$(document).on('click', '.app-login', function(e){
  	// Logina();
  	var formData = app.form.convertToData('#form-login');
  	// alert(JSON.stringify(formData));
  	Login(formData['username'], formData['password']);
});

$(document).on('click', '.app-change-password', function(e){
  	// Logina();
  	var formData = app.form.convertToData('#from-change-password');
  	// alert(JSON.stringify(formData));
  	// console.log(JSON.parse(localStorage.userdata));	
  	var datauser = JSON.parse(localStorage.userdata);
  	if (datauser['password'] != formData['password'] || !formData['password']) {
  		app.dialog.alert("Wrong Password ... ");
  		$("#demo-password-1").focus();
  		$("#demo-password-1").val('');
  	} else if (!formData['newpassword']) {
  		app.dialog.alert("Input your new password ... ");
  		$("#demo-password-2").focus();
  		$("#demo-password-2").val('');
  	} else if (formData['newpassword'] != formData['confirmpassword']) {
  		app.dialog.alert("Confirmation not match ... ");
  		$("#demo-password-3").focus();
  		$("#demo-password-3").val('');
  	} else {
  		ChangePassword(datauser['nip'], formData['newpassword']);
  	}
  	
});

function Profile() {
	if (localStorage.userdata) {		
		var datauser = JSON.parse(localStorage.userdata);
		$("#nip-pegawai")
		.html(datauser['nip'])
		.show();
		$("#nama-pegawai")
		.html(datauser['nama'])
		.show();
		$("#pankat-pegawai")
		.html(datauser['golongan'])
		.show();
		$("#jabatan-pegawai")
		.html(datauser['jabatan'])
		.show();
		$("#penempatan-pegawai")
		.html(datauser['tempat_tugas'])
		.show();
	}
}

function getInformasiSingle(id) {
	if (localStorage.userdata) {
		// console.log(localStorage.userdata);
		var datauser = JSON.parse(localStorage.userdata);
		Framework7.request.get(
			rootUrl + "/getInformasi.php",
			{ id: id, nip: datauser['nip']},
			function(response) {
				if (response[0]) {
					const info = response[0];

					$("#informasiContentBlock").html(`
	                  <div class="card">
	                      <div class="card-header"><h3>${info.info_judul}</h3></div>
	                      <div class="card-content card-content-padding">${info.info_isi}</div>
						  <div class="card-footer">${info.info_waktu}</div>
	                	</div>
	              `);
				}
			},
			function(error) {
				console.log(error);
				app.dialog.alert("System Error, please try again later ... !!!");
			},
			"json"
		);
	}
	
}

function getPesanSingle(id) {
	if (localStorage.userdata) {
		// console.log(localStorage.userdata);
		var datauser = JSON.parse(localStorage.userdata);
		Framework7.request.get(
			rootUrl + "/getPesan.php",
			{ id: id, nip: datauser['nip']},
			function(response) {
				if (response[0]) {
					const info = response[0];

					$("#pesanContentBlock").html(`
	                  <div class="card">
	                      <div class="card-header"><h3>${info.pesan_judul}</h3></div>
	                      <div class="card-content card-content-padding">${info.pesan_isi}</div>
						  <div class="card-footer">${info.pesan_waktu}</div>
	                	</div>
	              `);
				}

				Inbox();
			},
			function(error) {
				console.log(error);
				app.dialog.alert("System Error, please try again later ... !!!");
			},
			"json"
		);
	}	
}

function Inbox() {
	if (localStorage.userdata) {
		// console.log(localStorage.userdata);
		var datauser = JSON.parse(localStorage.userdata);
		Framework7.request.get(
			rootUrl + "/getPesan.php",
			{ nip: datauser['nip'] },
			function(response) {
				
				var contentlist = '';

				for (var i = 0; i < response.length; i++) {
					contentlist += '<li>';
					contentlist += '<a href="/detail-message/?id='+response[i].id+'" class="item-link item-content" style="text-decoration:none;">';
					contentlist += '<div class="item-inner">';
					contentlist += '<div class="item-title-row">';
					contentlist += '<div class="item-title">';
					if (parseInt(response[i].pesan_status) <= 0 || response[i].pesan_status == null) {contentlist += '<span class="badge color-red">New</span>';}
					contentlist += ''+response[i].pesan_judul+'</div>';
					contentlist += '</div>';
					contentlist += '<div class="item-text">'+response[i].pesan_isi+'</div>';
					contentlist += '<div class="date-info">';
					contentlist += '<div class="jam-info">'+response[i].pesan_waktu+'</div>';
					contentlist += '</div>';
					contentlist += '</div>';
					contentlist += '</a>';
					contentlist += '</li>';
				}

				const htmlContent = response.map(function(info) {
					if (parseInt(info.pesan_status) == 0) {
						return `
						<li>
							<a href="/detail-message/?id=${info.id}" class="item-link item-content">
								<div class="item-inner">
									<div class="item-title-row">
										<div class="item-title"><span class="badge color-red">New</span>${info.pesan_judul}</div>
									</div>
									<div class="item-text">${info.pesan_isi}</div>
								<div class="date-info">

									<div class="jam-info">${info.pesan_waktu}</div>
								</div>
							</div>
							</a>
						</li>
						`;
					} else {
						return `
						<li>
							<a href="/detail-message/?id=${info.id}" class="item-link item-content">
								<div class="item-inner">
									<div class="item-title-row">
										<div class="item-title">${info.pesan_judul}</div>
									</div>
									<div class="item-text">${info.pesan_isi}</div>
								<div class="date-info">

									<div class="jam-info">${info.pesan_waktu}</div>
								</div>
							</div>
							</a>
						</li>
						`;
					}
					
				});

				$("#listPesan")
					.html(contentlist)
					.show();
			},
			function(error) {
				console.log(error);
				app.dialog.alert("System Error, please try again later ... !!!");
			},
			"json"
		);
	}
	
}

function getAllInformasi() {
	if (localStorage.userdata) {
		// console.log(localStorage.userdata);
		var datauser = JSON.parse(localStorage.userdata);
		$("#name-employee-login")
			.html(datauser['nama'])
			.show();

		Framework7.request.get(
			rootUrl + "/getNewMessage.php",
			{nip: datauser['nip']},
			function(response) {

				if (parseInt(response['total_new_message']) > 0) {
					//output
					const htmlContent = parseInt(response['total_new_message'])

					$("#count-notif")
						.html(htmlContent)
						.show();
				} else {
					$("#count-notif").hide();
				}
			},
			function(error) {
				console.log(error);
				app.dialog.alert("Message Error, please try again later ... !!!");
			},
			"json"
		);

		Framework7.request.get(
			rootUrl + "/getInformasi.php",
			{nip: datauser['nip']},
			function(response) {
				var contentlist = '';
				if (response.length > 0) {
					
					for (var i = 0; i < response.length; i++) {
						contentlist += '<li>';
						contentlist += '<a href="/detail-info/?id='+response[i].id+'" class="item-link item-content" style="text-decoration:none;">';
						contentlist += '<div class="item-inner">';
						contentlist += '<div class="item-title-row">';
						contentlist += '<div class="item-title">';
						if (parseInt(response[i].total_view) <= 0 || response[i].total_view == null) {contentlist += '<span class="badge color-red">New</span>';}
						contentlist += ''+response[i].info_judul+'</div>';
						contentlist += '</div>';
						contentlist += '<div class="item-text">'+response[i].info_isi+'</div>';
						contentlist += '<div class="date-info">';
						contentlist += '<div class="jam-info">'+response[i].info_waktu+'</div>';
						contentlist += '</div>';
						contentlist += '</div>';
						contentlist += '</a>';
						contentlist += '</li>';
					}

					const htmlContent = response.map(function(info) {

						if (parseInt(info.total_view) > 0) {
							return `
							<li>
								<a href="/detail-info/?id=${info.id}" class="item-link item-content">
									<div class="item-inner">
										<div class="item-title-row">
											<div class="item-title">${info.info_judul}</div>
										</div>
										<div class="item-text">${info.info_isi}</div>
									<div class="date-info">

										<div class="jam-info">${info.info_waktu}</div>
									</div>
								</div>
								</a>
							</li>
							`;
						} else {
							return `
							<li>
								<a href="/detail-info/?id=${info.id}" class="item-link item-content">
									<div class="item-inner">
										<div class="item-title-row">
											<div class="item-title"><span class="badge color-red">New</span>${info.info_judul}</div>
										</div>
										<div class="item-text">${info.info_isi}</div>
									<div class="date-info">

										<div class="jam-info">${info.info_waktu}</div>
									</div>
								</div>
								</a>
							</li>
							`;
						}
					
					});

					$("#listInfo")
						.html(contentlist)
						.show();
				}
			},
			function(error) {
				console.log(error);
				app.dialog.alert("System Error, please try again later ... !!!");
			},
			"json"
		);
	}
	
}

function Login(nip, password) {
	console.log(DeviceID);
	Framework7.request.post(
		rootUrl + "/Login.php",
		{ nip: nip , password: password, deviceid: DeviceID},
		function(response) {
			if (response['Response'].length > 0) {
				localStorage.setItem("userdata", JSON.stringify(response['Response'][0]));
				// console.log('Login Success, enjoy yourself ...');
				// console.log(localStorage);
				// console.log(localStorage.userdata);
				// console.log(JSON.parse(localStorage.userdata));	
				app.dialog.alert("Login Success ... ");
				$("#login-screen").hide();
				$("#main-page").show();
				getAllInformasi();
				location.href = '#';

				// app.mainView.router.load({url: "./index.html"});

			} else {
				// app.dialog.alert("Login Failed ... !!!");
				$('.error').addClass('alert alert-danger').html("Invalid Username / Password Combination");
			}
		},
		function(error) {
			console.log(error);
			app.dialog.alert("System Error, please try again later ... !!!");
		},
		"json"
	);
}

function validatelogin() {
	if (localStorage.userdata) {		
		var datauser = JSON.parse(localStorage.userdata);
		// app.dialog.alert("Welcome to SIPKANG : "+datauser['nama']);
		getAllInformasi();
		// $("#login-screen").hide();
		// $("#main-page").show();
	} else {
		// app.dialog.alert("You must login first");
		// $("#login-screen").show();
		$("#logout").click();
	}
}

function ChangePassword(id_user, newpassword) {
	Framework7.request.post(
		rootUrl + "/changePassword.php",
		{ nip: id_user , password: newpassword},
		function(response) {
			if (response['Status'] == true) {
  				var datauser = JSON.parse(localStorage.userdata);
  				datauser['password'] = newpassword;
				localStorage.setItem("userdata", JSON.stringify(datauser));
				// console.log('Login Success, enjoy yourself ...');
				// console.log(localStorage);
				// console.log(localStorage.userdata);
				// console.log(JSON.parse(localStorage.userdata));	
				app.dialog.alert("Change Password Success ... ");
				// gotohome();
				// location.href('/home/');
				$("#demo-password-1").val('');
				$("#demo-password-2").val('');
				$("#demo-password-3").val('');
				// app.mainView.router.load({url: "./index.html"});

			} else {
				app.dialog.alert("Change Password Failed ... !!!");
			}
		},
		function(error) {
			console.log(error);
			app.dialog.alert("System Error, please try again later ... !!!");
		},
		"json"
	);
}

function Logout() {
	// $("#login-screen").show();
	// $("#main-page").hide();
	localStorage.clear();
	// alert('test');
	console.log(localStorage);
}


function getUserData(id_user) {
	Framework7.request.get(
		rootUrl + "/getUserData.php",
		{ id: id },
		function(response) {
			if (response.length > 0) {
				//output
				const htmlContent = response.map(function(info) {
					return `
				<li>
					<a href="/detail-info/?id=${info.id}" class="item-link item-content">
						<div class="item-inner">
							<div class="item-title-row">
								<div class="item-title"><span class="badge color-red">New</span>${info.info_judul}</div>
							</div>
							<div class="item-text">${info.info_isi}</div>
						<div class="date-info">

							<div class="jam-info">${info.info_waktu}</div>
						</div>
					</div>
					</a>
				</li>
				`;
				});

				$("#listInfo")
					.html(htmlContent)
					.show();
			}
		},
		function(error) {
			console.log(error);
			app.dialog.alert("System Error, please try again later ... !!!");
		},
		"json"
	);
}