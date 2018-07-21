import React, { Component } from 'react'
import { connect } from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import { sendApplication } from '../../actions/career';
import TextFieldGroup from '../common/TextFieldGroup';


class OfferForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      subject: '',
      email: '',
      attachment: null,
      errors: {}
    };
  }

  static getDerivedStateFromProps = (nextProps) => {
    if(nextProps.errors) {
      return { errors: nextProps.errors };
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { message, subject, email, attachment } = this.state;

    this.props.sendApplication({ message, subject, email, attachment, offerId: this.props.id }, this.props.history);

  }

  handleUploadFile = event => {
    let selectedFile = event.target.files;
    let file = null;
    let fileName = "";

    if (selectedFile.length > 0) {

        if(!selectedFile[0].type.includes('pdf')) {
          this.setState({
            errors: {
              ...this.state.errors,
              file: 'Invalid image file type!'
            }
          })
        }

        if(selectedFile[0].size > 1536) {
          this.setState({
            errors: {
              ...this.state.errors,
              file: 'File is too big'
            }
          })
        }

        let fileToLoad = selectedFile[0];
        fileName = fileToLoad.name;

        let fileReader = new FileReader();

        fileReader.onload = fileLoadedEvent => {
            file = fileLoadedEvent.target.result;

            const base64File = new Buffer(file).toString('base64');

            this.setState({
              attachment: { base64File, fileName },
            })
        };

        fileReader.readAsArrayBuffer(fileToLoad);

    }

  }

  handleChange = e => {
    const { name, value } = e.target;
  	this.setState({
  		[name]: value,
  	});
  };

  render() {
    const { errors, message, subject, email } = this.state;

    return (
      <form noValidate onSubmit={this.onSubmit}>
        <div className="form-group">
          <TextFieldGroup
            placeholder="Your email"
            name="email"
            type="email"
            value={email}
            onChange={this.handleChange}
            error={errors.email}
          />
          <TextFieldGroup
            placeholder="Subject"
            name="subject"
            type="text"
            value={subject}
            onChange={this.handleChange}
            error={errors.subject}
          />
          <TextAreaFieldGroup
            placeholder="Some message"
            name="message"
            value={message}
            onChange={this.handleChange}
            error={errors.message}
          />
        </div>
        <input onChange={this.handleUploadFile} type="file" name="upload" accept="application/pdf" />
        <button type="submit" className="btn btn-dark">
          Send application
        </button>
      </form>
    );
  }
}

const mapStateToProps = ({ errors }) => ({ errors })

export default connect(mapStateToProps, { sendApplication })(OfferForm);
