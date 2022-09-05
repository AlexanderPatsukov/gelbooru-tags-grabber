import pMap from 'p-map';
import got from 'got';
import fs from 'fs'

let target_site = 'https://gelbooru.com/index.php?page=dapi&s=tag&q=index&json=1&orderby=count&limit=1000&pid='

const iteration_count = await got(target_site.replace('limit=1000', 'limit=1') + '0')
.then((Response)=>{
	return Math.ceil(JSON.parse(Response.body)['@attributes'].count / 1000)
});

const sites = Array.from(Array(iteration_count).keys(), (e)=>{return target_site + e})

const mapper = async site => {
	let requestUrl = await got(site)
	.then((Response)=>{
		return JSON.parse(Response.body).tag
	});
	console.clear()
	console.log(`Page ${site.split('pid=')[1]}`)
	return requestUrl;
};

const result = await pMap(sites, mapper, {concurrency: 10});

const unite_data = result.reduce(
	(arr1, arr2) => arr1.concat(arr2),
	[])

fs.writeFileSync('db.json', JSON.stringify(unite_data))
