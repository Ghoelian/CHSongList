$(document).ready(() => {
	$.get("https://julianvos.nl/assets/songs.json", (data) => {
		$('#table').DataTable({
			data: data,
			columns: [
				{ data: "Name" },
				{ data: "Artist" },
				{ data: "Album" },
				{ data: "Genre" },
				{ data: "Charter" },
				{ data: "Year" },
				{ data: "Playlist" }
			]
		})
	})
})
