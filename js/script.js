var headers = new Headers();

var config = {
	method: 'GET',
	headers: headers,
	mode: 'cors',
	cache: 'default'
};
const key = 'AIzaSyA1Yi7OkvvvM1VE27Tufcet79D92Kcyshw';

// Handlebars
const source = document.getElementById('result-template').innerHTML;
const template = Handlebars.compile(source);

const chSource = document.getElementById('channel-template').innerHTML;
const chTemplate = Handlebars.compile(chSource);

// Nodes
const timeSetters = document.querySelectorAll('[data-set-time]');
const form = document.getElementById('search__form');
const channelForm = document.getElementById('search-channel__form');
const channelIdNode = document.getElementById('channel-search');
const queryNode = document.getElementById('query-search');
const channelNameNode = document.getElementById('channel-name-search');
const channelNameResultNode = document.getElementById('channel-name-result');
const dateFromNode = document.getElementById('date-from');
const dateToNode = document.getElementById('date-to');
const modal = document.getElementById('search-channel-modal');
const showModalBtn = document.getElementById('show-modal');
const results = document.getElementById('results');
const chResults = document.getElementById('channel-results');

// Initial values
dateToNode.value = moment().format("YYYY-MM-DD");
dateFromNode.value = moment().subtract(1, 'months').format("YYYY-MM-DD");

// Evts Listeners
form.addEventListener('submit', handleSearch);
channelForm.addEventListener('submit', handleChannelSearch);
chResults.addEventListener('click', handleChannelClick);

document.addEventListener('click', function(e) {
	if (!modal.contains(e.target)) {
		if (showModalBtn.contains(e.target)) {
			showModal();
		} else {
			hideModal();
		}
	}
});

timeSetters.forEach(setter => {
	setter.addEventListener('click', e => {
		e.preventDefault();
		switch (e.target.dataset.setTime) {
			case 'past month':
				dateToNode.value = moment().format("YYYY-MM-DD");
				dateFromNode.value = moment().subtract(1, 'months').format("YYYY-MM-DD");
				break;
			case 'past year':
				dateToNode.value = moment().format("YYYY-MM-DD");
				dateFromNode.value = moment().subtract(1, 'years').format("YYYY-MM-DD");
				break;
			default:
				dateToNode.value = moment().format("YYYY-MM-DD");
				dateFromNode.value = moment().subtract(1, 'months').format("YYYY-MM-DD");
				break;
		}
	})
})

function handleSearch(e) {
	e.preventDefault();

	let channelId = channelIdNode.value;
	let dateFrom = dateFromNode.value;
	let dateTo = dateToNode.value;

	let url = `https://www.googleapis.com/youtube/v3/search?type=video&publishedAfter=${dateFrom}T00:00:00Z&publishedBefore=${dateTo}T00:00:00Z&channelId=${channelId}&key=${key}&order=viewCount&maxResults=16&part=snippet`;
	if(queryNode.value) url += `&q=${queryNode.value}`;

	fetch(url, config)
		.then(res => {
			results.innerHTML = '';
			channelNameResultNode.textContent = '';
			return res.json();
		})
		.then(json => {
			channelNameResultNode.textContent = json.items[0].snippet.channelTitle;
			json.items.map(item => {
				const href = `https://www.youtube.com/watch?v=${item.id.videoId}`;
				const context = { title: item.snippet.title, body: item.snippet.description, thumb: item.snippet.thumbnails.medium.url, href: href, date: moment(item.snippet.publishedAt).format("MMMM Do YYYY, hA") };
				let html = document.createElement('div');
				html.className = 'results__entry';
				html.innerHTML = template(context);
				results.appendChild(html);
			})
		}).then(() => {
			const resultImages = results.querySelectorAll('img');
			resultImages.forEach(i => {
				i.onload = () => i.style.setProperty('opacity', 1);
			})
		})
}

function handleChannelSearch(e) {
	e.preventDefault();

	let channelName = channelNameNode.value;

	let url = `https://www.googleapis.com/youtube/v3/search?type=channel&key=${key}&part=snippet&q=${channelName}`;

	fetch(url, config)
		.then(res => {
			chResults.innerHTML = '';
			return res.json();
		})
		.then(json => {
			json.items.map(item => {
				const context = { title: item.snippet.channelTitle, thumb: item.snippet.thumbnails.medium.url, id: item.snippet.channelId };
				let html = document.createElement('div');
				html.className = 'channels__entry';
				html.innerHTML = chTemplate(context);
				chResults.appendChild(html);
			})
		})
		.then(() => {
			const resultImages = chResults.querySelectorAll('img');
			resultImages.forEach(i => {
				i.onload = () => i.style.setProperty('opacity', 1);
			})
		})
}

function handleChannelClick(e) {
	e.preventDefault();
	if (e.target.nodeName == 'DIV') {
		channelIdNode.value = e.target.dataset.channelId;
	} else {
		channelIdNode.value = e.target.parentNode.dataset.channelId;
	}
	hideModal();
}

function hideModal() {
	document.body.classList.remove('modal-enter', 'modal-enter-active');
}

function showModal() {
	document.body.classList.add('modal-enter');
	setTimeout(() => document.body.classList.add('modal-enter-active'), 150);
}