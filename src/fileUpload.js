import React, {Component} from 'react';


class fileUpload extends Component{

  constructor(){
    super();
    this.state ={
      uploadValue: 0,
      //picture: null
    };


  }



  render(){
    return(
      <div>
        <progress value={this.state.uploadValue} max='100'></progress>
        <br/>
        {//envia un props con el evento que vamos a activar, en este caso activaremos lo que la propiedad onUpload tenga, en el arcvhico donde se invoca el componente, en este caso App.js
        }
        <input type='file' onChange={this.props.onUpload} />
        <br/>
        {//<img width='320' src={this.state.picture} alt=''/>
        }
      </div>
    )
  }
}

export default fileUpload;
