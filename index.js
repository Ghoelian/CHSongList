const express = require('express')
const fs = require('fs')
const sortJson = require('sort-json-array')

const app = express()
const port = 3000

const raw = fs.readFileSync('songs.json')
const json = JSON.parse(raw)

const max = 100 // Max number of entries per page

const paginate = (page, sort) => {
	const intPage = parseInt(page) // Integer of the current page, because javascript is stupid

	const sorted = sortJson(json, sort) // Object array sorted according to the sort variable
	const start = max * intPage // What absolute index the page should start at
	const result = [] // Soon-to-be object array that will hold the paginated result

	for (let i = 0; i < max; i++) {
		if (i + start < sorted.length) { // Making sure we don't try to access an index in the array that doesn't exist
			sorted[i + start].Id = i + start + 1 // Adding an id param to the array, as it is not currently present
			result[i] = sorted[i + start] // Taking entries form the sorted array, making sure it starts at the actualy starting position of the page and not at 0, and adds it to the result array
		} else {
			break
		}
	}

	return result
}

const lastPage = (list) => {
	return Math.floor(list.length / max)
}

app.get('/', (req, res) => {
	const sort = req.query.sort == undefined ? 'Name' : req.query.sort // Setting sort to name if it's undefined from the query params
	const page = req.query.page == undefined || req.query.page <= 0 ? 0 : req.query.page // Setting page to 0 if it's currently less than 0 or undefined from the query params

	let resHTML = `<button onclick="location.href = '${req.protocol + '://chsonglist.julianvos.nl?page=0&sort=' + sort}'">First page</button><button onclick="location.href = '${req.protocol + '://chsonglist.julianvos.nl?page=' + (parseInt(page)-1) + '&sort=' + sort}'">Previous page</button> ${parseInt(page)+1} / ${lastPage(json)+1} <button onclick="location.href = '${req.protocol + '://chsonglist.julianvos.nl?page=' + (parseInt(page)+1) + '&sort=' + sort}'">Next page</button><button onclick="location.href = '${req.protocol + '://chsonglist.julianvos.nl?page=' + parseInt(lastPage(json)) + '&sort=' + sort}'">Last page</button><br/><br/>`
	const songList = paginate(page, sort) // Returns a paginated and sorted array of objects

	resHTML += `
		<style>
			table, th, td {
				border: 1px solid black;
				border-collapse: collapse;
			}
		</style>
		<table>
			<tr>
				<th>No.</th>
				<th><a href='${req.protocol + '://chsonglist.julianvos.nl?page=' + page + '&sort=Name'}'>Name</a></th>
				<th><a href='${req.protocol + '://chsonglist.julianvos.nl?page=' + page + '&sort=Artist'}'>Artist</a></th>
				<th><a href='${req.protocol + '://chsonglist.julianvos.nl?page=' + page + '&sort=Album'}'>Album</a></th>
				<th><a href='${req.protocol + '://chsonglist.julianvos.nl?page=' + page + '&sort=Genre'}'>Genre</a></th>
				<th><a href='${req.protocol + '://chsonglist.julianvos.nl?page=' + page + '&sort=Charter'}'>Charter</a></th>
				<th><a href='${req.protocol + '://chsonglist.julianvos.nl?page=' + page + '&sort=Year'}'>Year</a></th>
				<th><a href='${req.protocol + '://chsonglist.julianvos.nl?page=' + page + '&sort=Playlist'}'>Playlist</a></th>
			</tr>`

	songList.forEach(song => {
		resHTML += `
			<tr>
				<td>${song.Id}</td>
				<td>${song.Name}</td>
				<td>${song.Artist}</td>
				<td>${song.Album}</td>
				<td>${song.Genre}</td>
				<td>${song.Charter}</td>
				<td>${song.Year}</td>
				<td>${song.Playlist}</td>
			</tr>`
	})

	resHTML += `</table><br/><button onclick="location.href = '${req.protocol + '://chsonglist.julianvos.nl?page=0&sort=' + sort}'">First page</button><button onclick="location.href = '${req.protocol + '://chsonglist.julianvos.nl?page=' + (parseInt(page)-1) + '&sort=' + sort}'">Previous page</button> ${parseInt(page)+1} / ${lastPage(json)+1} <button onclick="location.href = '${req.protocol + '://chsonglist.julianvos.nl?page=' + (parseInt(page)+1) + '&sort=' + sort}'">Next page</button><button onclick="location.href = '${req.protocol + '://chsonglist.julianvos.nl?page=' + parseInt(lastPage(json)) + '&sort=' + sort}'">Last page</button>`
	res.send(resHTML)
})

app.listen(port)