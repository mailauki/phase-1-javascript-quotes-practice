document.addEventListener("DOMContentLoaded", () => {
  getList()

  form.addEventListener("submit", handleSubmit)
  
  createEditForm()
})

const list = document.querySelector("#quote-list")
const form = document.querySelector("#new-quote-form")
const submit = form.querySelector("button")
const newQuote = form.querySelector("#new-quote")
const author = form.querySelector("#author")
let editQuote = false

function handleSubmit(e) {
  e.preventDefault()
  postQuote()
  form.reset()
}

function handleEditSubmit(e) {
  e.preventDefault()
  let submitId = e.target.querySelector("button").id
  updateQuote(parseInt(submitId))
}

function handleDelete(e) {
  let thisCard = e.target.parentNode.parentNode
  thisCard.remove()

  removeQuote(thisCard.id)
}

function handleLike(e) {
  let thisCard = e.target.parentNode.parentNode
  thisCard.querySelector("span").innerText++

  addLike(thisCard.id)
}

function handleEdit(e) {
  const editQuoteForm = document.querySelector("#edit-quote-form")
  editQuote = !editQuote
  
  if (editQuote) {
    editQuoteForm.style.display = "block"

    let inputQuote = e.target.parentNode.firstChild.innerText
    let inputAuthor = e.target.parentNode.firstChild.nextSibling.innerText

    document.querySelector("input[name='quote']").setAttribute("value", inputQuote)
    document.querySelector("input[name='author']").setAttribute("value", inputAuthor)
    document.querySelector("button").id = e.target.parentNode.parentNode.id

    clearList()
  }
  else {
    editQuoteForm.style.display = "none"
    getList()
  }
}

function createEditForm() {
  const editForm = document.createElement("form")
  editForm.id = "edit-quote-form"
  editForm.style.display = "none"

  const formGroup1 = document.createElement("div")
  formGroup1.classList.add("form-group")
  editForm.appendChild(formGroup1)

  const quoteLabel = document.createElement("label")
  quoteLabel.setAttribute("for", "edit-quote")
  quoteLabel.innerText = "Edit Quote"
  formGroup1.appendChild(quoteLabel)

  const editQuote = document.createElement("input")
  editQuote.classList.add("form-control")
  editQuote.setAttribute("name", "quote")
  editQuote.setAttribute("type", "text")
  editQuote.setAttribute("placeholder", "quote")
  formGroup1.appendChild(editQuote)

  const formGroup2 = document.createElement("div")
  formGroup2.classList.add("form-group")
  editForm.appendChild(formGroup2)

  const authorLabel = document.createElement("label")
  authorLabel.setAttribute("for", "Author")
  authorLabel.innerText = "Edit Author"
  formGroup2.appendChild(authorLabel)

  const editAuthor = document.createElement("input")
  editAuthor.classList.add("form-control")
  editAuthor.setAttribute("name", "author")
  editAuthor.setAttribute("type", "text")
  editAuthor.setAttribute("placeholder", "author")
  formGroup2.appendChild(editAuthor)

  const editSubmit = document.createElement("button")
  editSubmit.setAttribute("type", "submit")
  editSubmit.classList.add("btn")
  editSubmit.classList.add("btn-primary")
  editSubmit.innerText = "Submit"
  editForm.appendChild(editSubmit)

  editForm.addEventListener("submit", handleEditSubmit)

  document.querySelector("div").insertBefore(editForm, document.querySelector("ul"))
}

function renderList(quotes) {
  const li = document.createElement("li")
  li.classList.add("quote-card")
  li.id = quotes.id
  list.appendChild(li)

  const blockquote = document.createElement("blockquote")
  blockquote.classList.add("blockquote")
  li.appendChild(blockquote)

  const p = document.createElement("p")
  p.classList.add("mb-0")
  p.innerText = quotes.quote
  blockquote.appendChild(p)

  const footer = document.createElement("footer")
  footer.classList.add("blockquote-footer")
  footer.innerText = quotes.author
  blockquote.appendChild(footer)

  const br = document.createElement("br")
  blockquote.appendChild(br)

  const likeBtn = document.createElement("button")
  likeBtn.classList.add("btn-success")
  likeBtn.innerText = "Likes: "
  const span = document.createElement("span")
  if (quotes.likes == undefined) {
    span.innerText = 0
  }
  else if (quotes.likes != []) {
    span.innerText = quotes.likes.length
  }
  else {
    span.innerText = 0
  }
  likeBtn.append(span)
  blockquote.appendChild(likeBtn)

  const deleteBtn = document.createElement("button")
  deleteBtn.classList.add("btn-danger")
  deleteBtn.innerText = "Delete"
  blockquote.appendChild(deleteBtn)

  const editBtn = document.createElement("button")
  editBtn.classList.add("btn-edit")
  editBtn.innerText = "Edit"
  blockquote.appendChild(editBtn)

  likeBtn.addEventListener("click", handleLike)
  deleteBtn.addEventListener("click", handleDelete)
  editBtn.addEventListener("click", handleEdit)
}

function getList() {
  fetch("http://localhost:3000/quotes?_embed=likes")
  .then(res => res.json())
  .then(quoteData => {
    quoteData.forEach(quote => {
      renderList(quote)
    })
  })
}

function clearList() {
  while (list.firstChild) {
    list.removeChild(list.firstChild)
  }
}

function postQuote() {
  let quoteObj = {
    "quote": newQuote.value,
    "author": author.value
  }

  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(quoteObj)
  })
  .then(res => res.json())
  .then(data => {
    renderList(data)
  })
}

function removeQuote(id) {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
}

function addLike(id) {
  let currentTime = Math.floor(Date.now() / 1000)

  fetch("http://localhost:3000/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "quoteId": parseInt(id),
      "createdAt": currentTime
    })
  })
}

function updateQuote(id) {
  let editData = {
    "quote": document.querySelector("input[name='quote']").value,
    "author": document.querySelector("input[name='author']").value
  }

  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(editData)
  })
  .then(res => res.json())
  .then(() => {
    handleEdit()
  })
}
