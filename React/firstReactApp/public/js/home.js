var NoteBox = React.createClass({
  loadNotes: function () {
    $.ajax({
      url: "/api/notes",
      dataType: 'json',
      cache: false,
      success: function (res) {
        this.setState({data: res});
      }.bind(this),
      error: function (err) {
        console.log("Error: ", err);
      }.bind(this)
    })
  },
  handleNewNote: function (note) {
    var notes = this.state.data;

    note.id = Date.now();
    var newNotes = notes.concat([note]);
    this.setState({data: newNotes});
    
    $.ajax({
      url:this.props.url,
      dataType: 'json',
      type:'POST',
      cache: false,
      data: note,
      success: function (res) {
        this.setState({data: res});
      }.bind(this),
      error: function (err) {
        console.log("Error: ", err);
      }.bind(this)
    })
  },
  getInitialState: function () {
    return {data: []};
  },
  componentDidMount: function () {
    this.loadNotes();
    setInterval(this.loadNotes, this.props.pollInterval);
  },
  render: function () {
    return (
      <div className="noteBox">
        <h1>Notes</h1> 
        <NoteList data={this.state.data}/>
        <NoteForm onPinNewNote={this.handleNewNote} />   
      </div>
    )
  }
});

var NoteList = React.createClass({
  render: function () {
    var noteNodes = this.props.data.map(function (note) {
      return (
        <Note name={note.name} key={note.id} id={note.id}>
         {note.message}
        </Note>
      )
    });
    return (
      <div className="noteList">
        {noteNodes}
      </div>
    )
  }
});

var Note = React.createClass({
  deleteRequest: function (id) {
    console.log("in the App");
    $.ajax({
      url: "/api/notes",
      dataType: 'json',
      type:'DELETE',
      data: id,
      success: function (res) {
        console.log("success: ",res);
      }.bind(this),
      error: function (err) {
        console.log("Error: ", err);
      }.bind(this) 
    })
  },
  render: function () {
    return (
      <div className="note">
        <h3 className="noteName">
          {this.props.name.toString()}<button onClick={this.deleteRequest(this.props.id)}>X</button>
        </h3>
        <p>{this.props.children.toString()}</p>
      </div>
    )
  }
});

var NoteForm = React.createClass({
  getInitialState: function () {
    return {name: '', message: ''};
  },
  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },
  handleMessageChange: function (e) {
    this.setState({message: e.target.value});
  },
  addNewNote: function (e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var message = this.state.message.trim();

    this.props.onPinNewNote({name: name, message: message});
    this.setState({name:'', message:''});

  },
  render: function () {
    return (
      <form className="noteForm" onSubmit={this.addNewNote}>
        <input 
        className="title"
        type="text" 
        placeholder="Note Title"
        value={this.state.name}
        onChange={this.handleNameChange}
        />
        <textarea 
        type="textarea"
        rows="5"
        cols="25"
        placeholder="Your Note ..."
        value={this.state.message}
        onChange={this.handleMessageChange}
        >
        </textarea>
        <input className="button" type="submit" value="Add New Note" />
      </form>
    )
  }
});

ReactDOM.render(
  <NoteBox url="/api/notes" pollInterval={2000}/>,
  document.getElementById('content')
);