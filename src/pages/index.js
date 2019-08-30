import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import GitUser from "../components/GitUser"

import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import ListGroup from "react-bootstrap/ListGroup"
import Form from "react-bootstrap/Form"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeSlash as hiddenIcon } from "@fortawesome/free-regular-svg-icons"
import { faEye as visibleIcon } from "@fortawesome/free-solid-svg-icons"

import GitReviewer from "../components/gitReviewer"

function addOneOrCreateForDict(dict, key) {
  if (!dict.hasOwnProperty(key)) {
    dict[key] = 0;
  }
  dict[key] += 1;
}

function addToDefaultDict(dict, key, value) {
  if (!dict.hasOwnProperty(key)) {
    dict[key] = value;
  }
}

function UUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
console.log(process.env)
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

class IndexPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showOAuth: true,
      gr: null,
      storage: window ? window.localStorage : null
    }
    this.handleCookies();
  }

  addNewGitReviewerToState = (token = null) => {
    this.setState({
      gr: new GitReviewer({token: token}, (e, r, res) => {
        if (!e) {
          this.forceUpdate()
        } else {
          this.prepareForFirstTimeGitAuth();
        }
      })
    });
  }

  prepareForFirstTimeGitAuth = () => {
    this.state.storage.removeItem("token");
    this.state.storage.setItem('state', UUID());
    this.setState({
      gr: null,
      showOAuth: true
    })
  }

  handleCookies = () => {
    let token = this.state.storage.getItem('token');
    let state = this.state.storage.getItem('state');
    if (token && state) {
      // Receieved response from Github for permanent token, check states, store until expiration, clear state

    } else if (token) {
      // Instantiate new GitReviewer with token
      this.addNewGitReviewerToState(token);
    } else if (state) {
      // Received temporary in parameters, check states, store token, make request for permanent
      // Submit a post form to https://github.com/login/oauth/access_token from https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
    } else {
      // Show button for Oauth to Github
      // Set random state string
      this.prepareForFirstTimeGitAuth();
    }
  }
  

  getAddAndClearUser = (e) => {
    e.preventDefault();

    let success = (err, data, res, user) => {
      if (!err && data && data.login) { 
        this.forceUpdate()
      }
    }
    let user = e.target.elements['username'].value;
    this.state.gr.addUser(user, success);
    e.target.reset();
    
  }



  render() {
    console.log(this.state);
    const addUserElement = (<div className="d-flex justify-content-center">
      <Form onSubmit={this.getAddAndClearUser} >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Github Username</Form.Label>
          <Form.Control name="username" placeholder="Enter email" />
          <Form.Text className="text-muted">
            Username, not email.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>)

  const state = this.state.storage.getItem("state");

  const loginToGithubElement = (<div className="d-flex justify-content-center">
    <Form method="GET" action="https://github.com/login/oauth/authorize" >
      <Form.Group controlId="githubLoginForm">
        <Form.Control name="client_id" readOnly hidden value={clientID} />
        <Form.Control name="redirect_uri" readOnly hidden value="https://gitreview.netlify.com" />
        <Form.Control name="scope" readOnly hidden value="repo" />
        <Form.Control name="state" readOnly hidden value={state} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Login To Gihub
      </Button>
    </Form>
  </div>)

    return (<Layout>
      <SEO title="Home" />
      <div className="d-flex flex-column mt-2">
        {addUserElement}
        {this.state.showOAuth && loginToGithubElement}
        {this.state.gr && Object.keys(this.state.gr.getUsers()).map((login) => <GitUser key={login} user={this.state.gr.users[login]}/>)}
      </div>
    </Layout>)
  }
}

export const query = graphql`
query IndexQuery {
  site {
    siteMetadata {
      rssMetadata {
        title
      }
    }
  }
}
`;
export default IndexPage
