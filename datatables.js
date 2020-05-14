$(document).ready(() => {
  $.getJSON("https://julianvos.nl/assets/songs.json", (data) => {

    $('#table').DataTable({
      data: data
    })
  })
})

