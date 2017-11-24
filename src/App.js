import React, { Component } from 'react';
import firebase from 'firebase';
import logo from './logo.svg';
import './App.css';
import FileUpload from './fileUpload';

class App extends Component {
  constructor(){
    //super(), siempre que estemso en exteds para trair el constructor del elemento padre
    super();
    this.state = {
      user:null,
      pictures: []
    };
    // IMPORTANTE: es necesario hacer lo siguiente para evitar tener 'this' fuera de contexto en algun momento, en este caso no me permitio entrar a el setState dentro de este metodo hasta que coloque el bind
    this.upload = this.upload.bind(this);
    this.renderLoggin = this.renderLoggin.bind(this);
  }
  // componentWillMount se lanza cuando el DOM recibe algun tipo de cambio, osea cuando se renderiza
  componentWillMount(){

    // onAuthStateChanged sirve para llevar el sistema de sessions, ciando nos loguamos obtiene informacion, cuando nos desloguamos pasa a null
    firebase.auth().onAuthStateChanged(user =>{
      //actualiza el state con los parametros enviados por Google Firebase
      this.setState({
        user: user
      })
    })


    firebase.database().ref('pictures').on('child_added', snapchot =>{
      this.setState({
        pictures: this.state.pictures.concat(snapchot.val())
      })
    })
  }

  upload(e){
    // file obtiene el fichero que se encuentra seleccionado
    const file = e.target.files[0];

    // hace referencia a la ruta de la carpeta 'Fotos' dentro de Google Firebase
    const storageReft = firebase.storage().ref('/Fotos/' + file.name);

    // nos permite tomar informacion del archivo subido
    const task = storageReft.put(file);

    // todo esto es para la barra de progreso
    task.on('state_changed',snapshot =>{
      // calculo del porcentaje, el cual luego es asignado a uploadValue
      let percentage =(snapshot.bytesTransferred / snapshot.totalBytes)*100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      //en caso de error durante el upload
      console.log(error.message)
    }, () =>{

      const record ={
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);



      /*// caundo la subida es finalizada muestra la foto y llena completamente la barra de progreso
      this.setState({
        uploadValue: 100,
        // esto es para obtener la url de la imagen
        //picture: task.snapshot.downloadURL
      })*/



    })
  }


  loggionForm(){
    //objeto para la autentificasion externa, en este caso google
    const provider = new firebase.auth.GoogleAuthProvider();

    //orden de abrir un popup
    firebase.auth().signInWithPopup(provider)
      // result lo retorna Firebase, .then es para cuando la conexion es correcta, .catch es cuando fracasa, ${result.user.email} simplemente accede a las variables del objeto result, la sintaxis corresponde a un concatenamiento sin separar el string, esta sintaxis por alguna razon no me funciono :(
      .then(result => console.log(result.user.email + ' ha iniciado sesion'))
      .catch(error => console.log('Error ' + error.code + ' : ' + error.message))
  }
  renderLoggout(){
    firebase.auth().signOut()
      .then(result => console.log(result.user.email + ' ha iniciado cerrado sesion'))
      .catch(error => console.log('Error ' + error.code + ' : ' + error.message))
  }

  renderLoggin(){
    //si el usuario esta logueado    ---- this.state.user sin comparador quiere decir que es diferente a null
    if(this.state.user){
      return(
        <div>
          <img width='100' src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola {this.state.user.displayName}</p>
          <button onClick={this.renderLoggout}>Cerrar sesion</button>

          <br/><br/>
          <FileUpload onUpload={this.upload}/>
          {
            this.state.pictures.map(picture => (
              <div className='itemContainer'>
                <img className='imageItem' src={picture.image} />
                <br/>
                <div className='itemInfo'>
                  <img className='itemUserPicture' src={picture.photoURL} alt={picture.displayName} />
                  <br/>
                  <span className='itemUserName'>{picture.displayName}</span>
                </div>
              </div>
            ))
          }
        </div>
      );
    }
    else{
      return(
        <button onClick={this.loggionForm}>Loggin</button>
      )

    }
    //si el usuario no esta logueado
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.renderLoggin()}
        </p>
      </div>
    );
  }
}

export default App;
