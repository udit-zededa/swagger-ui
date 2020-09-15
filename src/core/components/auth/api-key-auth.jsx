import React from "react"
import PropTypes from "prop-types"

export default class ApiKeyAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    authSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema, authorized, authSelectors } = this.props
    let auth = authorized && authorized.get(name)
    let authConfigs = authSelectors.getConfigs() || {}
    let value = this.getValue()
    let scopes = auth && auth.get("scopes") || authConfigs.scopes || []
    if (typeof scopes === "string") {
      scopes = scopes.split(authConfigs.scopeSeparator || " ")
    }

    this.state = {
      name: name,
      schema: schema,
      scopes: scopes,
      value: value
    }
  }

  getValue () {
    let { name, authorized } = this.props

    return authorized && authorized.getIn([name, "value"])
  }

  onChange =(e) => {
    let { onChange } = this.props
    let value = e.target.value
    let newState = Object.assign({}, this.state, { value: value })

    this.setState(newState)
    onChange(newState)
  }

  onScopeChange =(e) => {
    let { target } = e
    let { checked } = target
    let scope = target.dataset.value

    if ( checked && this.state.scopes.indexOf(scope) === -1 ) {
      let newScopes = this.state.scopes.concat([scope])
      this.setState({ scopes: newScopes })
    } else if ( !checked && this.state.scopes.indexOf(scope) > -1) {
      this.setState({ scopes: this.state.scopes.filter((val) => val !== scope) })
    }
  }

  selectScopes =(e) => {
    if (e.target.dataset.all) {
      this.setState({
        scopes: Array.from((this.props.schema.get("allowedScopes") || this.props.schema.get("scopes")).keys())
      })
    } else {
      this.setState({ scopes: [] })
    }
  }

  render() {
    let { schema, getComponent, errSelectors, name, authSelectors } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent("Markdown", true)
    const JumpToPath = getComponent("JumpToPath", true)
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
    let scopes = schema.get("allowedScopes") || schema.get("scopes")
    let flow = schema.get("flow")
    let authorizedAuth = authSelectors.authorized().get(name)
    let isAuthorized = !!authorizedAuth

    return (
      <div>
        <h4>
          <code>{ name || schema.get("name") }</code>&nbsp;
          (apiKey)
          <JumpToPath path={[ "securityDefinitions", name ]} />
        </h4>
        { value && <h6>Authorized</h6>}
        <Row>
          <Markdown source={ schema.get("description") } />
        </Row>
        <Row>
          <p>Name: <code>{ schema.get("name") }</code></p>
        </Row>
        <Row>
          <p>In: <code>{ schema.get("in") }</code></p>
        </Row>
        <Row>
          <label>Value:</label>
          {
            value ? <code> ****** </code>
                  : <Col><Input type="text" onChange={ this.onChange }/></Col>
          }
        </Row>
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
        {
          !isAuthorized && scopes && scopes.size ? <div className="scopes">
            <h2>
              Scopes:
              <a onClick={this.selectScopes} data-all={true}>select all</a>
              <a onClick={this.selectScopes}>select none</a>
            </h2>
            { scopes.map((description, name) => {
              return (
                <Row key={ name }>
                  <div className="checkbox">
                    <Input data-value={ name }
                          id={`${name}-${flow}-checkbox-${this.state.name}`}
                           disabled={ isAuthorized }
                           checked={ this.state.scopes.includes(name) }
                           type="checkbox"
                           onChange={ this.onScopeChange }/>
                         <label htmlFor={`${name}-${flow}-checkbox-${this.state.name}`}>
                           <span className="item"></span>
                           <div className="text">
                             <p className="name">{name}</p>
                             <p className="description">{description}</p>
                           </div>
                         </label>
                  </div>
                </Row>
              )
              }).toArray()
            }
          </div> : null
        }
      </div>
    )
  }
}
