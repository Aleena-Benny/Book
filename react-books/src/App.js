import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Label, Input, FormGroup, Col } from 'reactstrap';
import axios from "axios";

class App extends Component {
  state = {
    books: [],
    acesstoken: '',
    newBookData: {
      title: '',
      description: '',
      price: null,
      author_id: null,
    },
    editBookData: {
      id: '',
      title: '',
      description: '',
      price: null,
      author_id: null
    },
    newBookModal: false,
    editBookModal: false
  }
  componentWillMount() {
    this._refreshBooks();
  }
  componentDidMount() {
    var config = {
      username: 'admin@bookmanager.com',
      password: 'admin1234',
      grant_type: 'password',
      client_id: '2',
      client_secret: '7hlUcihMJAwr3WjtWPsqnrlUXkdrISn7Kn9b5o5I'
    };


    axios.post('http://bookmanager.altd.in/oauth/token', config).then(({ data }) => {
      if (data.access_token) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + data.access_token;
        axios.get('http://bookmanager.altd.in/books').then(booksData => {
          console.log(booksData, "books");
          const books = booksData.data.data;
          console.log(books, "books");
          this.setState({ books });
          this.setState({
            acesstoken: data.access_token
          })
        })
      }
    })
  }

  toggleNewBookModal() {
    this.setState({
      newBookModal: !this.state.newBookModal
    });
  }
  toggleEditBookModal() {
    this.setState({
      editBookModal: !this.state.editBookModal
    });
  }
  addBook() {
    axios.defaults.headers.common['Authorization'] = "Bearer " + this.state.acesstoken;
    axios.post('http://bookmanager.altd.in/books', this.state.newBookData).then((response) => {
      let { books } = this.state;
      books.push(response.data);
      this.setState({
        books, newBookModal: false,
        newBookData: {
          title: '',
          description: '',
          price: null,
          author_id: null
        },
      })
    });
  }
  updateBook() {
    debugger
    let { title, description, price, author_id } = this.state.editBookData;
    axios.defaults.headers.common['Authorization'] = "Bearer " + this.state.acesstoken;
    axios.put('http://bookmanager.altd.in' + this.state.editBookData.id, {
      title, description, price, author_id
    }).then((response) => {
      debugger
      this._refreshBooks();
      this.setState({
        editBookModal: false, editBookData: { id: '', title: '', description: '', price: null, author_id: null }
      })
      console.log(response.data)
    })
  }
  editBook(id, title, description, price, author_id) {
    this.setState({
      editBookData: { id, title, description, price, author_id }, editBookModal: !this.state.editBookModal
    });

  }
  deleteBook(id) {
    axios.defaults.headers.common['Authorization'] = "Bearer " + this.state.acesstoken;
    axios.delete('http://bookmanager.altd.in/books' + id).then((response) => {
      this._refreshBooks();
    });
  }
  _refreshBooks() {
    axios.defaults.headers.common['Authorization'] = "Bearer " + this.state.acesstoken;
    axios.get('http://bookmanager.altd.in/books').then(booksData => {
      console.log(booksData, "books");
      const books = booksData.data;
      console.log(books, "books");
      this.setState({
        books: booksData.data
      });
    })
  }

  render() {
    let books = this.state.books.map((book) => {
      return (
        <tr key={book.id}>
          <td>{book.id}</td>
          <td>{book.title}</td>
          <td>{book.description}</td>
          <td>{book.price}</td>
          <td>{book.author_id}</td>
          <td>
            <Button color="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, book.id, book.title, book.description, book.price, book.author_id)}>Edit</Button>
          </td>
          <td>
            <Button color="danger" size="sm" onClick={this.deleteBook(this, book.id)}>Delete</Button>

          </td>
        </tr>
      )
    });
    return (
      <div className="App container">
        <h1>Books App</h1>
        <Button color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add Book</Button>
        <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Model title</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input id="title" value={this.state.newBookData.title} onChange={(e) => {
                let { newBookData } = this.state;
                newBookData.title = e.target.value;
                this.setState({ newBookData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="description">description</Label>
              <Col sm={10}>
                <Input type="textarea" id="description" value={this.state.newBookData.description} onChange={(e) => {
                  let { newBookData } = this.state;
                  newBookData.description = e.target.value;
                  this.setState({ newBookData });
                }} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Label for="price">price</Label>
              <Input id="price" value={this.state.newBookData.price} onChange={(e) => {
                let { newBookData } = this.state;
                newBookData.price = e.target.value;
                this.setState({ newBookData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="author_id">author_id</Label>
              <Input id="author_id" value={this.state.newBookData.author_id} onChange={(e) => {
                let { newBookData } = this.state;
                newBookData.author_id = e.target.value;
                this.setState({ newBookData });
              }}

              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>
            <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a new Book</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input id="title" value={this.state.editBookData.title} onChange={(e) => {
                let { editBookData } = this.state;
                editBookData.title = e.target.value;
                this.setState({ editBookData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="description">description</Label>
              <Input id="description" value={this.state.editBookData.description} onChange={(e) => {
                let { editBookData } = this.state;
                editBookData.description = e.target.value;
                this.setState({ editBookData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="price">price</Label>
              <Input id="price" value={this.state.editBookData.price} onChange={(e) => {
                let { editBookData } = this.state;
                editBookData.price = e.target.value;
                this.setState({ editBookData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="author_id">author_id</Label>
              <Input type="select" name="selectMulti" id="author_id" value={this.state.editBookData.author_id} onChange={(e) => {
                let { editBookData } = this.state;
                editBookData.author_id = e.target.value;
                this.setState({ editBookData });
              }}>
                <option>{this.state.editBookData.author_id}</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateBook.bind(this)}>Update Book</Button>
            <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>cancel</Button>
          </ModalFooter>
        </Modal>
        <Table>
          <thead>
            <tr>
              <th>id</th>
              <th>Title</th>
              <th>description</th>
              <th>price</th>
              <th>author_id</th>
            </tr>
          </thead>
          <tbody>
            {books}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
