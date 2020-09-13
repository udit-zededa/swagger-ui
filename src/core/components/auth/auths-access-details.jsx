import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class AuthsAccessDetails extends React.Component {
  static propTypes = {
    definitions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  onAuthChange =(auth) => {
    let { name } = auth

    this.setState({ [name]: auth })
  }

  submitAuth =(e) => {
    e.preventDefault()

    let { authActions } = this.props
    authActions.authorize(this.state)
  }

  render() {
    let { definitions, getComponent, authSelectors, errSelectors } = this.props
    const AuthItemAccessDetails = getComponent("AuthItemAccessDetails")

    let authorized = authSelectors.authorized()
    let nonOauthDefinitions = definitions.filter( schema => schema.get("type") !== "oauth2")

    return (
      <div className="auth-container">
        {
          !!nonOauthDefinitions.size && <form onSubmit={ this.submitAuth }>
            {
              nonOauthDefinitions.map( (schema, name) => {
                return <AuthItemAccessDetails
                  key={name}
                  schema={schema}
                  name={name}
                  getComponent={getComponent}
                  onAuthChange={this.onAuthChange}
                  authorized={authorized}
                  authSelectors={authSelectors}
                  errSelectors={errSelectors}
                  />
              }).toArray()
            }
            
          </form>
        }
      </div>
    )
  }

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    definitions: ImPropTypes.iterable.isRequired
  }
}
