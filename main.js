
//only 3 job pages
// ('GET', 'https://jobs.github.com/positions.json?page=1', true); for jobs JSON
//https://jobs.github.com/positions/${id}.json for position json

//theme toggle
var head = document.querySelector('#theme');
var theme = document.querySelector('input[type = "checkbox"]');
var selection = JSON.parse(localStorage.getItem('theme'));

if(selection){
	head.href = 'styles1.css';
	theme.checked = true;
}

theme.addEventListener('change', function(){
	if (this.checked){
		head.href = 'styles1.css';
		localStorage.setItem('theme', true)
	}else{
		head.href = 'styles.css';
		localStorage.setItem('theme', false)
	}
})

//Creation of Job Card
var mainnav= document.querySelector('#filters');
var count = 0;

var icons = [
	'./img/1.png',
	'./img/2.png',
	'./img/3.png',
	'./img/4.png',
	'./img/5.png',
	'./img/6.png',
	'./img/7.png'
]

class Job{
	constructor(obj){
		this.jobname = obj['title'];
		this.company = obj['company'];
		this.location = obj['location'];
		this.type = obj['type'];
		this.postTime = obj['created_at'];
		this.url = obj['url'];
		this.icon = icons[count];
		this.id = obj['id'];
	}

	time(){
		var weekday = new Array(7);
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		var a = new Date(this.postTime);
		return `${a.getHours()}:${a.getMinutes()} on ${weekday[a.getDay()]}, ${a.getFullYear()}`; 
	}

	jobCard(){
		return `
		<div class="jobCard" id="${this.id}">
			<img src="${this.icon}" alt="company icon" class="jobIcon">
			<p class="jobTime">Posted ${this.time()}</p>
			<p class="jobTitle">${this.jobname}</p>
			<p class="companyName">${this.company}</p>
			<p class="jobLocation">${this.location}</p>
			<a href="${this.id}" class="joblinks">View Job</a>
		</div>
		`
	}
}

//show/hide filter{

var filterbtn = document.querySelector('#filter-btn');
var filter = document.querySelector('#filter-items');
filterbtn.addEventListener('click', function(){
	var a = window.getComputedStyle(filter).getPropertyValue('visibility');
	if (a == 'hidden'){
		filter.style.visibility = 'visible';
	}else{
		filter.style.visibility = 'hidden'
	}
}
)
// The magic begins

var jobs = document.querySelector('.jobs');
var arr;

//auto load page


function populate(arr){
	for (let i in arr){
		count ++;
		if (count >= icons.length){
			count = 0
		}
		var emp = new Job(arr[i]);
		jobs.innerHTML += emp.jobCard();
	}
	openjob();
}


var siteurl = window.location.href;



( function(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", `https://githubjobsapi.waynejr.repl.co/jobs?page=1`, true); // assuming you’re hosting it locally
	xhr.onload = function (){
		if (this.status == 200){
			var arr = JSON.parse(this.responseText);
			populate(arr);
	}}

	xhr.send()
})()


function populate(arr){
	for (let i in arr){
		count ++;
		if (count >= icons.length){
			count = 0
		}
		var emp = new Job(arr[i]);
		jobs.innerHTML += emp.jobCard();
	}
	openjob();
}


/*

var paul = {
	company: "Limango",
	company_logo: "https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdnFMIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--12210a670640379f77b6d5d09f027d319609c4fb/Limango.png",
	company_url: "https://www.limango.de/ehp",
	created_at: "Wed Oct 14 08:30:42 UTC 2020",
id: "ba835cf0-1f82-4233-9ee2-1091cc9ad75a",
location: "Munich",
title: "PHP Developer (m/w/d) Marketplace",
type: "Full Time",
url: "https://jobs.github.com/positions/ba835cf0-1f82-4233-9ee2-1091cc9ad75a"}

*/
//pagination client-side :-)


var next = document.querySelector('#nextbtn');
var prev = document.querySelector('#prevbtn');
var currentpg = document.querySelector('#current');

next.addEventListener('click', function(){
	currentpg.textContent = parseInt(currentpg.textContent) + 1;
	checkPg();
	loadPg();
})

prev.addEventListener('click', function(){
	currentpg.textContent = parseInt(currentpg.textContent) - 1;
	checkPg();
	loadPg();
})

function checkPg(){
	if (parseInt(currentpg.textContent) == 3){
		next.style.visibility = 'hidden';
	}else if(parseInt(currentpg.textContent) == 1){
		prev.style.visibility = 'hidden';
	}else{
		next.style.visibility = 'visible';
		prev.style.visibility = 'visible';
	};
}

function loadPg(){
	jobs.innerHTML = '';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `https://githubjobsapi.waynejr.repl.co/jobs?page=${parseInt(currentpg.textContent)}`, true);
	xhr.onload = function (){
		if (this.status == 200){
			arr = JSON.parse(this.responseText);
			populate(arr);
			
	}
		};

	xhr.send();
}


//filters
var filterjobs = document.querySelector('#form');
filterjobs.addEventListener('submit', filterJobs);

function filterJobs(e){
	e.preventDefault();
	var a = document.querySelector('#titlefilter').value; // job title or company name
	var b = document.querySelector('#locationfilter').value // loctation i.e city, country
	var c = document.querySelector('#fulltimefilter').checked // fulltime only jobs filter;
	jobs.innerHTML = '';
	document.querySelector('#pagination').style.visibility = 'hidden';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `https://githubjobsapi.waynejr.repl.co/jobs?description=${a}&full_time=${c}&location=${b}`, true);
	xhr.onload = function (){
		if (this.status == 200){
			arr = JSON.parse(this.responseText);
			populate(arr);
			
	}
		};

	xhr.send();
}


//click on job
function openjob(){
	var jobarr = document.querySelectorAll('.joblinks');
	Array.from(jobarr).forEach(item => item.addEventListener('click', displayjob));

	function displayjob(e){
	e.preventDefault();
	console.log(e.target.href);
	jobs.innerHTML = '';
	document.querySelector('#pagination').style.visibility = 'hidden';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `https://githubjobsapi.waynejr.repl.co/jobs/${e.target.getAttribute('href')}`, true);
	xhr.onload = function (){
		if (this.status == 200){
			arr = JSON.parse(this.responseText);
			var pme = new Jobdesc(arr);
			console.log(pme.jobpage())
			mainnav.innerHTML = pme.quickactions();
			jobs.innerHTML = pme.jobpage();
			back2site();
			
	}
		};

	xhr.send();
	}
}

class Jobdesc{
	constructor(obj){
		this.jobname = obj['title'];
		this.company = obj['company'];
		this.location = obj['location'];
		this.type = obj['type'];
		this.postTime = obj['created_at'];
		this.url = obj['url'];
		this.icon = icons[count];
		this.desc = obj['description'];
		this.apply = obj['how_to_apply'];
		this.site = obj['company_url']
	}

	time(){
		var weekday = new Array(7);
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		var a = new Date(this.postTime);
		return `${a.getHours()}:${a.getMinutes()} on ${weekday[a.getDay()]}, ${a.getFullYear()}`; 
	}

	jobpage(){
		return `
		<div class="jobbody">
			<p class="jobbody-time">Posted ${this.time()} • ${this.type}</p>
			<p class="jobody-title">${this.company}</p>
			<p class="jobody-location">${this.location}</p>
			<div class ="job-desc-">${this.desc}</div>
			
		</div>

		<div class="howtoApply">
			<p class="hta">How To Apply</>
				${this.apply}
		</div>
		`
	}

	quickactions(){
		return `
		<div class="jobbrand">
			<img src="${this.icon}">
			<div class="jobNames">
				<p class="jobNames-main">${this.company}</p>
				<p class="jobNames-url"><a href="${this.site}" target="_blank">${this.site}</a></p>
			</div>
			<div class="jobDiv">
				<button class="backbtn">Go Back To Site</button>
			</div>
		</div>
		`
	}
}

//
function loadPg2(){
	mainnav.innerHTML = `
	<form id="form">
			<div id="title">
				<label for="title">
					<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 width="28.931px" height="28.932px" viewBox="0 0 28.931 28.932" style="enable-background:new 0 0 28.931 28.932;"
					 xml:space="preserve">
				<g>
					<path d="M28.344,25.518l-6.114-6.115c1.486-2.067,2.303-4.537,2.303-7.137c0-3.275-1.275-6.355-3.594-8.672
						C18.625,1.278,15.543,0,12.266,0C8.99,0,5.909,1.275,3.593,3.594C1.277,5.909,0.001,8.99,0.001,12.266
						c0,3.276,1.275,6.356,3.592,8.674c2.316,2.316,5.396,3.594,8.673,3.594c2.599,0,5.067-0.813,7.136-2.303l6.114,6.115
						c0.392,0.391,0.902,0.586,1.414,0.586c0.513,0,1.024-0.195,1.414-0.586C29.125,27.564,29.125,26.299,28.344,25.518z M6.422,18.111
						c-1.562-1.562-2.421-3.639-2.421-5.846S4.86,7.983,6.422,6.421c1.561-1.562,3.636-2.422,5.844-2.422s4.284,0.86,5.845,2.422
						c1.562,1.562,2.422,3.638,2.422,5.845s-0.859,4.283-2.422,5.846c-1.562,1.562-3.636,2.42-5.845,2.42S7.981,19.672,6.422,18.111z"/>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				</svg>
				</label>
				<input type="text" name="filter" placeholder="Filter by title, companies, expertise" id="titlefilter">
			</div>


			<div id="filter-btn">
				<svg version="1.1" id="Capa_3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 width="971.986px" height="971.986px" viewBox="0 0 971.986 971.986" style="enable-background:new 0 0 971.986 971.986;"
					 xml:space="preserve">
				<g>
					<path d="M370.216,459.3c10.2,11.1,15.8,25.6,15.8,40.6v442c0,26.601,32.1,40.101,51.1,21.4l123.3-141.3
						c16.5-19.8,25.6-29.601,25.6-49.2V500c0-15,5.7-29.5,15.8-40.601L955.615,75.5c26.5-28.8,6.101-75.5-33.1-75.5h-873
						c-39.2,0-59.7,46.6-33.1,75.5L370.216,459.3z"/>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				</svg>
			</div>
			
			<div id="filter-items">
				<div id="location">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 512"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M195,512,350.9,312.13l.18-.22A193.32,193.32,0,0,0,390,195C390,87.48,302.52,0,195,0S0,87.48,0,195A193.44,193.44,0,0,0,39.1,312.13Zm0-452c74.44,0,135,60.56,135,135S269.44,330,195,330,60,269.44,60,195,120.56,60,195,60Z"/></g></g></svg>
					<input type="text" name="location" placeholder="Filter by location" id="locationfilter">
				</div>

				<div id="full">
					<label class="container">Full Time Only
					  <input type="checkbox" id="fulltimefilter">
					  <span class="checkmark"></span>
					</label>
				</div>
			</div>

				<input type="submit" name="submit" value="Search" id="submit-btn">
			<div>

			</div>
		</form>
	`;
	document.querySelector('#pagination').style.visibility = 'visible';
	loadPg();

}

//backtosite
function back2site(){
	var backbtn2 = document.querySelector('.backbtn');
	backbtn2.addEventListener('click', loadPg2);
}
