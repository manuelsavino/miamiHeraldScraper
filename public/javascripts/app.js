$(function () {

  $.getJSON("/api/article", function (res) {
    res.forEach(function (e) {
      var row = $("div").attr("class", "row")
      var card =
        `<div class="col-lg-3 col-md-4 my-3">
        <div class="card mx-auto" style="width: 17rem; height: 20rem;">
          <a href="${e.url}">
            <div class="card-body">
              <h5 class="card-title">
                ${e.headLine}              
              </h5>
              <p class="card-text">
                ${e.summary.slice(0, 100)}
              </p>
              <a href="#" class="btn btn-primary save-article" data-id=${e._id} </a>Save Article
          </a>
        </div>
        </a>
      </div>
    </div>`
      row.append(card)
      $(".container").append(row)
    })
  })

  $(".scrape").on("click", function () {
    $.ajax({
      url: `api/scrape/`,
      type: 'GET',
    });
    location.reload(true);
  })

  console.log("hello");
  $(document).on("click", ".save-article", function () {
    var id = $(this).data("id");
    $.ajax({
      url: `api/article/`,
      type: "PUT",
      data: { id: id, saved: true }
    });
    location.reload(true);
  });

  $(document).on("click", ".delete", function () {
    console.log("delete")
    var id = $(this).data("id");
    $.ajax({
      url: `api/article/`,
      type: 'DELETE',
      data: { id: id }
    });
    location.reload(true);
  });
});
