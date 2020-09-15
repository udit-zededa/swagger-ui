import React from "react"
import PropTypes from "prop-types"

export default class ApiKeyAuthAccessDetails extends React.Component {
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
  
  render() {
    let { schema, getComponent, name, authSelectors } = this.props
    const Markdown = getComponent("Markdown", true)
    let scopes = schema.get("allowedScopes") || schema.get("scopes")
    let authorizedAuth = authSelectors.authorized().get(name)
    let isAuthorized = !!authorizedAuth

    return (
      <div>
        <div className="opblock-section-header">
            <h4>Security</h4>
        </div>
        <div className="table-container">
          <table className="security">
              <thead>
                <tr>
                  <th className="col_header parameters-col_security_type">Security Type</th>
                  <th className="col_header parameters-col_description">Description</th>
                  <th className="col_header parameters-col_name">Name</th>
                  <th className="col_header parameters-col_in">In</th>
                  <th className="col_header parameters-col_scope">Scopes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                      <code>{ name || schema.get("name") }</code>&nbsp;
                      <h4>(apiKey)</h4>
                  </td>
                  <td>
                      <Markdown source={ schema.get("description") } />
                  </td>
                  <td>
                    <code>{ schema.get("name") }</code>
                  </td>
                  <td>
                    <code>{ schema.get("in") }</code>
                  </td>
                  <td>
                  {
                    !isAuthorized && scopes && scopes.size ? <div className="scopes">
                      { scopes.map((description, name) => {
                        return (
                                     <div className="text">
                                       <h4 className="name">{name}</h4>&nbsp;
                                       <code className="description">{description}</code>
                                     </div>
                        )
                        }).toArray()
                      }
                    </div> : null
                  }
                  </td>
                  </tr>
              </tbody>
            </table>
        </div>
      </div>
    )
  }
}
